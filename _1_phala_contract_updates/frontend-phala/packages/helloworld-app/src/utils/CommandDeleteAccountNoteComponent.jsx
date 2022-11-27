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

const CommandDeleteAccountNoteComponent = () => {
  const { state: delNoteAcc, bindings: delNoteAccBindings } = useInput('');  
  
  const deleteNoteAccountCommandPayload = useMemo(() => {
    return {
      DeleteAccountNote: {}
    }
  }, [delNoteAcc])

  return (
    <section>
      <h3>Delete Account Note comp</h3>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={deleteNoteAccountCommandPayload}
            // display messages
            modalTitle='HelloWorld.DeleteAccountNote()'
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

export default observer(CommandDeleteAccountNoteComponent)
