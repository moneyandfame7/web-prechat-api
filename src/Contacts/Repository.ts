import { Injectable } from '@nestjs/common'
import type { AddContactInput, UpdateContactInput } from '@generated/graphql'

import { PrismaService } from 'common/prisma.service'
import { buildApiUser, selectUserFieldsToBuild } from 'common/builder/users'

@Injectable()
export class ContactsRepository {
  public constructor(public readonly prisma: PrismaService) {}

  public async add(requesterId: string, input: AddContactInput & { userId: string }) {
    const result = await this.prisma.contact.create({
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

    return buildApiUser(requesterId, result.contact)
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
    const users = await this.prisma.user.findMany({
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
    return users.map((u) => buildApiUser(requesterId, u))
  }
}
