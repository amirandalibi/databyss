import React, { useState } from 'react'
import { useSourceContext } from '@databyss-org/services/sources/SourceProvider'
import { ModalWindow } from '@databyss-org/ui/primitives'
import SourcesValueList from './SourcesValueList'
import { useNavigationContext } from '@databyss-org/ui/components/Navigation/NavigationProvider/NavigationProvider'
import { hideModal } from '@databyss-org/ui/components/Navigation/NavigationProvider/actions'

const SourceModal = ({ sourceId, visible, onUpdateSource }) => {
  const [, setSource] = useSourceContext()
  const [values, setValues] = useState(null)
  const [, dispatchNav] = useNavigationContext()

  const onChange = _values => {
    // update internal state
    setValues(_values)
    // if (values) {
    //   // updates in source provider
    //   setSource(_values)
    // }
  }

  const onDismiss = () => {
    if (values) {
      // updates in source provider
      setSource(values)
    }
    // hide modal in navProvider
    dispatchNav(hideModal())
    // update to editor provider
    onUpdateSource(values)
  }

  return (
    <ModalWindow
      visible={visible}
      onDismiss={onDismiss}
      title="Edit Source"
      dismissChild="done"
      onModalOpen={() => console.log('on open')}
    >
      <SourcesValueList onValueChange={onChange} sourceId={sourceId} />
    </ModalWindow>
  )
}

export default SourceModal
