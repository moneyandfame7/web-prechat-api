import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { isEmpty, isUUID } from 'class-validator'

import { AuthGuard } from 'Auth/Guard'

import { CurrentSession } from 'common/decorators/Session'
import { AddContactInput, Chat, Session, UpdateContactInput, type User } from '@generated/graphql'
import { ContactNameEmpty, InvalidEntityIdError } from 'common/errors/Common'

import { ContactsService } from './Service'

@Resolver('Contacts')
export class ContactsResolver {
  constructor(/* @Inject('PUB_SUB') private pubSub: PubSub, */ private contacts: ContactsService) {}

  /**
   * Add new contact by user ID.
   * @throws "NOT_FOUND_ENTITY" - if not found user by provided ID.
   * @throws "CONTACT_EXIST" - if contact already added.
   * @throws "INVALID_ID" - if id is not a UUID string.
   */
  @Mutation('addContact')
  @UseGuards(AuthGuard)
  public async addContact(@CurrentSession() session: Session, @Args('input') input: AddContactInput): Promise<User> {
    if (isEmpty(input.firstName)) {
      throw new ContactNameEmpty('contacts.addContact')
    }
    /* publish privacy settings?? */
    return this.contacts.add(session.userId, input)
  }

  /**
   * Update contact by user ID.
   */
  @Mutation('updateContact')
  @UseGuards(AuthGuard)
  public async updateContact(@CurrentSession() session: Session, @Args('input') input: UpdateContactInput) {
    // if (!isUUID(input.userId)) {
    //   throw new InvalidEntityIdError('contacts.addContact')
    // }

    return this.contacts.update(session.userId, input)
  }

  @Mutation('deleteContact')
  @UseGuards(AuthGuard)
  public async deleteContact(@CurrentSession('userId') currentUserId: string, @Args('userId') id: string) {
    // if (!isUUID(id)) {
    //   throw new InvalidEntityIdError('contacts.deleteContact')
    // }

    return this.contacts.delete(currentUserId, id)
  }

  /**
   * @returns List of contacts Users[].
   */
  @Query('getContacts')
  @UseGuards(AuthGuard)
  public async getContacts(@CurrentSession('userId') currentUserId: string): Promise<User[]> {
    return this.contacts.get(currentUserId)
  }
}
