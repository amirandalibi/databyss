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
  const _selection = _state.selection
  const _index = _state.blocks.findIndex(b => b._id === _state.activeBlockId)
  _selection.anchor = { blockIndex: _index, offset }
  _selection.focus = { blockIndex: _index, offset }
  _state.selection = _selection
  return _state
}

const setBlockContent = (state, char) => {
  // add character to offset position of active block
  // this function assumes a range is not selected

  const { activeBlockId } = state

  let _state = cloneDeep(state)
  if (activeBlockId) {
    const { entityId, type } = _state.blockCache[activeBlockId]
    if (isAtomicInlineType(type)) {
      return state
    }

    const _text = _state.entityCache[entityId].text
    let _textValue = _text.textValue
    // update the text value
    _textValue = _state.entityCache[entityId].text.textValue.splice(
      state.selection.anchor.offset,
      0,
      char
    )
    _state.entityCache[entityId].text.textValue = _textValue

    // update caret offset

    _state = setOffset(_state, _state.selection.anchor.offset + 1)
    // TODO: UPDATE RANGES
  }
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
