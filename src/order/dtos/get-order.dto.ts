import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  IsDateString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class DatesDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class GetOrdersDto {
  @IsString()
  @IsOptional()
  duration?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsBoolean()
  @IsOptional()
  openStatus?: boolean;
}

export class GetTrackShippingDto {
  @IsInt()
  orderId: number;

  @IsInt()
  shippingId: number;
}

export class TrackShippingLineItemDto {
  @IsInt()
  id: number;

  @IsInt()
  trackShippingId: number;

  @IsInt()
  @IsOptional()
  orderId?: number;

  @IsInt()
  @IsOptional()
  QtyOnPackingSlip?: number;

  @IsInt()
  @IsOptional()
  ProductId?: number;

  @IsBoolean()
  @IsOptional()
  isChild?: boolean;

  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}

export class NoteHistoryDto {
  @IsString()
  @IsOptional()
  OrderComments?: string;

  @IsString()
  @IsOptional()
  OrderNotes?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsDate()
  @IsOptional()
  LastModified?: Date;
}

export class GetOrderBySerialDto {
  @IsString()
  serialNo: string;
}

export class OrderDetailBySerialResponseDto {
  @IsString()
  @IsOptional()
  Options?: string;

  @IsInt()
  @IsOptional()
  QtyOnPackingSlip?: number;

  @IsInt()
  @IsOptional()
  QtyShipped?: number;

  @IsInt()
  @IsOptional()
  QtyOnBackOrder?: number;

  @IsInt()
  @IsOptional()
  shippedQty?: number;

  @IsInt()
  @IsOptional()
  parent?: number;

  @IsString()
  @IsOptional()
  parentName?: string;

  @IsString()
  @IsOptional()
  ProductSerials?: string;

  @IsBoolean()
  @IsOptional()
  isChild?: boolean;

  @IsBoolean()
  @IsOptional()
  isCategoriesOption?: boolean;

  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsString()
  @IsOptional()
  ProductName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  Qty?: number;

  @IsNumber()
  @IsOptional()
  Price?: number;

  @IsNumber()
  @IsOptional()
  Discount?: number;
}

export class DeleteFileResponseDto {
  success: boolean;
  affectedRows: number;
}

export class GetBackOrderDto {
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((item) => Number(item.trim()))
      : value,
  )
  @IsArray()
  @IsNumber({}, { each: true })
  productCodes: number[];
}

export class UpdateOrderResponseDto {
  @IsBoolean()
  status: boolean;

  @IsString()
  msg: string;
}

export class OrderTrackingInputDto {
  @IsString()
  @IsOptional()
  trackingnumber?: string;

  @IsString()
  @IsOptional()
  gateway?: string;

  @IsDate()
  @IsOptional()
  shipdate?: Date;

  @IsInt()
  @IsOptional()
  orderid?: number;

  @IsNumber()
  @IsOptional()
  shipment_cost?: number;

  @IsInt()
  @IsOptional()
  shippingmethodid?: number;

  @IsString()
  @IsOptional()
  package?: string;

  @IsString()
  @IsOptional()
  form?: string;
}

export class ImportOrderFileDto {
  @IsArray()
  data: OrderTrackingInputDto[];
}

export class ImportOrderFileResponseDto {
  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  msg?: string;

  @IsOptional()
  error?: any;
}
