import React, { useEffect, useMemo, useState } from 'react'
import ContentEditable from './slate/page/ContentEditable.js'
import { RawHtml, Text, Button, Icon, View } from '@databyss-org/ui/primitives'
import EditorPage from './EditorPage'
import EditorProvider from './EditorProvider'
import { storiesOf } from '@storybook/react'
import { _initialState } from './state/__tests__/initialState.js'
import reducer from './state/page/reducer'
import { ViewportDecorator } from '@databyss-org/ui/stories/decorators'

const App = () => {
  return (
    <View pl="20px">
      <EditorProvider initialState={_initialState} reducer={reducer}>
        <EditorPage>
          <ContentEditable />
        </EditorPage>
      </EditorProvider>
    </View>
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
