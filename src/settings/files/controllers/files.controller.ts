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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from '../services/files.service';
import { CreateFilesDto, UpdateFilesDto } from '../dtos/files.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
    @Body() body: { title: string },
  ) {
    const fullDto: CreateFilesDto = {
      title: body.title,
      URL: `http://localhost:3001/uploads/${file.filename}`,
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
