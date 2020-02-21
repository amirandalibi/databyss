import ObjectId from 'bson-objectid'
import cloneDeep from 'clone-deep'
import invariant from 'invariant'

import { isAtomicInlineType } from './../../slate/page/reducer'

import {
  SET_ACTIVE_BLOCK_ID,
  SET_OFFSET,
  CHARACTER_PRESS,
  ARROW_KEY,
  BACKSPACE,
} from './constants'

String.prototype.splice = function(idx, rem, str) {
  return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem))
}

const setActiveBlockId = (state, id) => {
  const _state = cloneDeep(state)
  _state.activeBlockId = id
  return _state
}

const setOffset = (state, offset) => {
  // TODO: WHEN CHARACTER IS SET OUT OF RANGE, UPDATE ACTIVE BLOCK ID AND SELECTION TO MOVE UP OR DOWN A BLOCK
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
  if (!activeBlockId) {
    return state
  }

  let _state = cloneDeep(state)
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

  return _state
}

const onArrowKeyPress = (state, key) => {
  let _state = cloneDeep(state)
  switch (key) {
    case 'ArrowRight':
      _state = setOffset(_state, state.selection.anchor.offset + 1)
      break
    case 'ArrowLeft':
      _state = setOffset(_state, state.selection.anchor.offset - 1)
      break
  }

  return _state
}

const onBackspaceKeyPress = state => {
  const { activeBlockId } = state
  if (!activeBlockId) {
    return state
  }

  let _state = cloneDeep(state)

  const { entityId, type } = _state.blockCache[activeBlockId]
  if (isAtomicInlineType(type)) {
    // TODO DELETE ATOMIC
    return state
  }

  const _text = _state.entityCache[entityId].text
  let _textValue = _text.textValue
  // update the text value
  _textValue = _state.entityCache[entityId].text.textValue.splice(
    state.selection.anchor.offset - 1,
    1,
    ''
  )
  _state.entityCache[entityId].text.textValue = _textValue

  // TODO: DELETE RANGE

  // update caret offset
  _state = setOffset(_state, _state.selection.anchor.offset - 1)

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
    case ARROW_KEY:
      return onArrowKeyPress(state, action.payload.key)
    case BACKSPACE:
      return onBackspaceKeyPress(state)
    default:
      return state
  }
}
