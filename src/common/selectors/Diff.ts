import type { Prisma } from '@prisma/client'

export function selectPhotoFields() {
  return {
    id: true,
    date: true,
    blurHash: true,
    url: true,
    width: true,
    height: true,
    withSpoiler: true,
  } satisfies Prisma.PhotoSelect
}

export function selectDocumentFields() {
  return {
    id: true,
    isMedia: true,
    blurHash: true,
    fileName: true,
    date: true,
    size: true,
    mimeType: true,
    url: true,
  } satisfies Prisma.DocumentSelect
}
