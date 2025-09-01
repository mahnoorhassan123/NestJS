import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';
import { Prisma } from '@prisma/client';
import { SlackService } from 'src/common/services/slack.service';
import * as xml2js from 'xml2js';
import { promises as fs } from 'fs';
import { parseStringPromise } from 'xml2js';
import axios from 'axios';
import { MailHelper } from '../helpers/mail.helper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductDto } from '../dtos/product.dto';
import { ProductLogDto } from '../dtos/product-log.dto';
import { ProductLogEntity } from '../entities/product-log.entity';
import { ProductLogMapper } from '../mappers/product-log.mapper';


@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly slackService: SlackService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async getProducts(): Promise<{ status: boolean; msg: string; data: ProductEntity[] }> {
    const results: Prisma.ProductGetPayload<{
      select: {
        ProductID: true;
        ProductCode: true;
        IsFeatured: true;
        HideProduct: true;
      };
    }>[] = await this.prisma.product.findMany({
      select: {
        ProductID: true,
        ProductCode: true,
        IsFeatured: true,
        HideProduct: true,
      },
      where: {
        isCompleted: true,
        IsDeleted: false,
      },
      orderBy: [
        { PriorityIndex: 'asc' },
        { ProductID: 'asc' },
      ],
    });

    const entities = results.map((p) => ProductMapper.toSummary(p));

    return {
      status: true,
      msg: 'success',
      data: entities,
    };
  }

  async getAllProducts(tags: string) {
    let tagJoinCondition = '';

    if (tags !== '-1') {
      const queryTag = tags
        .split(',')
        .map((str) => Number(str))
        .filter((id) => !isNaN(id));

      tagJoinCondition = ` AND (t.tagid IN (${queryTag.toString()}) OR t.tagid IS NULL) `;
    }

    const joins = `
    LEFT JOIN product_class ON products.productClassId = product_class.Id 
    LEFT JOIN product_subclass ON products.productSubClassId = product_subclass.Id
    LEFT JOIN tag_tables t ON products.ProductID = t.tableId
  `;

    const subQueryFields = `
    product_class.Name AS ClassName, 
    product_subclass.Name AS SubClassName,
    products.productClassId, 
    products.productSubClassId
  `;

    const query = `
    SELECT 
      products.ProductID,
      ${subQueryFields}, 
      products.ProductCode,
      products.ProductName,
      product_subclass.Name AS Product_Subclass,
      products.OptionIDs,
      products.ExportDescription,
      products.CountryOfOrigin,
      products.UnitOfMeasure,
      products.ExportControlClassificationNumber,
      products.HarmonizedCode,
      products.ProductPhotoURL,
      products.ProductDescriptionShort,
      products.ProductPrice,
      products.ProductWeight,
      products.HideProduct,
      products.CreatedOn,
      products.Discount,
      products.PriorityIndex,
      products.IsActive,
      products.isMultiClassification,
      products.isSerialAble,
      products.IsFeatured,
      products.FreeAccessories
    FROM products
    ${joins}
    WHERE products.IsDeleted = 0 AND products.isCompleted = 1
    ${tagJoinCondition}
    GROUP BY products.ProductCode
    ORDER BY products.PriorityIndex, products.ProductID ASC;
  `;

    try {
      return await this.prisma.$queryRawUnsafe(query);
    } catch (err) {
      const errorMessage = JSON.stringify(err.message);
      await this.slackService.send(
        `File: products.service.ts\nAction: getAllProducts\nError: ${errorMessage}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      this.logger.error(`Error fetching products: ${err.message}`, err.stack);
      throw err;
    }
  }



  async getProduct(id: number) {
    const query = `
      SELECT 
        p.*, 
        pc.CategoryID, 
        i.ImageURL, i.IsThumb, i.ID, i.DisplayOrder, i.TableID, 
        pd.Name, pd.ProductDetailID, pd.URL
      FROM products p
      LEFT JOIN product_category pc ON pc.ProductID = p.ProductID
      LEFT JOIN images i ON p.ProductID = i.TableID AND i.TableName = 'Product'
      LEFT JOIN product_details pd ON pd.ProductID = p.ProductID
      WHERE p.IsDeleted = 0 AND p.isCompleted = 1 AND p.ProductID = ${id}
      ORDER BY i.DisplayOrder ASC
    `;

    try {
      const records: any[] = await this.prisma.$queryRawUnsafe(query);

      if (records.length > 0) {
        // Store category
        const catQuery = `SELECT CategoryID FROM product_category WHERE ProductID = ${id} AND storeCat = 1`;
        const catArray: any[] = await this.prisma.$queryRawUnsafe(catQuery);

        if (catArray?.length && catArray[0].CategoryID) {
          records[0].storeCat = catArray[0].CategoryID;
        }

        // Tags
        const tagsQuery = `SELECT tagid FROM tag_tables WHERE tableId = ${id} AND tableName = 'products'`;
        const tagsArray: any[] = await this.prisma.$queryRawUnsafe(tagsQuery);

        records[0].tagsArray = tagsArray ? tagsArray.map(t => t.tagid) : [];
      }

      return records;
    } catch (err) {
      const errorMessage = JSON.stringify(err.message);
      await this.slackService.send(
        `File: products.service.ts\nAction: getProduct\nError: ${errorMessage}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      this.logger.error(`Error fetching product: ${err.message}`, err.stack);
      throw err;
    }
  }

  async validateXmlFile(filePath: string, originalName: string) {
    try {
      const data = await fs.readFile(filePath);
      const parser = new xml2js.Parser();
      const parsed = await parser.parseStringPromise(data);

      if (
        parsed &&
        parsed.Export &&
        parsed.Export.Products_Joined &&
        parsed.Export.Products_Joined.length > 0
      ) {
        return {
          success: true,
          message: 'Valid file, Press import!',
          path: filePath,
        };
      } else {
        return {
          success: false,
          message: 'Invalid file or XML.',
          path: originalName,
        };
      }
    } catch {
      return {
        success: false,
        message: 'Invalid XML format.',
        path: originalName,
      };
    }
  }

  async importFromXmlPath(path: string, userId: number | null) {
    try {
      const data = await fs.readFile(path);
      const xml = await parseStringPromise(data);
      const products = xml?.Export?.Products_Joined ?? [];

      const success = await this.importProducts(products, userId);
      return { success, path };
    } catch (err: any) {
      await this.slackService.send(
        `Error in importFromXmlPath: ${err.message}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      throw err;
    }
  }

  private async importProducts(products: any[], userId: number | null) {
    let success = true;

    for (const elem of products) {
      try {
        const get = (k: string) => (Array.isArray(elem[k]) ? elem[k][0] : elem[k]);
        const productCode = get('productcode');
        if (!productCode) continue;

        const updateData = {
          ProductPrice: parseFloat(get('productprice') || 0),
          ProductWeight: parseFloat(get('productweight') || 0),
          Hide_FreeAccessories: get('hide_freeaccessories') === '1',
          TaxableProduct: get('taxableproduct') === '1',
          HideProduct: get('hideproduct') === '1' ? "1" : "0",
          Availability: get('availability'),
          FreeAccessories: get('freeaccessories'),
          OptionIDs: get('optionids'),
        };

        const xmlProductId = parseInt(get('ProductID'));
        if (xmlProductId && userId) {
          await this.updateProductLog(xmlProductId, updateData, userId);
        }

        // Find existing product by ProductCode
        let product = await this.prisma.product.findFirst({
          where: { ProductCode: productCode },
        });

        if (product) {
          // Update existing product
          product = await this.prisma.product.update({
            where: { ProductID: product.ProductID },
            data: updateData,
          });
        } else {
          // Create new product
          const xmlProductId = parseInt(get('ProductID'));
          product = await this.prisma.product.create({
            data: {
              ProductID: xmlProductId,
              ProductCode: productCode,
              ...updateData
            },
          });
        }

        // Product Details
        const productDetailsRaw = elem.ProductDetails || [];
        for (const pd of productDetailsRaw) {
          const pdName = pd.Name?.[0] || 'Unknown';
          const pdUrl = pd.URL?.[0] || '';

          await this.prisma.productDetail.upsert({
            where: { ProductDetailID: parseInt(pd.ProductDetailID?.[0] || '0') || 0 },
            create: { ProductID: product.ProductID, Name: pdName, URL: pdUrl },
            update: { Name: pdName, URL: pdUrl },
          });
        }

        // Images
        const imagesRaw = elem.Images || [];
        for (const img of imagesRaw) {
          await this.prisma.image.upsert({
            where: { ID: parseInt(img.ID?.[0] || '0') || 0 },
            create: {
              TableID: product.ProductID,
              TableName: 'Product',
              ImageURL: img.ImageURL?.[0] || '',
              DisplayOrder: parseInt(img.DisplayOrder?.[0] || '0'),
              IsThumb: img.IsThumb?.[0] === '1',
            },
            update: {
              ImageURL: img.ImageURL?.[0] || '',
              DisplayOrder: parseInt(img.DisplayOrder?.[0] || '0'),
              IsThumb: img.IsThumb?.[0] === '1',
            },
          });
        }

        // Tags
        const tagsRaw = elem.Tags || [];
        if (tagsRaw.length > 0) {
          await this.prisma.tagTable.deleteMany({ where: { tableId: product.ProductID, tableName: 'products' } });
          await this.prisma.tagTable.createMany({
            data: tagsRaw.map(t => ({ tableId: product.ProductID, tableName: 'products', tagid: parseInt(t.tagid?.[0] || '0') })),
          });
        }

        // Categories
        const catRaw = get('categoryids') || '';
        const categories = catRaw.split(',').map(c => parseInt(c)).filter(Boolean);
        if (categories.length > 0) {
          await this.prisma.productCategory.deleteMany({ where: { ProductID: product.ProductID } });
          await this.prisma.productCategory.createMany({
            data: categories.map(c => ({ ProductID: product.ProductID, CategoryID: c, storeCat: 0 })),
            skipDuplicates: true,
          });
        }
      } catch (err: any) {
        success = false;
        await this.slackService.send(
          `Error in importProducts: ${err.message}`,
          'J.A.R.V.I.S',
          'C029PF7DLKE',
        );
      }
    }

    return success;
  }


  private async updateProductLog(productId: number, newData: any, userId: number) {
    try {
      const old = await this.prisma.product.findUnique({ where: { ProductID: productId } });
      if (!old) return;

      const changed: any = {};
      const previous: any = {};
      Object.keys(newData).forEach(key => {
        if (newData[key] !== old[key]) {
          changed[key] = newData[key];
          previous[key] = old[key];
        }
      });

      if (Object.keys(changed).length === 0) return;

      await this.prisma.productLog.create({
        data: {
          product_id: productId,
          user_id: userId,
          operation: 'UPDATE',
          old_data: previous,
          new_data: changed,
        },
      });
    } catch (err: any) {
      await this.slackService.send(
        `Error in updateProductLog: ${err.message}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
    }
  }

  async saveProduct(product: any, fileNames: string[], user: any) {
    try {
      const tags = product.tagsArray || [];
      delete product.tags;
      delete product.tagsArray;

      product.CreatedOn = new Date().toISOString();

      if (!product.ProductID) {
        product.CreatedBy = user.id;
      }

      // fields stored as varchar(10) in DB (normalize to "1"/"0")
      const varcharBooleanFields = ['HideProduct'];

      // fields stored as real booleans in Prisma schema (normalize to true/false)
      const prismaBooleanFields = ['HideWhenOutOfStock', 'IsActive', 'IsFeatured', 'isCompleted', 'isSerialAble', 'IsFreeProduct', 'backlog_show',
        'holdForApproval', 'Accessory', 'Maintenance', 'Upgrade', 'Resale', 'isMultiClassification'];

      // normalize varchar booleans → "1"/"0"
      varcharBooleanFields.forEach(field => {
        if (product[field] !== undefined && product[field] !== null) {
          if (typeof product[field] === 'boolean') {
            product[field] = product[field] ? "1" : "0";
          } else if (typeof product[field] === 'number') {
            product[field] = product[field] === 1 ? "1" : "0";
          } else if (typeof product[field] === 'string') {
            product[field] = ["true", "y", "1"].includes(product[field].toLowerCase()) ? "1" : "0";
          }
        }
      });

      // normalize Prisma booleans → true/false
      prismaBooleanFields.forEach(field => {
        if (product[field] !== undefined && product[field] !== null) {
          if (typeof product[field] === 'string') {
            product[field] = ["true", "y", "1"].includes(product[field].toLowerCase());
          } else if (typeof product[field] === 'number') {
            product[field] = product[field] === 1;
          }
        }
      });


      // normalize numeric fields before DB save
      const intFields = ['PriorityIndex', 'productClassId', 'productSubClassId', 'BackupProductPrice', 'backlog_priority',];

      intFields.forEach(field => {
        if (product[field] !== undefined && product[field] !== null) {
          product[field] = Number(product[field]);
        }
      });


      // Check if product with same ProductCode exists
      const existing = await this.prisma.product.findFirst({
        where: {
          ProductCode: product.ProductCode,
          IsDeleted: false,
        },
        orderBy: { ProductID: 'desc' },
      });

      if (existing && product.ProductID !== existing.ProductID) {
        return { status: false, msg: 'Product with ProductCode already exists' };
      }

      // Generate ProductID if new
      if (!product.ProductID) {
        const maxIdRecord = await this.prisma.product.aggregate({
          _max: { ProductID: true },
        });
        let id = maxIdRecord._max.ProductID || 200000;
        if (id < 200000) id = 200001;
        else id = id + 1;
        product.ProductID = id;
      } else {
        product.ModifiedBy = user.id;
      }

      const categories = product.Categories || [];
      const storeCat = product.storeCat;
      delete product.Categories;
      delete product.storeCat;
      delete product.Product_Subclass;
      delete product.originalSubclass;
      delete product.updatedDateBacklogComment;

      // Allowed fields that actually exist in Prisma schema
      const allowedFields = ['ProductID', 'ProductCode', 'ProductName', 'ProductDescriptionShort', 'ProductDescription', 'ProductNameShort', 'ProductPrice',
        'ProductPriceYuan', 'ProductPriceYen', 'ProductPriceEuro', 'ProductPricePound', 'ProductPriceWON', 'ProductPriceINR', 'ProductWeight', 'FreeShippingItem',
        'Photo_AltText', 'Hide_FreeAccessories', 'TaxableProduct', 'TechSpecs', 'HideProduct', 'ModifyOn', 'CreatedOn', 'StockStatus', 'Availability', 'ProductPrice_Name',
        'ProductManufacturer', 'SalePrice_Name', 'Accessories', 'OptionIDs', 'FreeAccessories', 'ProductDetailURL', 'ExtInfo', 'ProductDescription_AbovePricing', 'ProductPhotoURL',
        'Discount', 'METATAG_Description', 'METATAG_Keywords', 'PriorityIndex', 'HideWhenOutOfStock', 'IsActive', 'isCompleted', 'IsFeatured', 'TitleImage', 'isSerialAble',
        'IsFreeProduct', 'HarmonizedCode', 'ExportControlClassificationNumber', 'UnitOfMeasure', 'CountryOfOrigin', 'ExportDescription', 'GroupId', 'backlog_priority',
        'backlog_show', 'backlog_leadtime', 'backlog_comments', 'holdForApproval', 'Accessory', 'Maintenance', 'Upgrade', 'Resale', 'gpn', 'isMultiClassification', 'CreatedBy', 'ModifiedBy',
      ];

      const filteredData = Object.keys(product)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = product[key];
          return obj;
        }, {});


      // Upsert Product
      const { productClassId, productSubClassId, ...rest } = product;

      await this.prisma.product.upsert({
        where: { ProductID: product.ProductID },
        create: {
          ProductID: product.ProductID,
          ...filteredData,
          ...(productClassId ? { productClass: { connect: { Id: productClassId } } } : {}),
          ...(productSubClassId ? { productSubClass: { connect: { Id: productSubClassId } } } : {}),
        },
        update: {
          ProductID: product.ProductID,
          ...filteredData,
          ...(productClassId ? { productClass: { connect: { Id: productClassId } } } : {}),
          ...(productSubClassId ? { productSubClass: { connect: { Id: productSubClassId } } } : {}),
        },
      });


      // Categories
      await this.prisma.productCategory.deleteMany({
        where: { ProductID: product.ProductID },
      });

      if (categories.length > 0) {
        const categoryData = categories.map((c) => ({
          ProductID: product.ProductID,
          CategoryID: c,
          storeCat: storeCat || 0,
        }));
        await this.prisma.productCategory.createMany({ data: categoryData, skipDuplicates: true });
      }

      // Tags
      await this.prisma.tagTable.deleteMany({
        where: { tableId: product.ProductID, tableName: 'products' },
      });
      if (tags.length > 0) {
        const tagData = tags.map((t) => ({
          tableId: product.ProductID,
          tableName: 'products',
          tagid: Number(t),
        }));
        await this.prisma.tagTable.createMany({ data: tagData });
      }

      // Save Images
      if (fileNames.length > 0) {
        const imageData = fileNames.map((f, index) => ({
          TableID: product.ProductID,
          TableName: 'Product',
          ImageURL: f.replace('$$-', ''),
          IsThumb: f.includes('$$-'),
          CreatedAt: new Date(),
          DisplayOrder: index,
        }));
        await this.prisma.image.createMany({ data: imageData, skipDuplicates: true });
      }

      return {
        status: true,
        msg: 'Product Saved.',
        result: {
          fieldCount: 0,
          affectedRows: categories.length + tags.length + fileNames.length + 1,
          insertId: product.ProductID,
          serverStatus: 2,
          warningCount: 0,
          message: '',
          protocol41: true,
          changedRows: product.ProductID ? 1 : 0,
        },
      };

    } catch (error) {
      await this.slackService.send(
        `Error in saveProduct: ${error.message}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      return { status: false, msg: error.message };
    }
  }

  async syncProducts(volusionPassword: string, userId: number) {
    const productUrl = `http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=${volusionPassword}&EDI_Name=Generic\\Products&SELECT_Columns=p.HideProduct,pm.METATAG_Keywords,pe.METATAG_Description,pm.ProductDescription_AbovePricing,pm.ExtInfo,pd.ProductDescription,p.IsChildOfProductCode,p.IsChildOfProductCode_ProductID,p.Options_Cloned_From,p.Options_Cloned_From_ProductID,p.ProductCode,p.ProductID,p.ProductName,p.StockStatus,pd.ProductDescriptionShort,pe.Availability,pe.Fixed_ShippingCost,pe.FreeShippingItem,pe.Hide_FreeAccessories,pe.ListPrice,pe.ListPrice_Name,pe.Photo_AltText,pe.PhotoURL_Large,pe.PhotoURL_Small,pe.ProductCategory,pe.ProductManufacturer,pe.ProductNameShort,pe.ProductPrice,pe.ProductPrice_Name,pe.ProductWeight,pe.SalePrice,pe.SalePrice_Name,pe.SelectedOptionIDs,pe.TaxableProduct,pe.UPC_code,pe.Vendor_Price,pm.TechSpecs`;

    try {
      const response = await axios.get(productUrl);
      const xmlBody = response.data;

      const parsed = await parseStringPromise(xmlBody);
      if (parsed?.xmldata?.Products && parsed.xmldata.Products.length > 0) {
        await this.insertProducts(parsed.xmldata.Products, userId);
        return { status: 'updated' };
      } else {
        return { status: 'already updated' };
      }
    } catch (err: any) {
      this.logger.error('Volusion sync error', err.message);
      await MailHelper.errorReport({
        subject: 'RMA Import Status',
        error: err.message || 'Volusion password expired or request failed',
      });
      return { status: 'volusion password expired' };
    }
  }

  private async insertProducts(products: any[], userId: number) {
    for (const product of products) {
      try {
        const productId = parseInt(product.ProductID?.[0] || '0');

        if (product.ProductCode === 'AE6900R-105') delete product.ListPrice_Name;

        const existingProduct = await this.prisma.product.findUnique({
          where: { ProductID: productId },
        });

        const newData = this.normalizeData(product);
        const oldData = existingProduct ? this.normalizeData(existingProduct) : {};

        const changedData: any = {};
        const previousState: any = {};
        for (const key in newData) {
          if (newData[key] !== oldData[key]) {
            changedData[key] = newData[key];
            previousState[key] = oldData[key];
          }
        }

        // Upsert product
        await this.prisma.product.upsert({
          where: { ProductID: productId },
          create: { ProductID: productId, ...newData },
          update: newData,
        });

        // Log updates if any
        if (Object.keys(changedData).length > 0) {
          await this.logProductUpdate(productId, userId, previousState, changedData);
          this.eventEmitter.emit('productUpdate', productId, userId, previousState, changedData);
        }
      } catch (err: any) {
        this.logger.error('Error inserting product', err.message);
      }
    }
  }

  private async logProductUpdate(productId: number, userId: number, oldData: any, newData: any) {
    try {
      await this.prisma.productLog.create({
        data: {
          product_id: productId,
          user_id: userId,
          operation: 'UPDATE',
          old_data: oldData,
          new_data: newData,
        },
      });
    } catch (err: any) {
      this.logger.error(`Failed to log product update for ${productId}`, err.message);
    }
  }

  async savePartial(
    productData: any,
    productDetail: any[],
    productImages: any[],
    userId: number,
  ) {
    try {
      // Save Product
      const productPromise = productData
        ? this.prisma.product.upsert({
          where: { ProductID: productData.ProductID || 0 },
          create: { ...productData, CreatedOn: new Date(), CreatedBy: userId },
          update: { ...productData, ModifiedBy: userId },
        })
        : Promise.resolve(null);

      // Save Product Details
      const detailPromise =
        productDetail && productDetail.length > 0
          ? Promise.all(
            productDetail.map((detail) =>
              this.prisma.productDetail.create({
                data: {
                  ProductID: detail.productId,
                  Name: detail.name,
                  URL: detail.fileName,
                  CreatedAt: new Date(),
                },
              }),
            ),
          )
          : Promise.resolve([]);

      // Save Product Images
      const imagePromise =
        productImages && productImages.length > 0
          ? Promise.all(
            productImages.map((img, index) =>
              this.prisma.image.create({
                data: {
                  TableID: img.productId,
                  TableName: 'Product',
                  ImageURL: img.fileName,
                  CreatedAt: new Date(),
                  DisplayOrder: index,
                },
              }),
            ),
          )
          : Promise.resolve([]);

      // Wait for all operations to finish
      const [productResult, detailResult, imageResult] = await Promise.all([
        productPromise,
        detailPromise,
        imagePromise,
      ]);

      // If none succeeded
      if (!productResult && detailResult.length === 0 && imageResult.length === 0) {
        return { status: false, msg: 'Invalid data object passed.' };
      }

      return { status: true, msg: 'Partial data saved successfully.', result: { productResult, detailResult, imageResult } };
    } catch (err: any) {
      await MailHelper.errorReport({
        subject: 'Save Partial Product Error',
        error: err.message,
      });
      this.logger.error(err.message);
      return { status: false, msg: err.message };
    }
  }

  async removeProduct(data: any, user: any) {
    try {
      // Mark product as deleted
      data.IsDeleted = true;

      // Fetch old product before updating
      const oldProduct = await this.prisma.product.findUnique({
        where: { ProductID: data.ProductID },
      });

      if (!oldProduct) {
        return { status: false, msg: 'Product not found' };
      }

      // Determine changed fields
      const changedData: any = {};
      const previousState: any = {};
      for (const key in data) {
        if (data[key] !== oldProduct[key]) {
          changedData[key] = data[key];
          previousState[key] = oldProduct[key];
        }
      }

      // Update product
      const updated = await this.prisma.product.update({
        where: { ProductID: data.ProductID },
        data,
      });

      // Log update
      if (Object.keys(changedData).length > 0) {
        await this.logProductUpdate(data.ProductID, user.id, previousState, changedData);
        this.eventEmitter.emit('productUpdate', data.ProductID, user.id, previousState, changedData);
      }

      return {
        status: true,
        msg: 'Product Deleted Successfully',
        result: updated,
      };
    } catch (err: any) {
      await MailHelper.errorReport({
        subject: 'Remove Product Error',
        error: err.message,
      });
      this.logger.error(err.message);
      return { status: false, msg: err.message };
    }
  }

  async simpleUpdateProduct(data: any, user: any) {
    try {
      // Log product changes and emit events
      await this.updateProductLogAndEmit(data.ProductID, data, user.id);

      // Update product in database
      const result = await this.prisma.product.update({
        where: { ProductID: data.ProductID },
        data,
      });

      return {
        status: true,
        msg: result ? 'Updated Successfully.' : 'Success!',
        result,
      };
    } catch (err: any) {
      this.logger.error('Error in simpleUpdateProduct', err.message);
      return { status: false, msg: err.message };
    }
  }

  private async updateProductLogAndEmit(productId: number, newData: any, userId: number) {
    // Fetch existing product
    const oldProduct = await this.prisma.product.findUnique({
      where: { ProductID: productId },
    });

    if (!oldProduct) return;

    // Normalize and compute differences
    const oldData = this.normalizeData(oldProduct);
    const changedData: any = {};
    const previousState: any = {};
    const normalizedNew = this.normalizeData(newData);

    for (const key in normalizedNew) {
      if (normalizedNew[key] !== oldData[key]) {
        changedData[key] = normalizedNew[key];
        previousState[key] = oldData[key];
      }
    }

    // Log update if any changes
    if (Object.keys(changedData).length > 0) {
      await this.logProductUpdate(productId, userId, previousState, changedData);
      this.eventEmitter.emit('productUpdate', productId, userId, previousState, changedData);
    }
  }

  private normalizeData(data: Record<string, any>): Record<string, any> {
    const normalizedData: Record<string, any> = { ...data };

    for (const key in normalizedData) {
      // Convert 0/1 to boolean
      if (normalizedData[key] === 0 || normalizedData[key] === 1) {
        normalizedData[key] = Boolean(normalizedData[key]);
      }
    }

    // handling for backlog_show
    if (normalizedData.backlog_show === '0') {
      normalizedData.backlog_show = false;
    } else if (normalizedData.backlog_show === '1') {
      normalizedData.backlog_show = true;
    }
    return normalizedData;
  }

  async getAllProductForOptionCategories() {
    try {
      const products = await this.prisma.product.findMany({
        where: {
          IsDeleted: false,
          isCompleted: true,
        },
        orderBy: [
          { PriorityIndex: 'asc' },
          { ProductID: 'asc' },
        ],
        select: {
          ProductID: true,
          ProductCode: true,
          ProductName: true,
          OptionIDs: true,
          ExportDescription: true,
          CountryOfOrigin: true,
          UnitOfMeasure: true,
          ExportControlClassificationNumber: true,
          HarmonizedCode: true,
          ProductPhotoURL: true,
          ProductDescriptionShort: true,
          ProductPrice: true,
          ProductWeight: true,
          HideProduct: true,
          CreatedOn: true,
          Discount: true,
          PriorityIndex: true,
          IsActive: true,
          IsFeatured: true,
          FreeAccessories: true,
        },
      });
      return products;
    } catch (error: any) {
      this.logger.error('Error fetching products for option categories', error.message);
      throw error;
    }
  }

  async getAllProductsActive() {
    try {
      const products = await this.prisma.$queryRaw<any[]>`
        SELECT p.ProductID, p.ProductCode, p.ProductName, p.OptionIDs,
               psc.Name as Product_Subclass, p.CountryOfOrigin, p.UnitOfMeasure,
               p.ExportControlClassificationNumber, p.HarmonizedCode, p.ProductPhotoURL,
               p.ProductDescriptionShort, p.ProductPrice, p.ProductWeight, p.HideProduct,
               p.CreatedOn, p.Discount, p.PriorityIndex, p.IsActive, p.isMultiClassification,
               p.IsFeatured, p.FreeAccessories
        FROM products p
        JOIN product_class pc ON p.productClassId = pc.Id
        JOIN product_subclass psc ON p.productSubClassId = psc.Id
        WHERE p.IsDeleted = 0 AND p.isCompleted = 1 AND p.IsActive = 1
        ORDER BY p.PriorityIndex, p.ProductID ASC
      `;
      return products;
    } catch (error: any) {
      const errorMsg = JSON.stringify(error.message);
      this.logger.error('Error fetching all active products', errorMsg);
      await this.slackService.send(
        `File: product.service.ts\nAction: getAllProductsActive\nError: ${errorMsg}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      throw error;
    }
  }

  async getAllProductsActiveInactive(): Promise<ProductEntity[]> {
    try {
      const records = await this.prisma.product.findMany({
        where: {
          IsDeleted: false,
          isCompleted: true,
        },
        orderBy: [
          { PriorityIndex: 'asc' },
          { ProductID: 'asc' },
        ],
        include: {
          productClass: true,
          productSubClass: true,
        },
      });

      return records.map((rec) => ProductMapper.toDomain(rec));
    } catch (err) {
      this.logger.error(
        `Error fetching products active/inactive: ${err.message}`,
        err.stack,
      );
      throw err;
    }
  }

  async getAllProductsActiveAndSerialized(): Promise<ProductDto[]> {
    try {
      const records = await this.prisma.product.findMany({
        where: {
          IsDeleted: false,
          isCompleted: true,
          IsActive: true,
          isSerialAble: true,
        },
        orderBy: [
          { PriorityIndex: 'asc' },
          { ProductID: 'asc' },
        ],
      });

      const entities: ProductEntity[] = records.map(ProductMapper.toDomain);
      return entities.map((entity) => Object.assign(new ProductDto(), entity));
    } catch (err) {
      this.logger.error(
        `File: product.service.ts, Action: getAllProductsActiveAndSerialized, Error: ${err.message}`,
      );
      throw err;
    }
  }

  async getProductClasses() {
    try {
      return await this.prisma.productClass.findMany({
        orderBy: { Id: 'asc' },
      });
    } catch (err) {
      const error = JSON.stringify(err.message);
      await this.slackService.send(
        `File: product.service.ts\nAction: getProductClasses\nError: ${error}`,
      );
      throw err;
    }
  }

  async getProductSubClasses() {
    try {
      return await this.prisma.productSubClass.findMany({
        orderBy: { Id: 'asc' },
      });
    } catch (err) {
      const errorMessage = `File: product.service.ts, \nAction: getProductSubClasses, \nError ${err.message}`;

      await this.slackService.send(errorMessage, 'J.A.R.V.I.S', 'C029PF7DLKE');

      this.logger.error('Error fetching product subclasses', err.message);
      throw err;
    }
  }

  async fetchProductLogs(productId: number): Promise<ProductLogDto[]> {
    try {
      const rows = await this.prisma.productLog.findMany({
        where: { product_id: productId },
        orderBy: { timestamp: 'desc' },
        include: { user: { select: { firstname: true, lastname: true, id: true } } },
      });

      const entities: ProductLogEntity[] = rows.map((r) =>
        ProductLogMapper.toDomain(r as any),
      );

      const dtos: ProductLogDto[] = entities.map((e) => {
        const dto = new ProductLogDto();
        dto.id = e.id;
        dto.productId = e.productId ?? undefined;
        dto.operation = e.operation ?? undefined;
        dto.timestamp = e.timestamp;
        dto.userId = e.userId ?? undefined;
        dto.oldData = (e.oldData as any) ?? undefined;
        dto.newData = (e.newData as any) ?? undefined;
        return dto;
      });

      return dtos;
    } catch (err: any) {
      const errorMessage = `File: product-log.service.ts\nAction: fetchProductLogs\nError: ${err?.message ?? err}`;
      try {
        await this.slackService.send(errorMessage, 'J.A.R.V.I.S', 'C029PF7DLKE');
      } catch (slackErr) {
        this.logger.error('Failed to send Slack message', slackErr);
      }

      this.logger.error(`Error fetching product logs: ${err?.message ?? err}`);
      throw new InternalServerErrorException('Failed to fetch logs');
    }
  }

  async saveProductComments(data: any, user: any) {
    try {
      await this.prisma.product.update({
        where: { ProductID: data.ProductID },
        data: {
          backlog_comments: data.backlog_comments,
          backlog_leadtime: data.backlog_leadtime,
          updatedDateBacklogComment: new Date(),
        },
      });

      // return updated record
      const response = await this.prisma.product.update({
        where: { ProductID: data.ProductID },
        data: {
          backlog_comments: data.backlog_comments,
          backlog_leadtime: data.backlog_leadtime,
          updatedDateBacklogComment: new Date(),
        },
      });

      return response;
    } catch (err) {
      await this.slackService.send(
        `File: product.service.ts\nAction: saveProductComments\nError: ${err.message}`,
      );
      throw err;
    }
  }
}