import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../services/product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SlackService } from '../../common/services/slack.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as fs from 'fs';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

jest.spyOn(fs.promises, 'readFile').mockImplementation(jest.fn());
jest.mock('axios');
jest.mock('xml2js', () => ({ parseStringPromise: jest.fn() }));

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;
  let slackService: SlackService;
  let eventEmitter: EventEmitter2;

  const mockPrisma = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      aggregate: jest.fn(),
    },
    productDetail: { create: jest.fn(), upsert: jest.fn() },
    image: { create: jest.fn(), createMany: jest.fn(), upsert: jest.fn() },
    tagTable: { deleteMany: jest.fn(), createMany: jest.fn() },
    productCategory: { deleteMany: jest.fn(), createMany: jest.fn() },
    productLog: { create: jest.fn(), findMany: jest.fn() },
    $queryRawUnsafe: jest.fn(),
  } as unknown as PrismaService;

  const mockSlackService = { send: jest.fn() } as unknown as SlackService;
  const mockEventEmitter = { emit: jest.fn() } as unknown as EventEmitter2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: SlackService, useValue: mockSlackService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);
    slackService = module.get<SlackService>(SlackService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  afterEach(() => jest.clearAllMocks());


  describe('getProducts', () => {
    it('should return a list of products', async () => {
      (prisma.product.findMany as jest.Mock).mockResolvedValue([{ ProductID: 1 }, { ProductID: 2 }]);
      const result = await service.getProducts();
      expect(result.data).toEqual([{ ProductID: 1 }, { ProductID: 2 }]);
      expect(result.status).toBe(true);
    });
  });


  describe('getAllProducts', () => {
    it('should return products from raw query', async () => {
      (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue([{ ProductID: 1 }]);
      const result = await service.getAllProducts('-1');
      expect(result).toEqual([{ ProductID: 1 }]);
    });

    it('should send Slack message on error', async () => {
      (prisma.$queryRawUnsafe as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(service.getAllProducts('-1')).rejects.toThrow('fail');
      expect(slackService.send).toHaveBeenCalled();
    });
  });


  describe('getProduct', () => {
    it('should return a product with categories and tags', async () => {
      (prisma.$queryRawUnsafe as jest.Mock)
        .mockResolvedValueOnce([{ ProductID: 1 }]) // product
        .mockResolvedValueOnce([{ CategoryID: 10 }]) // categories
        .mockResolvedValueOnce([{ tagid: 101 }]); // tags

      const result = await service.getProduct(1);
      expect(result[0].storeCat).toBe(10);
      expect(result[0].tagsArray).toEqual([101]);
    });

    it('should call Slack on query error', async () => {
      (prisma.$queryRawUnsafe as jest.Mock).mockRejectedValue(new Error('fail'));
      await expect(service.getProduct(1)).rejects.toThrow('fail');
      expect(slackService.send).toHaveBeenCalled();
    });
  });


  describe('validateXmlFile', () => {
    it('should return success for valid XML', async () => {
      (fs.readFile as unknown as jest.Mock).mockResolvedValue(
        `<Export><Products_Joined><Product></Product></Products_Joined></Export>`,
      );
      const result = await service.validateXmlFile('file.xml', 'original.xml');
      expect(result.success).toBe(true);
    });

    it('should return failure for read error', async () => {
      (fs.readFile as unknown as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await service.validateXmlFile('file.xml', 'original.xml');
      expect(result.success).toBe(false);
    });
  });


  describe('saveProduct', () => {
    const user = { id: 1 };

    beforeEach(() => {
      jest.clearAllMocks();
      (prisma.product.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.product.aggregate as jest.Mock).mockResolvedValue({ _max: { ProductID: 1000 } });
      (prisma.product.upsert as jest.Mock).mockResolvedValue({ ProductID: 1001 });
      (prisma.productCategory.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.productCategory.createMany as jest.Mock).mockResolvedValue({});
      (prisma.tagTable.deleteMany as jest.Mock).mockResolvedValue({});
      (prisma.tagTable.createMany as jest.Mock).mockResolvedValue({});
      (prisma.image.createMany as jest.Mock).mockResolvedValue({});
      (prisma.productLog.create as jest.Mock).mockResolvedValue({});
    });

    it('should insert product with categories and tags', async () => {
      const product = { ProductCode: 'X001', tagsArray: [101, 102], storeCat: [10, 11] };
      const fileNames = ['img1.jpg', 'img2.jpg'];

      const result = await service.saveProduct(product, fileNames, user);

      expect(prisma.product.upsert).toHaveBeenCalled();
      expect(prisma.productCategory.createMany).toHaveBeenCalledWith({
        data: [
          { ProductID: 1001, CategoryID: 10 },
          { ProductID: 1001, CategoryID: 11 },
        ],
      });
      expect(prisma.tagTable.createMany).toHaveBeenCalledWith({
        data: [
          { ProductID: 1001, tagid: 101 },
          { ProductID: 1001, tagid: 102 },
        ],
      });
      expect(prisma.image.createMany).toHaveBeenCalledWith({
        data: [
          { ProductID: 1001, image: 'img1.jpg' },
          { ProductID: 1001, image: 'img2.jpg' },
        ],
      });
      expect(prisma.productLog.create).toHaveBeenCalled();
      expect(result.status).toBe(true);
    });

    it('should handle empty categories and tags gracefully', async () => {
      const product = { ProductCode: 'X002', tagsArray: [], storeCat: [] };
      const fileNames: string[] = [];

      const result = await service.saveProduct(product, fileNames, user);

      expect(prisma.productCategory.createMany).not.toHaveBeenCalled();
      expect(prisma.tagTable.createMany).not.toHaveBeenCalled();
      expect(prisma.image.createMany).not.toHaveBeenCalled();
      expect(prisma.productLog.create).toHaveBeenCalled();
      expect(result.status).toBe(true);
    });
  });

 
  describe('removeProduct', () => {
    it('should remove existing product', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue({ ProductID: 1 });
      (prisma.product.update as jest.Mock).mockResolvedValue({ ProductID: 1 });

      const result = await service.removeProduct({ ProductID: 1 }, { id: 1 });
      expect(result.status).toBe(true);
      expect(eventEmitter.emit).toHaveBeenCalled();
    });

    it('should fail if product not found', async () => {
      (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await service.removeProduct({ ProductID: 2 }, { id: 1 });
      expect(result.status).toBe(false);
    });
  });


  describe('syncProducts', () => {
    it('should update products on valid XML', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: '<xmldata></xmldata>' });
      (parseStringPromise as jest.Mock).mockResolvedValue({ xmldata: { Products: [{ ProductID: ['1'], ProductCode: 'X01' }] } });
      jest.spyOn(service as any, 'insertProducts').mockResolvedValue(undefined);

      const result = await service.syncProducts('pwd', 1);
      expect(result.status).toBe('updated');
    });

    it('should handle axios failure', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('fail'));
      const result = await service.syncProducts('pwd', 1);
      expect(result.status).toBe('volusion password expired');
    });
  });


