import ObjectId from 'bson-objectid'
import cloneDeep from 'clone-deep'
import invariant from 'invariant'

import { isAtomicInlineType } from './../../slate/page/reducer'

import { SET_ACTIVE_BLOCK_ID, SET_OFFSET } from './constants'

const setActiveBlockId = (state, id) => {
  const _state = cloneDeep(state)
  _state.activeBlockId = id
  return _state
}

const setOffset = (state, offset) => {
  const _state = cloneDeep(state)
  _state.offset = offset
  return _state
}

const setBlockContent = (state, character) => {
  return state
}

export default (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_BLOCK_ID:
      return setActiveBlockId(state, action.payload.id)
    case SET_OFFSET:
      return setOffset(state, action.payload.offset)
    default:
      return state
  }
}
