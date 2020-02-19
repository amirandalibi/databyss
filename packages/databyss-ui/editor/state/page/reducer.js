import ObjectId from 'bson-objectid'
import cloneDeep from 'clone-deep'
import invariant from 'invariant'

import { isAtomicInlineType } from './../../slate/page/reducer'

import { SET_ACTIVE_BLOCK_ID } from './constants'

const setActiveBlockId = (state, id) => {
  return state
}

const setBlockContent = (state, character) => {
  return state
}

export default (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_BLOCK_ID:
      return setActiveBlockId(state, action.payload.id)

    default:
      return state
  }
}
