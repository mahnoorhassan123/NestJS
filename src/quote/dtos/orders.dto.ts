// dtos/order.dto.ts
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetOrdersByStatusDto {
  @IsString()
  @IsOptional()
  serialNo?: string;

  @IsOptional()
  dates?: {
    from?: string;
    to?: string;
  };

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];
}

export class GetOrdersDto {
  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsBoolean()
  @IsOptional()
  openStatus?: boolean;
}

export class GetOrderBySerialDto {
  @IsString()
  serialNo: string;
}

export class GetOpenOrderByProductIdDto {
  @IsInt()
  productId: number;
}
// dtos/order.dto.ts
export class UpdateOrderDto {
  @IsInt()
  OrderID: number;

  // Add other fields as needed, based on Order model
  @IsString()
  @IsOptional()
  orderStatus?: string;

  @IsNumber()
  @IsOptional()
  paymentAmount?: number;

  // ... other fields
}

// dtos/order.dto.ts
export class ImportOrderTrackingDto {
  @IsArray()
  trackingData: {
    trackingnumber: string[];
    gateway: string[];
    shipdate: string[];
    orderid: string[];
    shipment_cost: string[];
    shippingmethodid: string[];
    package: string[];
    form: string[];
  }[];
}
