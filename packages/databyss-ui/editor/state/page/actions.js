import { SET_ACTIVE_BLOCK_ID } from './constants'

export function onSetActiveBlockId(id) {
  return {
    type: SET_ACTIVE_BLOCK_ID,
    payload: {
      id,
    },
  }
}
