import React, { createContext, useContext } from 'react'
import createReducer from '@databyss-org/services/lib/createReducer'
import {
  onSetActiveBlockId,
  onSetOffset,
  onCharPress,
  onArrowKeyPress,
} from './state/page/actions'

export pageReducer from './state/page/reducer'
export lineReducer from './state/line/reducer'

const useReducer = createReducer()

export const EditorContext = createContext()

export const makeComposedReducer = (reducer, editableReducer) => (
  state,
  action
) => ({
  ...reducer(state, action),
  editableState: editableReducer(
    {
      ...(action.payload.editableState || state.editableState),
      blocks: state.blocks,
    },
    action
  ),
})

const EditorProvider = ({ children, initialState, reducer }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setActiveBlockId = id => {
    dispatch(onSetActiveBlockId(id))
  }

  const setOffset = offset => {
    dispatch(onSetOffset(offset))
  }

  const characterKeyPress = char => {
    dispatch(onCharPress(char))
  }

  const arrowKeyPress = key => {
    dispatch(onArrowKeyPress(key))
  }

  return (
    <EditorContext.Provider
      value={{
        state,
        setActiveBlockId,
        setOffset,
        characterKeyPress,
        arrowKeyPress,
      }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export const useEditorContext = () => useContext(EditorContext)

export default EditorProvider
