// import React, { useState, useEffect } from 'react'
// import css from '@styled-system/css'
// import { isMobileOs } from '@databyss-org/ui/'
// import { Text, View, Grid } from '@databyss-org/ui/primitives'
// import { editorMarginMenuItemHeight } from '@databyss-org/ui/theming/buttons'
// import { pxUnits } from '@databyss-org/ui/theming/views'
// import { useEditorContext } from '@databyss-org/ui/editor/EditorProvider'
// import { newBlockMenu } from '@databyss-org/ui/editor/state/page/actions'
// import EditorBlockMenu from './Menu/EditorBlockMenu'
// import { hasSelection } from './slate/slateUtils'

// const TextBlock = ({ children, variant, color }) => (
//   <Text variant={variant} color={color}>
//     {children}
//   </Text>
// )

// const textSelector = ({ children, type }) => {
//   const textStyle = type =>
//     ({
//       SOURCE: { variant: 'bodyHeaderUnderline', color: 'text.0' },
//       // WRAP INLINE IN VIEW WITH BOTTOM BORDER
//       // TRY CHANGE DISLAY TO INLINE FLEX
//       LOCATION: {
//         variant: 'bodyNormal',
//         color: 'text.0',
//         children: (
//           <View
//             borderBottomWidth={pxUnits(1)}
//             borderStyle="dashed"
//             borderColor="text.4"
//             display="inline"
//             borderRadius={0}
//           >
//             {children}
//           </View>
//         ),
//       },
//       TOPIC: {
//         variant: 'bodyHeader',
//         color: 'text.0',
//       },
//       TAG: { variant: 'BodySmall', color: 'grey' },
//       ENTRY: { variant: 'bodyNormal', color: 'text.0' },
//       TEXT: { variant: 'bodyNormal', color: 'text.0' },
//     }[type])
//   return TextBlock({ children, ...textStyle(type) })
// }

// export const EditorBlock = ({ children, node }) => {
//   const [menuActive, setMenuActive] = useState(false)

//   const [editorState, dispatchEditor] = useEditorContext()
//   const { editableState, showNewBlockMenu, activeBlockId } = editorState

//   useEffect(
//     () => {
//       if (editableState) {
//         // disable '+' when editor has selection
//         if (hasSelection(editableState.value) && showNewBlockMenu) {
//           dispatchEditor(newBlockMenu(false))
//           return
//         }
//         if (
//           !hasSelection(editableState.value) &&
//           activeBlockId === node.key &&
//           node.text.length === 0 &&
//           !showNewBlockMenu
//         ) {
//           dispatchEditor(newBlockMenu(true))
//         }
//         if (
//           showNewBlockMenu &&
//           activeBlockId === node.key &&
//           node.text.length !== 0
//         ) {
//           dispatchEditor(newBlockMenu(false))
//         }
//       }
//     },
//     [node.text, activeBlockId]
//   )

//   const _children = (
//     <View
//       flexShrink={1}
//       overflow="visible"
//       justifyContent="center"
//       css={css({
//         caretColor: menuActive && node.text.length === 0 && 'transparent',
//       })}
//     >
//       {textSelector({ children, type: node.type })}
//     </View>
//   )

//   return !isMobileOs() ? (
//     <Grid singleRow mb="tiny" flexWrap="nowrap" columnGap="small">
//       <View
//         contentEditable="false"
//         suppressContentEditableWarning
//         css={{ userSelect: 'none' }}
//         width={editorMarginMenuItemHeight}
//         height={editorMarginMenuItemHeight}
//         overflow="visible"
//       >
//         {showNewBlockMenu && (
//           <EditorBlockMenu
//             hideCursor={bool => setMenuActive(bool)}
//             node={node}
//           />
//         )}
//       </View>
//       {_children}
//     </Grid>
//   ) : (
//     <View mb="tiny">{_children}</View>
//   )
// }

// export const renderBlock = ({ node, children }) => (
//   <EditorBlock node={node}>{children}</EditorBlock>
// )

import { RawHtml, Text, Button, Icon } from '@databyss-org/ui/primitives'
import fonts from '@databyss-org/ui/theming/fonts'
import styled from '@emotion/styled'
import { color, border, space, typography } from 'styled-system'
import PenSVG from '@databyss-org/ui/assets/pen.svg'

import { isAtomicInlineType } from './slate/slateUtils'
import { useSelected } from 'slate-react'

const Span = styled('span')(
  // { cursor: 'pointer' },
  color,
  border,
  space,
  typography
)

export const getAtomicStyle = type =>
  ({ SOURCE: 'bodyHeaderUnderline', TOPIC: 'bodyHeader' }[type])

export const Element = ({ attributes, children, element }) => {
  let isSelected = false

  if (isAtomicInlineType(element.type)) {
    isSelected = useSelected()
  }

  const onClick = () => {
    console.log('LAUNCH MODAL')
  }

  const _Element = () => {
    return (
      <Span>
        {isAtomicInlineType(element.type) ? (
          <Span
            flexWrap="nowrap"
            display="inline-block"
            contentEditable="false"
            suppressContentEditableWarning
            css={{ userSelect: 'none', cursor: 'pointer' }}
            overflow="visible"
            borderRadius={5}
            onMouseDown={onClick}
            fontSize={fonts.textVariants.bodyHeader.fontSize}
            p="tiny"
            pr="0"
            ml="tinyNegative"
            backgroundColor={isSelected ? 'background.3' : ''}
          >
            <Text
              display="inline"
              variant={getAtomicStyle(element.type)}
              type="p"
            >
              <RawHtml _html={{ __html: element.character }} {...attributes} />
            </Text>
            {children}
            {isSelected && (
              <Span
                borderLeft="1px solid"
                borderColor="background.4"
                ml="10px"
                padding="1px"
              >
                <Button variant="editSource" data-test-atomic-edit="open">
                  <Icon sizeVariant="tiny" color="background.5">
                    <PenSVG />
                  </Icon>
                </Button>
              </Span>
            )}
          </Span>
        ) : (
          <p {...attributes}>{children}</p>
        )}
      </Span>
    )
  }

  return _Element(element.character, children, element.type)
}
