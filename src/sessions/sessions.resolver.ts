import { Resolver } from '@nestjs/graphql'
import { SessionService } from './sessions.service'

@Resolver('Session')
export class SessionsResolver {
  constructor(private readonly sessionsService: SessionService) {}
}
