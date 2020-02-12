import React, { useState, useMemo, useCallback } from 'react'
import { createEditor, Transforms, Editor } from 'slate'
import { View, RawHtml } from '@databyss-org/ui/primitives'
import EditorInline from './../EditorInline'

export const entities = type =>
  ({ SOURCE: 'sources', TOPIC: 'topics', ENTRY: 'entries' }[type])

export const stateToSlate = initState => {
  const _blocks = initState.page.blocks
  const _state = _blocks.map(b => {
    const _block = initState.blocks[b._id]
    const _text = initState[entities(_block.type)][_block.refId].textValue

    const _children =
      _block.type === 'SOURCE'
        ? [
            { text: '' },
            { character: _text, type: 'SOURCE', children: [{ text: '' }] },
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

export const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'SOURCE':
      return (
        <EditorInline>
          <RawHtml _html={{ __html: element.character }} {...attributes} />
          {children}
        </EditorInline>
        // <EditorInline {...attributes}>
        //   {element.character}
        //   {children}
        // </EditorInline>
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}

export const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
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
