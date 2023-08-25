import { Injectable } from '@nestjs/common'

import type { AuthTwoFa } from '@generated/graphql'

import { AccountRepository } from './Repository'

@Injectable()
export class AccountService {
  public constructor(private repository: AccountRepository) {}

  public async getPassword(requesterId: string): Promise<AuthTwoFa | undefined> {
    const twoFa = await this.repository.getPassword(requesterId)

    if (!twoFa) {
      return undefined
    }

    return {
      email: twoFa?.email,
      hint: twoFa?.hint,
    }
  }

  public async checkPassword(requesterId: string, password: string) {
    const twoFa = await this.repository.getPassword(requesterId)

    return twoFa?.password === password
  }
}
