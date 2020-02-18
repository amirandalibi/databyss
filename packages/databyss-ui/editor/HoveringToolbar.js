// import React, { useRef, useState, useEffect } from 'react'
// import { pxUnits } from '@databyss-org/ui/theming/views'
// import styledCss from '@styled-system/css'
// import { Grid, View } from '@databyss-org/ui/primitives'
// import theme, { borderRadius, darkTheme } from '@databyss-org/ui/theming/theme'
// import { ThemeProvider } from 'emotion-theming'
// import space from '@databyss-org/ui/theming/space'
// import { isMobileOs } from '@databyss-org/ui/'
// import { isActiveSelection } from './slate/slateUtils'
// import { useEditorContext } from './EditorProvider'
// import { onShowFormatMenu } from './state/page/actions'

// const _mobile = isMobileOs()

// const _css = position => ({
//   paddingLeft: 'small',
//   paddingRight: 'small',
//   backgroundColor: 'background.0',
//   zIndex: 1,
//   pointerEvents: 'none',
//   marginTop: pxUnits(-6),
//   position: 'absolute',
//   opacity: 0,
//   transition: `opacity ${theme.timing.quick}ms ease`,
//   borderRadius,
//   ...position,
// })

// const getPosition = (editor, menuRef) => {
//   const menu = menuRef.current
//   if (!menu) return null
//   const native = window.getSelection()
//   const range = native.getRangeAt(0)
//   const rect = range.getBoundingClientRect()

//   let menuTopOffset = 0
//   if (rect.top < menu.offsetHeight) {
//     menuTopOffset = 62
//   }

//   // eslint-disable-next-line
//   const _node = editor.findDOMNode(
//     editor.value.document.getPath(editor.value.selection.focus.key)
//   )
//   const isMobileNewLine = rect.width === 0
//   const _mobileOffsetHeight = isMobileNewLine
//     ? `${rect.bottom + _node.getBoundingClientRect().top + 32}px`
//     : `${rect.bottom + window.pageYOffset + 10 + menuTopOffset}px`
//   // menu offset to prevent overflow
//   let menuLeftOffset = 0

//   if (menu.offsetWidth / 2 > rect.left + rect.width / 2) {
//     menuLeftOffset =
//       menu.offsetWidth / 2 - (rect.left + rect.width / 2) + space.small
//   }

//   if (rect.left + rect.width / 2 + menu.offsetWidth / 2 > window.innerWidth) {
//     menuLeftOffset =
//       window.innerWidth -
//       (rect.left + rect.width / 2 + menu.offsetWidth / 2) -
//       space.small
//   }

//   return {
//     top: _mobile
//       ? _mobileOffsetHeight
//       : pxUnits(
//           rect.top + window.pageYOffset - menu.offsetHeight + menuTopOffset
//         ),
//     left: pxUnits(
//       rect.left +
//         window.pageXOffset -
//         menu.offsetWidth / 2 +
//         rect.width / 2 +
//         menuLeftOffset
//     ),
//   }
// }

// const _activeCss = {
//   pointerEvents: 'all',
//   opacity: 1,
// }

// const isNewLine = value =>
//   value.anchorBlock && value.anchorBlock.text.length === 0

// const EditorTooltip = ({ children, css, editor, ...others }) => {
//   const [editorState, dispatchEditor] = useEditorContext()
//   const menuRef = useRef(null)
//   const [position, setPosition] = useState({ top: 0, left: 0 })
//   const { value } = editor
//   const { showFormatMenu } = editorState
//   useEffect(
//     () => {
//       if (isActiveSelection(value) || (_mobile && isNewLine(value))) {
//         setPosition(getPosition(editor, menuRef))
//         if (!showFormatMenu) {
//           dispatchEditor(onShowFormatMenu(true, { value }))
//         }
//       } else if (showFormatMenu) {
//         dispatchEditor(onShowFormatMenu(false, { value }))
//       }
//     },
//     [value]
//   )

//   return (
//     <ThemeProvider theme={darkTheme}>
//       <View
//         css={[
//           styledCss(_css(position))(darkTheme),
//           showFormatMenu && styledCss(_activeCss)(darkTheme),
//           css,
//         ]}
//         {...others}
//         ref={menuRef}
//       >
//         <Grid singleRow columnGap={0} flexWrap="nowrap">
//           {children}
//         </Grid>
//       </View>
//     </ThemeProvider>
//   )
// }

// export default EditorTooltip

import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { cx, css } from 'emotion'
import { ThemeProvider } from 'emotion-theming'
import { Grid, View } from '@databyss-org/ui/primitives'
import styledCss from '@styled-system/css'
import theme, { borderRadius, darkTheme } from '@databyss-org/ui/theming/theme'
import { pxUnits } from '@databyss-org/ui/theming/views'

import { Slate, Editable, ReactEditor, withReact, useSlate } from 'slate-react'
import { Editor, Transforms, Text, createEditor, Range } from 'slate'

const Portal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body)
}

const _activeCss = {
  pointerEvents: 'all',
  opacity: 1,
}

const _css = position => ({
  paddingLeft: 'small',
  paddingRight: 'small',
  backgroundColor: 'background.0',
  zIndex: 1,
  pointerEvents: 'none',
  marginTop: pxUnits(-6),
  position: 'absolute',
  opacity: 0,
  transition: `opacity ${theme.timing.quick}ms ease`,
  borderRadius,
  ...position,
})

const HoveringToolbar = ({ children }) => {
  const ref = useRef()
  const editor = useSlate()

  const [position, setPosition] = useState({ top: -200, left: -200 })

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)

    const rect = domRange.getBoundingClientRect()
    el.style.opacity = 1
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left + window.pageXOffset + rect.width}px`
  })

  const showFormatMenu = true

  return (
    <Portal>
      <ThemeProvider theme={darkTheme}>
        <View
          css={[
            styledCss(_css(position))(darkTheme),
            showFormatMenu && styledCss(_activeCss)(darkTheme),
          ]}
          //   {...others}
          ref={ref}
        >
          <Grid singleRow columnGap={0} flexWrap="nowrap">
            {children}
          </Grid>
        </View>
      </ThemeProvider>
    </Portal>
  )
}

export default HoveringToolbar
