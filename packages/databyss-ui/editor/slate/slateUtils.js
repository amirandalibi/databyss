import React from 'react'
import { Transforms, Editor, Range, Node } from 'slate'
import { View, Text } from '@databyss-org/ui/primitives'
import { stateToSlateMarkup } from './markup'
import { serialize } from './inlineSerializer'
import { _initialState } from '../state/__tests__/initialState'

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

export const stateToSlate = initState => {
  const _blocks = initState.blocks
  const _state = _blocks.map(b => {
    // get block ref and id
    const _block = initState.blockCache[b._id]
    const _blockData = initState.entityCache[_block.entityId]

    // convert state and apply markup values
    let _childrenText = stateToSlateMarkup(_blockData.text)
    const __childrenText = _childrenText[0].children.map(c => {
      if (!c.type) {
        return c
      }
      return { type: c.type, children: [{ text: c.text }] }
    })

    const _children = isAtomicInlineType(_block.type)
      ? [
          { text: '', type: 'spacer' },
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
      isBlock: true,
      key: _block.entityId,
    }
    return _data
  })

  return _state
}

export const stateHasRange = state => {
  if (state.activeBlockId && state.selection.anchor.offset) {
    return true
  }
  return false
}

export const getNodeOffset = editor => {
  if (editor.selection) {
    const _anchor = {
      path: [0, 0],
      offset: 0,
    }
    const _focus = {
      path: [
        0,
        editor.selection.anchor.path[2] || editor.selection.anchor.path[1],
      ],
      offset: editor.selection.anchor.offset,
    }
    const _range = { anchor: _anchor, focus: _focus }
    const _frag = Node.fragment(
      editor.children[editor.selection.anchor.path[0]],
      _range
    )
    const _string = Node.string(_frag[0])
    return _string.length
  }
  return
}

export const editorHasSelection = editor => {
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    return true
  }
  return false
}

export const updateSlateSelection = (state, editor) => {
  if (!stateHasRange(state)) {
    return
  }

  if (state.selection.anchor.offset !== getNodeOffset(editor)) {
    const _selection = {
      anchor: {
        path: [state.selection.anchor.blockIndex, 0],
        offset: state.selection.anchor.offset,
      },
      focus: {
        path: [state.selection.focus.blockIndex, 0],
        offset: state.selection.focus.offset,
      },
    }
    // update selection
    Transforms.setSelection(editor, _selection)
  }
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
        borderBottom="1px dashed"
        borderColor="text.4"
        display="inline"
        borderRadius={0}
      >
        {children}
      </View>
    )
  }

  if (leaf.type == 'spacer') {
    return (
      <Text display="inline" {...attributes} variant="bodyHeader">
        {children}
      </Text>
    )
  }

  return (
    <View display="inline" {...attributes}>
      {children}
    </View>
  )
}

// TODO: THIS FUNCTION IS NOT USED
// USE THIS AS A REFRENCE TO TOGGLE A BLOCK MARK
export const toggleBlock = (editor, format) => {
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
