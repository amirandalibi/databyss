import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { createEditor, Range, Node, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { useEditorContext } from './../../EditorProvider'
import initialState, {
  _initialState,
} from './../../state/__tests__/initialState.js'
import {
  stateToSlate,
  _stateToSlate,
  Leaf,
  toggleMark,
  isAtomicInlineType,
} from './../slateUtils'
import { Element } from './../../EditorBlock'
import FormatMenu from './../../Menu/FormatMenu'
import hotKeys from './../hotKeys'

const ContentEditable = () => {
  const { state, setActiveBlockId, setOffset } = useEditorContext()

  const withInline = editor => {
    const { isInline, isVoid } = editor
    editor.isInline = element => {
      return isAtomicInlineType(element.type) ? true : isInline(element)
    }
    editor.isVoid = element => {
      return isAtomicInlineType(element.type) ? true : isVoid(element)
    }
    return editor
  }

  const editor = useMemo(() => withInline(withReact(createEditor())), [])

  const [value, setValue] = useState(stateToSlate(state))

  const renderElement = useCallback(props => <Element {...props} />, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  const onSelect = () => {
    checkActiveBlockChange()
    checkCaretOffset()
  }

  const onKeyDown = event => {
    event.preventDefault()
    // if (hotKeys.isBold(event)) {
    //   event.preventDefault()
    //   toggleMark(editor, 'bold')
    // }
    // if (hotKeys.isItalic(event)) {
    //   event.preventDefault()
    //   toggleMark(editor, 'italic')
    // }
    // if (hotKeys.isLocation(event)) {
    //   event.preventDefault()
    //   toggleMark(editor, 'location')
    // }
  }

  // check if active block matches current block
  const checkActiveBlockChange = () => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      // get current selection key
      const _path = editor.selection.anchor.path
      const _key = Editor.node(editor, [_path[0]])[0].key
      // update if different from state value
      if (state.activeBlockId !== _key) {
        setActiveBlockId(_key)
      }
    }
  }

  // get caret offset on select
  const checkCaretOffset = () => {
    if (editor.selection && Range.isCollapsed(editor.selection)) {
      // get current offset
      const _offset = editor.selection.anchor.offset
      if (state.offset !== _offset) {
        setOffset(_offset)
      }
    } else {
      console.log('selection ')
    }
  }

  return (
    <Slate editor={editor} value={value} onChange={value => null}>
      <FormatMenu />
      <Editable
        onSelect={onSelect}
        onKeyDown={onKeyDown}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  )
}

export default ContentEditable
