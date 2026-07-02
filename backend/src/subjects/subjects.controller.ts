import { Controller, Get, Param } from '@nestjs/common';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  findAll() {
    return this.subjectsService.findAll();
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.subjectsService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Get(':id/lessons')
  findLessons(@Param('id') id: string) {
    return this.subjectsService.findLessons(id);
  }
}
