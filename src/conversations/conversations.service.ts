import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateConversationInput } from 'src/types/graphql';

@Injectable()
export class ConversationsService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createConversationInput: CreateConversationInput) {
    return 'This action adds a new conversation';
  }

  findAll() {
    return `This action returns all conversations`;
  }
}
