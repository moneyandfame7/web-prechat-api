import { Module } from '@nestjs/common'
import { FoldersResolver } from './Resolver'
import { FoldersService } from './Service'
import { FoldersRepository } from './Repository'
import { BuilderModule } from 'common/builder/Module'

@Module({
  imports: [BuilderModule],
  providers: [FoldersResolver, FoldersService, FoldersRepository],
  exports: [FoldersService, FoldersRepository],
})
export class FoldersModule {}
