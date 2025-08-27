import { Controller, Get, Delete, UseGuards, Query, Param, UploadedFile, BadRequestException, Post, UseInterceptors, Body, UploadedFiles, Req, InternalServerErrorException, ParseIntPipe } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SaveXmlProductDto } from '../dtos/save-xml-product.dto';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiConsumes, ApiBody, ApiParam, } from '@nestjs/swagger';
import { ProductEntity } from '../entities/product.entity';
import { ProductDto } from '../dtos/product.dto';
import { ProductLogDto } from '../dtos/product-log.dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all products (protected)' })
  @ApiResponse({ status: 200, type: [ProductDto] })
  async getProducts() {
    return this.productService.getProducts();
  }


  @Get('list')
  @ApiOperation({ summary: 'Get all products (filter by tags if provided)' })
  @ApiQuery({ name: 'tags', type: String, required: false })
  @ApiResponse({ status: 200, type: [ProductDto] })
  async getAllProducts(@Query('tags') tags: string = '-1') {
    return this.productService.getAllProducts(tags);
  }

  @Get('list/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get product by ID (protected)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ProductDto })
  async getProduct(@Param('id') id: string) {
    return this.productService.getProduct(+id);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './admin-panel/files/product-xml-files',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + file.originalname;
          cb(null, `file-${uniqueSuffix}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Upload XML product file (protected)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return this.productService.validateXmlFile(file.path, file.originalname);
  }

  @Post('save-xml-product')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Save product from uploaded XML (protected)' })
  @ApiBody({ type: SaveXmlProductDto })
  @ApiResponse({ status: 201, description: 'Product imported successfully' })
  async saveXmlProduct(@Body() dto: SaveXmlProductDto, @Req() req: any) {
    const userId = req.user?.id ?? null;
    return this.productService.importFromXmlPath(dto.path, userId);
  }

  @Post('save')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const timestamp = Date.now();
          const ext = extname(file.originalname);
          cb(null, `${timestamp}${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Save new product with images (protected)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'string', description: 'JSON string with product data' },
        files: { type: 'array', items: { type: 'string', format: 'binary' } },
      },
    },
  })
  async saveProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('data') data: string,
    @Req() req,
  ) {
    try {
      const parsedData = JSON.parse(data);
      const user = req.user;
      const fileNames = files.map((f) => f.filename);
      return await this.productService.saveProduct(parsedData, fileNames, user);
    } catch (err) {
      return { status: false, msg: 'Error saving product', error: err.message };
    }
  }


  @UseGuards(AuthGuard)
  @Get('sync')
  @ApiOperation({ summary: 'Sync products with Volusion (protected)' })
  async sync(@Req() req: any) {
    const userId = req.user?.id || 0;
    return this.productService.syncProducts(
      process.env.VOLUSION_PASSWORD || '',
      userId,
    );
  }

  @Post('save-partial')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Save product partially (protected)' })
  @ApiBody({ description: 'Partial product object', type: Object })
  async savePartial(@Body() body: any, @Req() req: Request) {
    const user = req['user'];
    return this.productService.savePartial(
      body.productData || { IsActive: 0, isCompleted: 0 },
      body.productDetail || [],
      body.productImages || [],
      user.id,
    );
  }

  @UseGuards(AuthGuard)
  @Delete('remove')
  @ApiOperation({ summary: 'Remove product (protected)' })
  @ApiBody({ schema: { type: 'object', properties: { id: { type: 'number' } } } })
  async removeProduct(@Body() body: any, @Req() req: any) {
    return this.productService.removeProduct(body, req.user);
  }


  @UseGuards(AuthGuard)
  @Post('simple-update')
  @ApiOperation({ summary: 'Simple product update (protected)' })
  @ApiBody({ type: Object })
  async simpleUpdate(@Req() req: Request, @Body() data: any) {
    return this.productService.simpleUpdateProduct(data, req['user']);
  }


  @Get('list/category-option')
  @ApiOperation({ summary: 'Get all products for option categories' })
  @ApiResponse({ status: 200, type: [ProductDto] })
  async getAllProductForOptionCategories() {
    return this.productService.getAllProductForOptionCategories();
  }


  @Get('list')
  @ApiOperation({ summary: 'Get all active products' })
  @ApiResponse({ status: 200, description: 'List of active products returned' })
  async getAllProductsActive() {
    return this.productService.getAllProductsActive();
  }

  @Get('list/active-inactive')
  @ApiOperation({ summary: 'Get all active/inactive products' })
  @ApiResponse({ status: 200, type: [ProductEntity] })
  async getAllProductsActiveInactive() {
    return this.productService.getAllProductsActiveInactive();
  }

  @Get('list/serialized')
  @ApiOperation({ summary: 'Get all serialized products' })
  @ApiResponse({ status: 200, type: [ProductDto] })
  async getAllSerialized() {
    return this.productService.getAllProductsActiveAndSerialized();
  }

  @UseGuards(AuthGuard)
  @Get('list-comp/:tags')
  @ApiOperation({ summary: 'Get products by tag (protected)' })
  @ApiParam({ name: 'tags', type: String })
  async getProductsByTags(@Param('tags') tags: string) {
    try {
      return await this.productService.getAllProducts(tags);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Error fetching products',
        error: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('list-product/classes')
  @ApiOperation({ summary: 'Get product classes (protected)' })
  async getProductClasses() {
    return this.productService.getProductClasses();
  }

  @UseGuards(AuthGuard)
  @Get('/list-product/sub/classes')
  @ApiOperation({ summary: 'Get product subclasses (protected)' })
  async getProductSubClasses() {
    try {
      return { success: true, data: await this.productService.getProductSubClasses() };
    } catch (error) {
      return { success: false, message: 'Error fetching product subclasses', error: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Get('/product-history/:productId')
  @ApiOperation({ summary: 'Get product logs (protected)' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, type: [ProductLogDto] })
  async getProductLogs(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.fetchProductLogs(productId);
  }

  @UseGuards(AuthGuard)
  @Post('saveProductComments')
  @ApiOperation({ summary: 'Save product comments (protected)' })
  @ApiBody({ type: Object })
  async saveProductComments(@Body() data: any, @Req() req: any) {
    return this.productService.saveProductComments(data, req['user']);
  }
}