import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFilesDto, UpdateFilesDto } from '../dtos/files.dto';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async createFile(data: CreateFilesDto) {
    const existingFile = await this.prisma.file.findUnique({
      where: { title: data.title },
    });

    if (existingFile) {
      throw new HttpException(
        'A file with this title already exists.',
        HttpStatus.CONFLICT,
      );
    }

    const createdFile = await this.prisma.file.create({ data });
    return { message: 'File Saved!', file: createdFile };
  }

  async getFiles(page = 1, limit = 10, q?: string) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.FileWhereInput = {};

    if (q) {
      whereClause.title = {
        contains: q,
      };
    }

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.file.count({ where: whereClause }),
    ]);

    return {
      data: files,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async updateFile(id: number, data: UpdateFilesDto) {
    const existingFile = await this.prisma.file.findUnique({ where: { id } });
    if (!existingFile) {
      throw new NotFoundException('File not found');
    }

    if (data.title && data.title !== existingFile.title) {
      const titleConflict = await this.prisma.file.findFirst({
        where: {
          title: data.title,
          id: { not: id },
        },
      });
      if (titleConflict) {
        throw new HttpException(
          'This title already exists!',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updatedFile = await this.prisma.file.update({ where: { id }, data });
    return { message: 'File Updated', file: updatedFile };
  }

  async deleteFile(id: number) {
    const existingFile = await this.prisma.file.findUnique({ where: { id } });
    if (!existingFile) {
      throw new NotFoundException('File not found');
    }

    try {
      const filename = existingFile.URL.split('/').pop();
      if (filename) {
        const filePath = path.join(process.cwd(), 'uploads', filename);

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (error) {
      console.error(`Failed to delete physical file: ${error}`);
    }
    await this.prisma.file.delete({ where: { id } });
    return { message: 'File deleted successfully' };
  }
}
