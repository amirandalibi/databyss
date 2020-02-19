import React, { useMemo, useState, useCallback } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
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

  const [value, setValue] = useState(stateToSlate(_initialState))
  console.log(stateToSlate(_initialState))

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
