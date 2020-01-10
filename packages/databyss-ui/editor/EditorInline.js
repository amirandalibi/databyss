import React, { useState, useEffect } from 'react'
import { color, border, space } from 'styled-system'
import styled from '@emotion/styled'
import { Button, Icon } from '@databyss-org/ui/primitives'
import PenSVG from '@databyss-org/ui/assets/pen.svg'
import { useEditorContext } from './EditorProvider'

const Span = styled('span')({ cursor: 'pointer' }, color, border, space)

const EditorInline = React.forwardRef(
  ({ isSelected, node, children, editor, onEditSource, ...others }, ref) => {
    const [refId, setRefId] = useState(null)

    const [editorState] = useEditorContext()
    const { blocks } = editorState

    const backgroundColor = isSelected ? 'background.3' : ''

    useEffect(
      () => {
        if (editor && !refId) {
          // sets initial refId
          const _id = editor.value.document.getClosestBlock(node.key).key
          // get refId
          if (blocks[_id]) {
            const _refId = blocks[_id].refId
            setRefId(_refId)
          }
        }
      },
      [node, editor]
    )

    const onClick = () => {
      if (node.type === 'SOURCE' && isSelected) {
        onEditSource(refId, { value: editor.value })
      }
    }

    return (
      <Span
        {...others}
        onMouseDown={onClick}
        ref={ref}
        borderRadius={5}
        p="tiny"
        backgroundColor={backgroundColor}
      >
        {children}

        {node.type === 'SOURCE' &&
          isSelected && (
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
    )
  }
)

export default EditorInline
