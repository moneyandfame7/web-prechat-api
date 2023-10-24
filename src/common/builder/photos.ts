import type { Prisma } from '@prisma/client'
import type * as Api from '@generated/graphql'
export type SelectPhotoFields = Pick<Prisma.PhotoSelect, 'id' | 'date' | 'blurHash' | 'url' | 'width' | 'height'>
export type PhotoFields = {
  id?: string | undefined
  date?: Date | undefined
  blurHash?: string | undefined
  url?: string | undefined
} | null

export type PrismaPhoto = {
  id?: string | undefined
  date?: Date | undefined
  blurHash?: string | undefined
  url?: string | undefined
}
export function selectPhotoFields(): { select: SelectPhotoFields } {
  return {
    select: {
      id: true,
      date: true,
      blurHash: true,
      url: true,
      width: true,
      height: true,
    },
  }
}

export function buildApiPhoto(photo: PhotoFields): Api.Photo | undefined {
  return photo ? (photo as Api.Photo) : undefined
}
