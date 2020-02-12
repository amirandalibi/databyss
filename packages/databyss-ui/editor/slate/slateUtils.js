import React, { useState, useMemo, useCallback } from 'react'
import { createEditor, Transforms, Editor } from 'slate'
import { View, RawHtml, Text } from '@databyss-org/ui/primitives'
import EditorInline from './../EditorInline'

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

export const stateToSlate = initState => {
  const _blocks = initState.page.blocks
  const _state = _blocks.map(b => {
    const _block = initState.blocks[b._id]
    const _text = initState[entities(_block.type)][_block.refId].textValue

    const _children = isAtomicInlineType(_block.type)
      ? [
          { text: '' },
          { character: _text, type: _block.type, children: [{ text: '' }] },
          { text: '' },
        ]
      : [{ text: _text }]
    const _data = {
      children: _children,
    }
    return _data
  })
  return _state
}

export const getAtomicStyle = type =>
  ({ SOURCE: 'bodyHeaderUnderline', TOPIC: 'bodyHeader' }[type])

export const Element = ({ attributes, children, element }) => {
  const _Element = (text, child, type) => (
    <View
      display="inline-block"
      contentEditable="false"
      type="text"
      suppressContentEditableWarning
      css={{ userSelect: 'none' }}
      overflow="visible"
    >
      <Text display="inline" variant={getAtomicStyle(type)} type="p">
        {text}
      </Text>
      {child}
    </View>
  )

  if (isAtomicInlineType(element.type)) {
    return _Element(element.character, children, element.type)
  }

  return <p {...attributes}>{children}</p>
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
