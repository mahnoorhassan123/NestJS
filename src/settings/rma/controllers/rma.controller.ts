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
} from '@nestjs/common';
import { RmaService } from '../services/rma.service';
import { CreateRmaDto, UpdateRmaDto } from '../dtos/rma.dto';

@Controller('settings/rma')
export class RmaController {
  constructor(private readonly rmaService: RmaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRma(@Body() createRmaDto: CreateRmaDto) {
    return this.rmaService.createRma(createRmaDto);
  }

  @Get()
  async getRmas(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 10,
    @Query('sortBy') sortBy: string = 'issuedDate',
    @Query('order') order: 'asc' | 'desc' = 'desc',
    @Query('q') q: string,
    @Query('filters') filters: string,
  ) {
    let parsedFilters: Record<string, string> | undefined;
    try {
      if (filters) parsedFilters = JSON.parse(filters);
    } catch (error) {
      console.error('Failed to parse filters', error);
    }
    return this.rmaService.getRmas(
      page,
      limit,
      sortBy,
      order,
      q,
      parsedFilters,
    );
  }

  @Get(':id')
  async getRmaById(@Param('id', ParseIntPipe) id: number) {
    return this.rmaService.getRmaById(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateRma(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRmaDto: UpdateRmaDto,
  ) {
    return this.rmaService.updateRma(id, updateRmaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteRma(@Param('id', ParseIntPipe) id: number) {
    return this.rmaService.deleteRma(id);
  }
}
