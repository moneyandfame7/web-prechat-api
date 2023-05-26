import { $$asyncIterator } from 'iterall'

export type FilterFn<T> = (rootValue?: T) => boolean | Promise<boolean>

export const asyncFilter = <T = any>(asyncIterator: AsyncIterator<T>, filterFn: FilterFn<T>) => {
  const getNextPromise = () => {
    return asyncIterator.next().then((payload) => {
      if (payload.done === true) {
        return payload
      }

      return Promise.resolve(filterFn(payload.value))
        .catch(() => false)
        .then((filterResult) => {
          if (filterResult === true) {
            return payload
          }

          // Skip the current value and wait for the next one
          return getNextPromise()
        })
    })
  }

  return {
    next() {
      return getNextPromise()
    },
    return() {
      return asyncIterator.return()
    },
    throw(error) {
      return asyncIterator.throw(error)
    },
    [$$asyncIterator]() {
      return this
    },
  }
}

export function getRandomArbitrary(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
