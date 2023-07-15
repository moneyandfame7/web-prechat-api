import { AvatarVariants } from '@prisma/client'
import { getRandomArbitrary } from 'common/functions'

const AVATAR_VARIANTS: AvatarVariants[] = ['BLUE', 'ORANGE', 'GREEN', 'PINK', 'PURPLE', 'YELLOW']

export function getRandomAvatarVariant(): AvatarVariants {
  return AVATAR_VARIANTS[getRandomArbitrary(0, AVATAR_VARIANTS.length - 1)]
}
