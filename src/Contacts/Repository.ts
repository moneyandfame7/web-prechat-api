import { Injectable } from '@nestjs/common'
import type { AddContactInput, UpdateContactInput } from '@generated/graphql'

import { PrismaService } from 'common/prisma.service'
import { selectUserFieldsToBuild } from 'common/builder/users'

@Injectable()
export class ContactsRepository {
  public constructor(public readonly prisma: PrismaService) {}

  public async add(requesterId: string, input: AddContactInput & { userId: string }) {
    return this.prisma.contact.create({
      data: {
        ownerId: requesterId,
        contactId: input.userId,
        firstName: input.firstName,
        lastName: input.lastName,
      },
      include: {
        contact: {
          select: {
            ...selectUserFieldsToBuild(),
          },
        },
      },
    })
  }

  public async update(contactId: string, input: UpdateContactInput) {
    return this.prisma.contact.update({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
      },
      where: {
        id: contactId,
      },
    })
  }

  public async delete(contactEntityId: string) {
    /* also check DISCONNECT?? */
    return this.prisma.contact.delete({
      where: {
        id: contactEntityId,
      },
    })
  }

  public async find(requesterId: string, userContactId: string) {
    return this.prisma.contact.findFirst({
      where: {
        contactId: userContactId,
        ownerId: requesterId,
      },
    })
  }

  public async findUser(id: string) {
    return this.prisma.user.findUnique({ where: { id } })
  }

  public async get(requesterId: string) {
    return this.prisma.user.findMany({
      where: {
        addedByContacts: {
          some: {
            ownerId: requesterId,
          },
        },
      },
      select: {
        ...selectUserFieldsToBuild(),
      },
    })
  }
}
