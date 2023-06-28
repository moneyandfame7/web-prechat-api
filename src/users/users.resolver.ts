import { Resolver } from '@nestjs/graphql'

import { AuthService } from 'authorization/auth.service'
import { UserService } from './users.service'
// import { Prisma } from '@prisma/client'
// import { CreateUserInput } from './users.types'

@Resolver()
export class UserResolver {
  constructor(private usersService: UserService, private authService: AuthService) {}

  // @Mutation('createUser')
  // public async create(@Args('createUserInput') createUserInput: CreateUserInput, @Args('avatar') avatar: FileUpload) {
  //   // const user = await this.usersService.create(createUserInput, avatar)

  //   return user
  // }
}
