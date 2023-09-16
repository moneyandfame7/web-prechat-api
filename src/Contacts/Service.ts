import { Injectable } from '@nestjs/common'
import { /*  isPhoneNumber, */ isUUID } from 'class-validator'

import type { AddContactInput, UpdateContactInput, User, Chat } from '@generated/graphql'

import { UserService } from 'Users'

import {
  BadRequestError,
  ContactAlreadyExistError,
  InvalidEntityIdError,
  NotFoundEntityError,
  // PhoneNumberInvalidError,
  PhoneNumberNotFoundError,
} from 'common/errors/Common'

import { ContactsRepository } from './Repository'
import { BuilderService } from 'common/builder/Service'
import { ChatService } from 'Chats'

@Injectable()
export class ContactsService {
  public constructor(
    private repository: ContactsRepository,
    private users: UserService,
    private builder: BuilderService,
    private chats: ChatService,
  ) {}

  /* Adding  */
  public async add(requesterId: string, input: AddContactInput): Promise<User> {
    if (input.userId) {
      // if (!isUUID(input.userId)) {
      //   throw new InvalidEntityIdError('contacts.addContact')
      // }

      return this.addById(requesterId, {
        firstName: input.firstName,
        lastName: input.lastName,
        userId: input.userId,
      })
    }

    if (input.phoneNumber) {
      // if (input.phoneNumber !== '+12345678' && !isPhoneNumber(input.phoneNumber)) {
      //   throw new PhoneNumberInvalidError('contacts.addContact')
      // }

      return this.addByPhone(requesterId, {
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: input.phoneNumber,
      })
    }

    throw new BadRequestError('contacts.addContact', 'User id or phone number not provided.')
  }

  private async addByPhone(requesterId: string, input: AddContactInput & { phoneNumber: string }): Promise<User> {
    const user = await this.users.getApiByPhone(requesterId, input.phoneNumber)

    if (!user) {
      throw new PhoneNumberNotFoundError('contacts.addContact')
    }
    this.validateContact(user)

    const added = await this.repository.add(requesterId, {
      userId: user.id,
      firstName: input.firstName,
      lastName: input.lastName,
    })
    // const chat = await this.chats.createPrivate(requesterId, { userId: user.id })
    /* const contact = await */ return this.builder.buildApiUserAndStatus(added.contact, requesterId)

    // return { chat, user: contact }
  }

  private async addById(requesterId: string, input: AddContactInput & { userId: string }): Promise<User> {
    const user = await this.users.getApiById(requesterId, input.userId)

    if (!user) {
      throw new NotFoundEntityError('contacts.addContact')
    }

    this.validateContact(user)

    const added = await this.repository.add(requesterId, {
      userId: user.id,
      firstName: input.firstName,
      lastName: input.lastName,
    })
    // const chat = await this.chats.createPrivate(requesterId, { userId: user.id })
    return this.builder.buildApiUserAndStatus(added.contact, requesterId)

    // return user
  }

  private validateContact(user: User) {
    if (user.isSelf) {
      throw new BadRequestError('contacts.addContact', "You can't add yourself to contacts :)")
    }
    if (user.isContact) {
      throw new ContactAlreadyExistError('contacts.addContact')
    }
  }

  /* Updating */
  public async update(requesterId: string, input: UpdateContactInput) {
    const contactToUpdate = await this.repository.find(requesterId, input.userId)

    if (!contactToUpdate) {
      throw new NotFoundEntityError('contacts.updateContact')
    }

    return this.repository.update(contactToUpdate.id, input)
  }

  /* Deleting */
  public async delete(requesterId: string, userId: string) {
    const contact = await this.repository.find(requesterId, userId)
    if (!contact) {
      throw new NotFoundEntityError('contacts.deleteContact')
    }

    return this.repository.delete(contact.id)
  }

  public async get(requesterId: string): Promise<User[]> {
    const contacts = await this.repository.get(requesterId)
    return this.builder.buildApiUsersAndStatuses(contacts, requesterId)
  }
}
