import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UnauthorizedException,
} from '@nestjs/common';
import { FileService } from '../services/files.service';
import { CreateFilesDto, UpdateFilesDto } from '../dtos/files.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Controller('settings/files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/i)) {
          return cb(new Error('Only image and PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async createFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { title: string; tableName: string; tableID?: string },
    @Req() req: Request,
  ) {
    const user = req['user'] as { id: number; firstname: string };
    if (!user || !user.id) {
      throw new UnauthorizedException('Valid user not found on request.');
    }

    const fileExt = extname(file.originalname).replace('.', '');

    const fullDto: CreateFilesDto = {
      title: body.title,
      URL: `http://localhost:3001/uploads/${file.filename}`,
      fileExt: fileExt,
      tableName: body.tableName,
      // Note: I'm using 'tableId' here to match your corrected schema
      tableId: body.tableID ? parseInt(body.tableID, 10) : 0,
      // 2. Now it's safe to use user.id
      createdBy: user.id,
    };
    return this.fileService.createFile(fullDto);
  }

  @Get()
  async getFiles(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('q') q?: string,
  ) {
    return this.fileService.getFiles(page, limit, q);
  }

  @Get(':id')
  async getFileById(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.getFileById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateFile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFileDto: UpdateFilesDto,
  ) {
    return this.fileService.updateFile(id, updateFileDto);
  }

  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) id: number) {
    return this.fileService.deleteFile(id);
  }
}
