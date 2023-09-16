import { Injectable } from '@nestjs/common'

import { SearchRepository } from './Repository'

@Injectable()
export class SearchService {
  constructor(private repository: SearchRepository) {}
}
