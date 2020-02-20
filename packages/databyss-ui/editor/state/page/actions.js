import { SET_ACTIVE_BLOCK_ID, SET_OFFSET, CHARACTER_PRESS } from './constants'

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

export function onCharPress(char) {
  return {
    type: CHARACTER_PRESS,
    payload: {
      char,
    },
  }
}
