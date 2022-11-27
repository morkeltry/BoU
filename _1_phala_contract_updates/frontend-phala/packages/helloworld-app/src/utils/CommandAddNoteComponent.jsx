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

const CommandAddNoteComponent = () => {
  const { state: addNote, bindings: addNoteBindings } = useInput('');

  const addNoteCommandPayload = useMemo(() => {
    return {
      AddNote: {
          value: addNote
      }
    }
  }, [addNote])
  
  return (
    <section>
      <h3>Add Note comp</h3>
      <div>
        <Input label="By" {...addNoteBindings} />
      </div>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={addNoteCommandPayload}
            // display messages
            modalTitle='HelloWorld.AddNote()'
            modalSubtitle={`Add a / update the note: ${addNote}`}
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

export default observer(CommandAddNoteComponent)

