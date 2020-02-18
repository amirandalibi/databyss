import React from 'react'
import { Button, Text, View } from '@databyss-org/ui/primitives'
import { isMobileOs } from '@databyss-org/ui/'
import { pxUnits } from '@databyss-org/ui/theming/views'
import { toggleMark, startTag } from '../state/page/actions'
import HoveringToolbar from './../HoveringToolbar'
import { useSlate } from 'slate-react'
import { Editor } from 'slate'

const mobileActions = [
  {
    type: 'SOURCE',
    label: '+ source',
    variant: 'uiTextNormal',
    action: a => console.log(a),
  },
  {
    type: 'TOPIC',
    label: '+ topic',
    variant: 'uiTextNormal',
    action: a => console.log(a),
  },
  {
    type: 'LOCATION',
    label: '+ location',
    variant: 'uiTextNormal',
    action: a => console.log(a),
  },
]

const desktopActions = [
  {
    type: 'location',
    label: 'loc',
    variant: 'uiTextNormal',
    action: a => toggleMark(a),
  },
]

const formatActions = isMobileNewLine => [
  ...(isMobileOs() && isMobileNewLine ? mobileActions : desktopActions),
  {
    type: 'DIVIDER',
  },
  {
    type: 'bold',
    label: 'b',
    variant: 'uiTextNormalSemibold',
    action: a => toggleMark(a),
  },
  {
    type: 'italic',
    label: 'i',
    variant: 'uiTextNormalItalic',
    action: a => toggleMark(a),
  },
]

const formatActionButtons = () =>
  // editor.value.anchorBlock
  true
    ? //TODO: ASK ABOUT THIS COMMENT
      formatActions(true).reduce(
        //(!editor.value.anchorBlock.text.length).reduce(
        (acc, a, i) => {
          if (a.type === 'DIVIDER') {
            return acc.concat(
              <View
                key={i}
                borderRightColor="border.1"
                borderRightWidth={pxUnits(1)}
                marginLeft="extraSmall"
                marginRight="extraSmall"
              />
            )
          }
          return acc.concat(
            <MarkButton
              key={i}
              index={i}
              type={a.type}
              label={a.label}
              variant={a.variant}
              action={a.action}
            />
          )
        },
        []
      )
    : []

const isFormatActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => n[format] === true,
    mode: 'all',
  })
  return !!match
}

const MarkButton = ({ type, label, variant, action, ...others }) => {
  const editor = useSlate()
  console.log('type', type)
  const isActive = isFormatActive(editor, type)

  return (
    <Button
      data-test-format-menu={type}
      variant="formatButton"
      onMouseDown={e => {
        e.preventDefault()
        console.log('dispatch action', type)
      }}
      {...others}
    >
      <Text
        variant={variant}
        pr="extraSmall"
        pl="extraSmall"
        color={isActive ? 'primary.1' : 'text.1'}
      >
        {label}
      </Text>
    </Button>
  )
}

const FormatMenu = () => (
  <HoveringToolbar>{formatActionButtons()}</HoveringToolbar>
)

export default FormatMenu
