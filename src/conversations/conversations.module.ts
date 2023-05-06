import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ConversationsResolver, ConversationsService, PrismaService],
})
export class ConversationsModule {}
