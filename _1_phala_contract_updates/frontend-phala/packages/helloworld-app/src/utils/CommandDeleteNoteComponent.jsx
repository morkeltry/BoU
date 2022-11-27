import { useMemo } from 'react'
import styled from "styled-components"
import { observer } from 'mobx-react'
import { Input, useInput } from '@zeit-ui/react'
import { Plus as PlusIcon } from '@zeit-ui/react-icons'

import PushCommandButton from '@/components/PushCommandButton'

import { CONTRACT_HELLOWORLD } from './AppStore'

const ButtonWrapper = styled.div`
  margin-top: 5px;
  width: 200px;
`;

const CommandDeleteNoteComponent = () => {
  const { state: delNote, bindings: delNoteBindings } = useInput('');

  const deleteNoteCommandPayload = useMemo(() => {
    return {
      DeleteNote: {}
    }
  }, [delNote])

  return (
    <section>
      <h3>Delete Note comp</h3>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={deleteNoteCommandPayload}
            // display messages
            modalTitle='HelloWorld.DeleteNote()'
            modalSubtitle={`Delete the note`}
            onSuccessMsg='Tx succeeded'
            // button appearance
            buttonType='secondaryLight'
            icon={PlusIcon}
            name='Send'
          />
      </ButtonWrapper>
    </section>
  )
}

export default observer(CommandDeleteNoteComponent)

