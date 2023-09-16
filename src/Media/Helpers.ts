import type { ColorVariants } from '@prisma/client'
import { getRandomArbitrary } from '../common/functions'

const COLOR_VARIANTS: ColorVariants[] = ['BLUE', 'ORANGE', 'GREEN', 'PINK', 'PURPLE', 'YELLOW']

export function getRandomColor(): ColorVariants {
  return COLOR_VARIANTS[getRandomArbitrary(0, COLOR_VARIANTS.length - 1)]
}
