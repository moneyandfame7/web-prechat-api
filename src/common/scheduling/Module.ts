import { Module } from '@nestjs/common'
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule'
import { ScheduleService } from './Service'

@Module({
  imports: [NestScheduleModule.forRoot()],
  providers: [ScheduleService],
})
export class ScheduleModule {}
