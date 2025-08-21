import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRmaDto, UpdateRmaDto } from '../dtos/rma.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RmaService {
  constructor(private prisma: PrismaService) {}

  async createRma(data: CreateRmaDto) {
    const existingRma = await this.prisma.rma.findFirst({
      where: {
        OR: [{ sn: data.sn }, { rmaNumber: data.rmaNumber }],
      },
    });

    if (existingRma) {
      if (existingRma.sn === data.sn) {
        throw new HttpException('This SN already exists!', HttpStatus.CONFLICT);
      }
      if (existingRma.rmaNumber === data.rmaNumber) {
        throw new HttpException(
          'This RMA number already exists!',
          HttpStatus.CONFLICT,
        );
      }
    }

    const issuedDate = new Date(data.issuedDate);
    const receivedDateTime = new Date(data.receivedDateTime);

    const rma = await this.prisma.rma.create({
      data: {
        ...data,
        issuedDate,
        receivedDateTime,
      },
    });
    return { message: 'RMA Saved!', rma };
  }

  async getRmas(
    page = 1,
    limit = 10,
    sortBy = 'issuedDate',
    order: 'asc' | 'desc' = 'desc',
    q?: string,
    filters?: Record<string, string>,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where = this.buildRmaSearchQuery(q, filters);

    const totalRecords = await this.prisma.rma.count({ where });

    const rmas = await this.prisma.rma.findMany({
      where,
      skip,
      take,
      orderBy: { [sortBy]: order },
    });

    return {
      data: rmas,
      meta: {
        totalRecords,
        page,
        limit,
        totalPages: Math.ceil(totalRecords / limit),
      },
    };
  }

  private buildRmaSearchQuery(
    q?: string,
    filters?: Record<string, string>,
  ): Prisma.RmaWhereInput {
    const where: Prisma.RmaWhereInput = {};

    if (q) {
      where.OR = [
        { sn: { contains: q } },
        { device: { contains: q } },
        { rmaNumber: { contains: q } },
        { po: { contains: q } },
        { receivedBy: { contains: q } },
        { extraInfo: { contains: q } },
      ];
    }

    if (filters) {
      for (const key in filters) {
        if (filters[key]) {
          if (key === 'ready') {
            where[key] = filters[key].toLowerCase() === 'true';
          } else if (key === 'holdingTime') {
            const holdingTime = parseInt(filters[key], 10);
            if (!isNaN(holdingTime)) {
              where[key] = holdingTime;
            }
          } else {
            where[key] = { contains: filters[key] };
          }
        }
      }
    }

    return where;
  }

  async getRmaById(id: number) {
    const rma = await this.prisma.rma.findUnique({
      where: { id },
    });
    if (!rma) {
      throw new NotFoundException(`RMA with ID ${id} not found.`);
    }
    return rma;
  }

  async updateRma(id: number, data: UpdateRmaDto) {
    const existingRma = await this.prisma.rma.findUnique({ where: { id } });
    if (!existingRma) {
      throw new NotFoundException(`RMA with ID ${id} not found.`);
    }

    if (data.sn && data.sn !== existingRma.sn) {
      const snConflict = await this.prisma.rma.findFirst({
        where: { sn: data.sn },
      });
      if (snConflict) {
        throw new HttpException('This SN already exists!', HttpStatus.CONFLICT);
      }
    }
    if (data.rmaNumber && data.rmaNumber !== existingRma.rmaNumber) {
      const rmaNumberConflict = await this.prisma.rma.findFirst({
        where: { rmaNumber: data.rmaNumber },
      });
      if (rmaNumberConflict) {
        throw new HttpException(
          'This RMA number already exists!',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updateData: Prisma.RmaUpdateInput = { ...data };
    if (typeof data.issuedDate === 'string') {
      updateData.issuedDate = new Date(data.issuedDate);
    }
    if (typeof data.receivedDateTime === 'string') {
      updateData.receivedDateTime = new Date(data.receivedDateTime);
    }
    const updatedRma = await this.prisma.rma.update({
      where: { id },
      data: updateData,
    });
    return { message: 'RMA Saved!', rma: updatedRma };
  }
  async deleteRma(id: number) {
    const existingRma = await this.prisma.rma.findUnique({ where: { id } });
    if (!existingRma) {
      throw new NotFoundException(`RMA with ID ${id} not found.`);
    }

    await this.prisma.rma.delete({ where: { id } });
    return { message: 'RMA deleted successfully.' };
  }
}
