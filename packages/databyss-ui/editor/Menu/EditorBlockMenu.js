import React, { useEffect } from 'react'
import { useSelected } from 'slate-react'

import buttons, {
  editorMarginMenuItemHeight,
} from '@databyss-org/ui/theming/buttons'
import { View, Button, Icon, Grid } from '@databyss-org/ui/primitives'
import { createEditor, Transforms, Editor, Node } from 'slate'
import Close from '@databyss-org/ui/assets/close-menu.svg'
import Add from '@databyss-org/ui/assets/add.svg'
import EditorBlockMenuActions from './EditorBlockMenuActions'
import { useEditorContext } from '../EditorProvider'
import { startTag, onShowMenuActions } from '../state/page/actions'

const EditorBlockMenu = ({ showButton }) => {
  let showMenuActions = false

  const { buttonVariants } = buttons

  const onShowActions = () => {
    console.log('show actions')
  }

  const onMenuAction = (tag, e) => {
    //   // issue with https://www.notion.so/databyss/Demo-error-7-If-you-click-location-and-press-return-it-doesn-t-move-the-cursor-but-it-makes-everyth-9eaa6b3f02c04358b42f00159863a355
    console.log('click on', tag)
  }

  useEffect(
    () => {
      if (showMenuActions) {
        //  hideCursor(true)
      } else {
        // hideCursor(false)
      }
    },
    []
    // [showMenuActions]
  )

  const menuActions = [
    {
      action: 'SOURCE',
      label: '@ source',
    },
    {
      action: 'TOPIC',
      label: '# topic',
    },
    {
      action: 'LOCATION',
      label: 'location',
    },
  ]

  const menuActionButtons = menuActions.map((a, i) => (
    <Button
      variant="editorMarginMenuItem"
      data-test-block-menu={a.action}
      key={i}
      onMouseDown={e => onMenuAction(a.action, e)}
    >
      {a.label}
    </Button>
  ))

  return showButton ? (
    <Grid singleRow columnGap="small" position="absolute">
      <View
        height={editorMarginMenuItemHeight}
        width={editorMarginMenuItemHeight}
        justifyContent="center"
      >
        <Button
          variant="editorMarginMenu"
          onClick={onShowActions}
          data-test-block-menu="open"
        >
          <Icon
            sizeVariant="tiny"
            color={buttonVariants.editorMarginMenu.color}
          >
            <View>{showMenuActions ? <Close /> : <Add />}</View>
          </Icon>
        </Button>
      </View>
      <View justifyContent="center" height={editorMarginMenuItemHeight}>
        {showMenuActions && (
          <EditorBlockMenuActions
            unmount={
              () => null
              //   dispatchEditor(onShowMenuActions(false, editableState))
            }
            menuActionButtons={menuActionButtons}
          />
        )}
      </View>
    </Grid>
  ) : null
}

export default EditorBlockMenu
