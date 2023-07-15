import { Resolver } from '@nestjs/graphql'
import { SessionService } from './Service'

@Resolver('Session')
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionService) {}
}
