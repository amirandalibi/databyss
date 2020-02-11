import React, { useEffect, useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import initialState from './../editor/state/__tests__/initialState.js'

import { storiesOf } from '@storybook/react'

import { ViewportDecorator } from '@databyss-org/ui/stories/decorators'

const entities = type =>
  ({ SOURCE: 'sources', TOPIC: 'topics', ENTRY: 'entries' }[type])

const stateToSlate = initState => {
  const _blocks = initState.page.blocks
  const _state = _blocks.map(b => {
    const _block = initState.blocks[b._id]
    const _text = initState[entities(_block.type)][_block.refId].textValue
    return { type: _block.type, children: [{ text: _text }] }
    // console.log(_block.type)
  })
  return _state
}

console.log(stateToSlate(initialState))

const App = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState(stateToSlate(initialState))

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable />
    </Slate>
  )
}

storiesOf('Refactor//', module)
  .addDecorator(ViewportDecorator)
  .add('Slate', () => <App />)

// remove rich text
// follow ui/editor
// get it mounted
// introduce context
// dont pass through reducer
// get initial state
// start adding event lister
//
