import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFilesDto, UpdateFilesDto } from '../dtos/files.dto';
import { Prisma, User } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { FileMapper } from '../mappers/files.mapper';

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

    const fileData: Prisma.FileCreateInput = {
      title: data.title,
      URL: data.URL,
      fileExt: data.fileExt,
      tableName: data.tableName,
      tableId: data.tableId,
      user: {
        connect: { id: data.createdBy },
      },
    };

    const createdFile = await this.prisma.file.create({
      data: fileData,
      include: { user: true },
    });

    return {
      message: 'File Saved!',
      file: FileMapper.toDto(createdFile, createdFile.user),
    };
  }

  async getFiles(page = 1, limit = 10, q?: string) {
    const whereClause: Prisma.FileWhereInput = q
      ? {
          OR: [
            { title: { contains: q } },
            { user: { firstname: { contains: q } } },
            { user: { lastname: { contains: q } } },
          ],
        }
      : {};

    const [files, total] = await Promise.all([
      this.prisma.file.findMany({
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
        include: { user: true },
      }),
      this.prisma.file.count({ where: whereClause }),
    ]);

    const mappedFiles = files.map((file) =>
      FileMapper.toDto(file, file.user as User),
    );

    return {
      data: mappedFiles,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async getFileById(id: number) {
    const file = await this.prisma.file.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!file) {
      throw new HttpException(
        `File with ID: ${id} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return FileMapper.toDto(file, file.user as User);
  }

  async updateFile(id: number, data: UpdateFilesDto) {
    await this.prisma.file.findUniqueOrThrow({ where: { id } });

    const updatedFile = await this.prisma.file.update({
      where: { id },
      data,
      include: { user: true },
    });

    return {
      message: 'File Updated',
      file: FileMapper.toDto(updatedFile, updatedFile.user as User),
    };
  }

  async deleteFile(id: number) {
    const existingFile = await this.prisma.file.findUniqueOrThrow({
      where: { id },
    });

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
