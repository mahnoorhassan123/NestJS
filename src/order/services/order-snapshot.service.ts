import { Injectable } from '@nestjs/common';
import { SlackService } from 'src/common/services/slack.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { orderMappers } from '../mappers/orders.mappers';

@Injectable()
export class OrderSnapshotService {
  constructor(
    private prisma: PrismaService,
    private readonly slackService: SlackService,
  ) {}
  async addOrderSnapshot(
    order: any,
  ): Promise<{ status: boolean; msg: string; result: any }> {
    try {
      // Remove fields not needed for OrdersSnapshot
      const orderData = { ...order };
      delete orderData.ShippedBy;
      delete orderData.parcels;
      const orderDetails = orderData.OrderDetails || [];
      delete orderData.OrderDetails;
      delete orderData.tagsArray;
      delete orderData.ShipDate;

      // Map fields to Prisma schema (camelCase)
      const orderSnapshotData =
        orderMappers.mapOrderSnapshotToPrisma(orderData);

      // Insert into OrdersSnapshot
      const result = await this.prisma.ordersSnapshot.create({
        data: orderSnapshotData,
      });

      if (result) {
        // Retrieve the latest snapshot ID for the given OrderID
        const snapshotRecord = await this.prisma.ordersSnapshot.findFirst({
          where: { OrderID: orderData.OrderID },
          orderBy: { id: 'desc' },
          select: { id: true },
        });

        const snapshotId = snapshotRecord?.id || 0;

        // Process and insert OrderDetailsSnapshots
        await Promise.all(
          orderDetails.map(async (orderDetail: any, index: number) => {
            // Remove fields not needed for OrderDetailsSnapshots
            const detailData = { ...orderDetail };
            delete detailData.qutantityForTrackToShipped;
            delete detailData.CategoryOptions;
            delete detailData.availableOptions;
            delete detailData.isSerialAble;
            delete detailData.OrderID;

            // Map fields to Prisma schema (camelCase)
            const orderDetailToInsert =
              orderMappers.mapOrderDetailsSnapshotToPrisma(
                detailData,
                snapshotId,
                index,
              );

            // Filter out undefined or null values (except 0 or '')
            const filteredOrderDetail = Object.fromEntries(
              Object.entries(orderDetailToInsert).filter(
                ([_, value]) =>
                  value !== undefined &&
                  (value !== null || value === 0 || value === ''),
              ),
            );

            await this.prisma.orderDetailsSnapshots.create({
              data: filteredOrderDetail,
            });
          }),
        );

        return { status: true, msg: 'Order Snapshot added', result };
      } else {
        return {
          status: false,
          msg: 'Error in adding order snapshot',
          result: {},
        };
      }
    } catch (err) {
      const error = JSON.stringify(err.message);
      // Log error to Slack (adjust channel ID and bot name as needed)
      await this.slackService.send(
        `File: order-snapshot.service.ts, \nAction: addOrderSnapshot, \nError: ${error}\n`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      throw new Error(error);
    }
  }
}
