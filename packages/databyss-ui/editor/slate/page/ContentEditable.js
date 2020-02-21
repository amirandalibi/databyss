import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { createEditor, Range, Node, Editor, Point } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { useEditorContext } from './../../EditorProvider'
import { _initialState } from './../../state/__tests__/initialState.js'
import {
  stateToSlate,
  _stateToSlate,
  Leaf,
  toggleMark,
  isAtomicInlineType,
  updateSlateSelection,
  editorHasSelection,
  getNodeOffset,
} from './../slateUtils'
import { Element } from './../../EditorBlock'
import FormatMenu from './../../Menu/FormatMenu'
import hotKeys from './../hotKeys'

const ContentEditable = () => {
  const {
    state,
    setActiveBlockId,
    setOffset,
    characterKeyPress,
    arrowKeyPress,
  } = useEditorContext()

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

  const renderElement = useCallback(props => <Element {...props} />, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  const onClick = () => {
    checkActiveBlockChange()
    checkCaretOffset()
  }

  const onKeyDown = event => {
    if (hotKeys.isArrowLeft(event) || hotKeys.isArrowRight(event)) {
      arrowKeyPress(event.key)
      return event.preventDefault()
    }
    // allows only alphanumeric characters'
    const _regEx = /[a-zA-Z0-9-_ ]/
    const input = String.fromCharCode(event.keyCode)
    if (_regEx.test(input)) {
      characterKeyPress(event.key)
      return event.preventDefault()
    }

    // let re = new RegExp('^([a-zA-Z0-9 _-]+)$')
    // console.log(re)
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
    if (editorHasSelection(editor)) {
      // get current selection key
      const _path = editor.selection.anchor.path
      const _key = state.blocks[_path[0]]._id
      // const _key = Editor.node(editor, [_path[0]])[0].key
      // update if different from state value
      if (state.activeBlockId !== _key) {
        setActiveBlockId(_key)
      }
    }
  }

  // get caret offset on select
  const checkCaretOffset = () => {
    if (editorHasSelection(editor)) {
      // get current offset
      const _offset = getNodeOffset(editor)

      if (state.selection.anchor.offset !== _offset) {
        setOffset(_offset)
      }
    } else {
      console.log('selection ')
    }
  }

  // check is selection needs to be updated from state offset
  updateSlateSelection(state, editor)

  return (
    <Slate editor={editor} value={stateToSlate(state)} onChange={value => null}>
      <FormatMenu />
      <Editable
        onClick={onClick}
        //  onSelect={onSelect}
        onKeyDown={onKeyDown}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  )
}

export default ContentEditable
