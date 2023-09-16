import { v4 as uuid } from 'uuid'
export function generateId(entity: 'user' | 'chat') {
  const id = uuid()
  switch (entity) {
    case 'chat':
      return `c_${id}`
    case 'user':
      return `u_${id}`
  }
}
