import { Resolver, Mutation, Args } from '@nestjs/graphql'
import { ApiService } from './api.service'

@Resolver('Api')
export class ApiResolver {
  constructor(private readonly apiService: ApiService) {}

  @Mutation('generateApiToken')
  public async generateApiToken(@Args('phoneNumber') phoneNumber: string) {
    return this.apiService.generateApiToken(phoneNumber)
  }
}
