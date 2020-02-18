import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { createEditor, Transforms, Editor, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import initialState from './../../state/__tests__/initialState.js'
import {
  stateToSlate,
  Leaf,
  toggleMark,
  isAtomicInlineType,
} from './../slateUtils'
import { Element } from './../../EditorBlock'
import HoveringToolbar from './../../HoveringToolbar'
import FormatMenu from './../../Menu/FormatMenu'
import hotKeys from './../hotKeys'

import _ContentEditable from './_ContentEditable.js'

const ContentEditable = () => {
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

  const [value, setValue] = useState(stateToSlate(initialState))

  const renderElement = useCallback(props => <Element {...props} />, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  const onKeyDown = event => {
    if (hotKeys.isBold(event)) {
      event.preventDefault()
      toggleMark(editor, 'bold')
    }
    if (hotKeys.isItalic(event)) {
      event.preventDefault()
      toggleMark(editor, 'italic')
    }
    if (hotKeys.isLocation(event)) {
      event.preventDefault()
      toggleMark(editor, 'location')
    }
  }

  console.log(editor)

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <FormatMenu />
      <Editable
        onKeyDown={onKeyDown}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  )
}

export default ContentEditable

// remove rich text
// follow ui/editor
// get it mounted
// introduce context
// dont pass through reducer
// get initial state
// start adding event lister
