import { isAtomicInlineType } from './page/reducer'
import Html from 'slate-html-serializer'
import { getRangesFromBlock } from './markup'
import { newEditor } from './slateUtils'
import ObjectId from 'bson-objectid'

// deserializer for atomic blocks
const MARK_TAG = {
  em: 'italic',
  strong: 'bold',
}

const rules = [
  {
    deserialize(el, next) {
      const mark = MARK_TAG[el.tagName.toLowerCase()]
      if (!mark) {
        return
      }
      return {
        object: 'mark',
        type: mark,
        nodes: next(el.childNodes),
      }
    },
  },
]

/*
takes a node list and deserializes them to return a list with refId, _id, text, and ranges
*/
export const blocksToState = nodes => {
  const _blocks = nodes.map(block => blockToState(block)).toJS()
  return _blocks
}

export const blockToState = block => {
  // refID is required in the block data
  // refId is used to look up ranges and text in state
  let refId = block.data ? block.data.get('refId') : null
  let _textFields
  let _block = block

  if (isAtomicInlineType(block.type)) {
    // deserializes the html text to return ranges and marks
    _block = new Html({ rules }).deserialize(block.text).anchorBlock
  } else {
    // if not atomic, generate new refId
    refId = ObjectId().toHexString()
  }
  _textFields = getRangesFromBlock(_block.toJSON())

  const text = _textFields.text
  const ranges = _textFields.ranges

  const response = {
    text,
    type: block.type,
    ranges,
    refId,
    _id: block.key,
  }
  return { [block.key]: response }
}

export const getFragFromText = text => {
  // create a list split by carriage returns
  const _textList = text.split(/\r?\n/)
  // creates a slate editor to compose a fragment
  let _editor = newEditor()
  // creates list of new blocks with refId and _id

  const _blockList = _textList.map(t => {
    const _refId = ObjectId().toHexString()
    const _key = ObjectId().toHexString()
    const _block = {
      object: 'block',
      type: 'ENTRY',
      data: { refId: _refId },
      key: _key,
      nodes: [
        {
          object: 'text',
          text: t,
        },
      ],
    }
    _editor.insertBlock(_block)
    return {
      [_key]: {
        _id: _key,
        refId: _refId,
        text: t,
        type: 'ENTRY',
        ranges: [],
      },
    }
  })

  // removes first node in fragment
  // this node is empty by default
  const _frag = _editor.value.document.removeNode(
    _editor.value.document.nodes.get(0).key
  )
  return { _blockList, _frag }
}
