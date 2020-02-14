import React, { useState, useMemo, useCallback } from 'react'
import { createEditor, Transforms, Editor } from 'slate'
import { View, RawHtml, Text } from '@databyss-org/ui/primitives'
import { stateToSlateMarkup } from './markup'

import { serialize, atomicHTMLSerializer } from './inlineSerializer'

export const isAtomicInlineType = type => {
  switch (type) {
    case 'SOURCE':
      return true
    case 'TOPIC':
      return true
    default:
      return false
  }
}

export const entities = type =>
  ({ SOURCE: 'sources', TOPIC: 'topics', ENTRY: 'entries' }[type])

/*
convert page state to a slate value
*/

// children: [
//   {
//     type: 'paragraph',
//     children: [
//       { text: 'An opening paragraph with a ' },
//       {
//         type: 'link',
//         url: 'https://example.com',
//         children: [{ text: 'link' }],
//       },
//       { text: ' in it.' },
//     ],
//   },
//   {
//     type: 'quote',
//     children: [{ text: 'A wise quote.' }],
//   },
//   {
//     type: 'paragraph',
//     children: [{ text: 'A closing paragraph!' }],
//   },
// ],

export const stateToSlate = initState => {
  const _blocks = initState.page.blocks
  const _state = _blocks.map(b => {
    // get block ref and id
    const _block = initState.blocks[b._id]
    // const _text = initState[entities(_block.type)][_block.refId].textValue
    // get block text value and
    const _blockData = initState[entities(_block.type)][_block.refId]
    // convert state to apply markup values
    let _childrenText = stateToSlateMarkup(_blockData)
    const __childrenText = _childrenText[0].children.map(c => {
      if (!c.type) {
        return c
      }
      return { type: c.type, children: [{ text: c.text }] }
    })

    const _children = isAtomicInlineType(_block.type)
      ? [
          { text: '' },
          {
            character: serialize({ children: __childrenText }),
            type: _block.type,
            children: [{ text: '' }],
          },
          { text: '' },
        ]
      : _childrenText
    const _data = {
      children: _children,
    }
    return _data
  })
  return _state
}

export const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.location) {
    children = (
      <View
        {...attributes}
        type="text"
        borderBottom="1px dashed"
        borderColor="text.4"
        display="inline"
        borderRadius={0}
      >
        {children}
      </View>
    )
  }

  return <span {...attributes}>{children}</span>
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  })

  return !!match
}
