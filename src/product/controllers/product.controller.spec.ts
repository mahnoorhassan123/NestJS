import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../services/product.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { SaveXmlProductDto } from '../dtos/save-xml-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: jest.Mocked<ProductService>;

  beforeEach(async () => {
    service = {
      getProducts: jest.fn(),
      getAllProducts: jest.fn(),
      getProduct: jest.fn(),
      validateXmlFile: jest.fn(),
      importFromXmlPath: jest.fn(),
      saveProduct: jest.fn(),
      syncProducts: jest.fn(),
      savePartial: jest.fn(),
      removeProduct: jest.fn(),
      simpleUpdateProduct: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{ provide: ProductService, useValue: service }],
    })
      .overrideGuard(AuthGuard) 
      .useValue({
        canActivate: jest.fn((ctx: ExecutionContext) => true), 
      })
      .compile();

    controller = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getProducts should call service.getProducts', async () => {
    await controller.getProducts();
    expect(service.getProducts).toHaveBeenCalled();
  });

  it('getAllProducts should call service.getAllProducts with default tag', async () => {
    const result = await controller.getAllProducts();
    expect(service.getAllProducts).toHaveBeenCalledWith('-1');
    expect(result).toEqual([]);
  });

  it('getProduct should call service.getProduct with numeric ID', async () => {
    const result = await controller.getProduct('123');
    expect(service.getProduct).toHaveBeenCalledWith(123);
    expect(result).toEqual({});
  });

  it('uploadFile should throw BadRequestException if no file', async () => {
    await expect(controller.uploadFile(null as any)).rejects.toThrow('No file uploaded');
  });

  it('uploadFile should call service.validateXmlFile with file path', async () => {
    const file = { path: 'path/to/file.xml', originalname: 'file.xml' } as Express.Multer.File;
    const result = await controller.uploadFile(file);
    expect(service.validateXmlFile).toHaveBeenCalledWith('path/to/file.xml', 'file.xml');
    expect(result).toEqual({ valid: true });
  });

  it('saveXmlProduct should call service.importFromXmlPath', async () => {
    const dto: SaveXmlProductDto = { path: 'path/to/file.xml' };
    const req: any = { user: { id: 1 } };
    const result = await controller.saveXmlProduct(dto, req);
    expect(service.importFromXmlPath).toHaveBeenCalledWith('path/to/file.xml', 1);
    expect(result).toEqual({ success: true });
  });

  it('saveProduct should parse JSON and call service.saveProduct', async () => {
    const files: any[] = [{ filename: 'img1.png' }, { filename: 'img2.png' }];
    const data = JSON.stringify({ name: 'Product A' });
    const req: any = { user: { id: 1 } };
    const result = await controller.saveProduct(files, data, req);
    expect(service.saveProduct).toHaveBeenCalledWith({ name: 'Product A' }, ['img1.png', 'img2.png'], { id: 1 });
    expect(result).toEqual({ success: true });
  });

  it('sync should call service.syncProducts', async () => {
    const req: any = { user: { id: 1 } };
    process.env.VOLUSION_PASSWORD = 'password';
    const result = await controller.sync(req);
    expect(service.syncProducts).toHaveBeenCalledWith('password', 1);
    expect(result).toEqual({ synced: true });
  });

  it('savePartial should call service.savePartial', async () => {
    const body = { productData: {}, productDetail: [], productImages: [] };
    const req: any = { user: { id: 1 } };
    const result = await controller.savePartial(body, req);
    expect(service.savePartial).toHaveBeenCalledWith({}, [], [], 1);
    expect(result).toEqual({ success: true });
  });

  it('removeProduct should call service.removeProduct', async () => {
    const body = { id: 1 };
    const req: any = { user: { id: 1 } };
    const result = await controller.removeProduct(body, req);
    expect(service.removeProduct).toHaveBeenCalledWith(body, { id: 1 });
    expect(result).toEqual({ success: true });
  });

  it('simpleUpdate should call service.simpleUpdateProduct', async () => {
    const data = { name: 'Updated' };
    const req: any = { user: { id: 1 } };
    const result = await controller.simpleUpdate(req as any, data);
    expect(service.simpleUpdateProduct).toHaveBeenCalledWith(data, { id: 1 });
    expect(result).toEqual({ success: true });
  });

  it('getProductLogs should call service.fetchProductLogs', async () => {
    const result = await controller.getProductLogs(5);
    expect(service.fetchProductLogs).toHaveBeenCalledWith(5);
    expect(result).toEqual([]);
  });

  it('saveProductComments should call service.saveProductComments', async () => {
    const data = { comment: 'Nice' };
    const req: any = { user: { id: 1 } };
    const result = await controller.saveProductComments(data, req);
    expect(service.saveProductComments).toHaveBeenCalledWith(data, { id: 1 });
    expect(result).toEqual({ success: true });
  });
});
