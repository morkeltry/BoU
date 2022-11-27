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

const CommandAddAccountNoteComponent = () => {
  const { state: addNoteAcc, bindings: addNoteAccBindings } = useInput('');

  const addNoteAccountCommandPayload = useMemo(() => {
    return {
      AddAccountNote: {
          value: addNoteAcc
      }
    }
  }, [addNoteAcc])
  
  return (
    <section>
      <h3>Add Account Note comp</h3>
      <div>
        <Input label="By" {...addNoteAccBindings} />
      </div>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={addNoteAccountCommandPayload}
            // display messages
            modalTitle='HelloWorld.AddAccountNote()'
            modalSubtitle={`Add a / update the note: ${addNoteAcc}`}
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

export default observer(CommandAddAccountNoteComponent)

