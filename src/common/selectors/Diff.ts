import type { SelectPhotoFields } from '../../interfaces/diff'

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
