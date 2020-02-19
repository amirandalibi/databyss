import { SET_ACTIVE_BLOCK_ID, SET_OFFSET } from './constants'

export function onSetActiveBlockId(id) {
  return {
    type: SET_ACTIVE_BLOCK_ID,
    payload: {
      id,
    },
  }
}

export function onSetOffset(offset) {
  return {
    type: SET_OFFSET,
    payload: {
      offset,
    },
  }
}
