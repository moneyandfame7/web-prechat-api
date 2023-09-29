import { pick } from './pick'

export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const toSaveKeys = Object.keys(obj).filter((k) => !keys.includes(k as K)) as Array<Exclude<keyof T, K>>

  return pick(obj, toSaveKeys)
}
