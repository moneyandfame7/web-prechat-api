import { Injectable } from '@nestjs/common'

import { FirebaseService } from 'Firebase/Service'

import { PrismaService } from '../prisma.service'
import { CreateUserInput } from './Types'
import { getRandomAvatarVariant } from 'Media/Helpers'
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService, private firebaseService: FirebaseService) {}

  // public async test(input: CreateUserInput, avatar: FileUpload) {
  //   const avatarName = input.username.toLowerCase().replace(/\s+/g, '-') + Date.now()
  //   const initialName = avatar.filename
  //   return this.firebaseService.uploadFile(avatar, initialName, `avatars/${avatarName}`)
  //   // return this.firebaseService.uploadFile(input.avat)
  //   // const user = await this.prismaService.user.create({
  //   //   data: {
  //   //     ...input,
  //   //   },
  //   // })
  // }

  public async create({ firstName, lastName, phoneNumber, photoUrl }: CreateUserInput) {
    return this.prismaService.user.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        avatar: {
          create: {
            images: {
              create: {
                url: photoUrl || 'WTOOO',
                hash: 'SOSI HUI ABOBA',
              },
            },
            avatarVariant: getRandomAvatarVariant(),
          },
        },
      },
    })
  }

  public async getByPhone(phoneNumber: string) {
    return this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
    })
  }

  public async getTwoFaByPhone(phoneNumber: string) {
    return this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        twoFaAuth: {
          select: {
            email: true,
            hint: true,
          },
        },
      },
    })
  }

  public async getApiTokenByPhone(phoneNumber: string) {
    return this.prismaService.user.findUnique({
      where: {
        phoneNumber,
      },
      select: {
        apiToken: true,
        id: true,
      },
    })
  }

  public async getById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    })
  }
}
