import type { SelectPhotoFields } from 'types/Diff'

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