describe('Private/Internal Methods', () => {
  it('insertProducts should call saveProduct for each product', async () => {
    const spySave = jest.spyOn(service, 'saveProduct').mockResolvedValue({ status: true, msg: 'ok' });
    const products = [
      { ProductCode: 'X01', tagsArray: [], storeCat: [] },
      { ProductCode: 'X02', tagsArray: [], storeCat: [] },
    ];

    await (service as any).insertProducts(products, []);
    expect(spySave).toHaveBeenCalledTimes(products.length);
    expect(spySave).toHaveBeenCalledWith(products[0], [], undefined);
    expect(spySave).toHaveBeenCalledWith(products[1], [], undefined);
  });

  it('updateProductLogAndEmit should create a log and emit event', async () => {
    (prisma.productLog.create as jest.Mock).mockResolvedValue({});
    await (service as any).updateProductLogAndEmit(1, 'update', { foo: 'bar' });

    expect(prisma.productLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ ProductID: 1, type: 'update', change: { foo: 'bar' } }),
    );
    expect(eventEmitter.emit).toHaveBeenCalledWith('product.update', { ProductID: 1, change: { foo: 'bar' } });
  });

  it('savePartial should update product partially', async () => {
    (prisma.product.update as jest.Mock).mockResolvedValue({ ProductID: 1 });
    const result = await (service as any).savePartial(1, { ProductCode: 'X10' }, { id: 1 });

    expect(prisma.product.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ProductID: 1 }, data: { ProductCode: 'X10' } }),
    );
    expect(result.ProductID).toBe(1);
  });

  it('simpleUpdateProduct should call prisma.update', async () => {
    (prisma.product.update as jest.Mock).mockResolvedValue({ ProductID: 1 });
    const result = await (service as any).simpleUpdateProduct(1, { ProductCode: 'X20' });

    expect(prisma.product.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ProductID: 1 }, data: { ProductCode: 'X20' } }),
    );
    expect(result.ProductID).toBe(1);
  });

  it('insertProducts should handle empty product array gracefully', async () => {
    const spySave = jest.spyOn(service, 'saveProduct').mockResolvedValue({ status: true, msg: 'ok' });
    await (service as any).insertProducts([], []);
    expect(spySave).not.toHaveBeenCalled();
  });
});

});