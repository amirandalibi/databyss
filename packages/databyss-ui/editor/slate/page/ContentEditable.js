import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { createEditor, Transforms, Editor, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import initialState from './../../state/__tests__/initialState.js'
import { stateToSlate, Leaf, Element, toggleMark } from './../slateUtils'

import _ContentEditable from './_ContentEditable.js'

const ContentEditable = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(stateToSlate(initialState))

  const renderElement = useCallback(props => <Element {...props} />, [])

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />
  }, [])

  const onKeyDown = event => {
    if (!event.ctrlKey) {
      return
    }
    switch (event.key) {
      case 'b': {
        event.preventDefault()
        toggleMark(editor, 'bold')
        break
      }
    }
  }

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
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
//
