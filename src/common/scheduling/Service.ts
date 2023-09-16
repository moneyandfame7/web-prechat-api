import { Injectable } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'

@Injectable()
export class ScheduleService {
  public constructor(private schedule: SchedulerRegistry) {}

  public test() {
    this.schedule.getCronJobs()
  }
}
