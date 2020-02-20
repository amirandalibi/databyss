import ObjectId from 'bson-objectid'
import cloneDeep from 'clone-deep'
import invariant from 'invariant'

import { isAtomicInlineType } from './../../slate/page/reducer'

import { SET_ACTIVE_BLOCK_ID, SET_OFFSET, CHARACTER_PRESS } from './constants'

String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
}

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

const setBlockContent = (state, char) => {
  // add character to offset position of active block
  const { activeBlockId } = state

  const _state = cloneDeep(state)
  if (activeBlockId) {
    const _id = _state.blockCache[activeBlockId].entityId
    const _text = _state.entityCache[_id].text
    let _textValue = _text.textValue
    // update the text value
    _textValue = _state.entityCache[_id].text.textValue.splice(
      state.offset,
      0,
      char
    )
    _state.entityCache[_id].text.textValue = _textValue
    // update caret offset
    console.log(_state.offset)
    _state.offset = _state.offset + 1
    console.log(_state.offset)
  }

  console.log(char)
  return _state
}

export default (state, action) => {
  switch (action.type) {
    case SET_ACTIVE_BLOCK_ID:
      return setActiveBlockId(state, action.payload.id)
    case SET_OFFSET:
      return setOffset(state, action.payload.offset)
    case CHARACTER_PRESS:
      return setBlockContent(state, action.payload.char)
    default:
      return state
  }
}
