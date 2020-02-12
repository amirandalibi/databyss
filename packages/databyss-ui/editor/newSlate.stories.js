import React, { useEffect, useMemo, useState } from 'react'
import ContentEditable from './slate/page/ContentEditable.js'

import { storiesOf } from '@storybook/react'

import { ViewportDecorator } from '@databyss-org/ui/stories/decorators'

const App = () => {
  return <ContentEditable />
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
