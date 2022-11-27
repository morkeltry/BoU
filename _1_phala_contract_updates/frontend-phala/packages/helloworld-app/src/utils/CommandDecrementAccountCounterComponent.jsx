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

const CommandDecrementAccountCounterComponent = () => {
  const { state: decAcc, bindings: decAccBindings } = useInput('1'); 

  const decrementAccountCounterCommandPayload = useMemo(() => {
    const num = parseInt(decAcc)
    if (isNaN(num) || decAcc <= 0) {
      return undefined
    } else {
      return {
        DecrementAccountCounter: {
          value: num
        }
      }
    }
  }, [decAcc])

  return (
    <section>
      <h3>Decrement Account Counter comp</h3>
      <div>
        <Input label="By" {...decAccBindings} />
      </div>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={decrementAccountCounterCommandPayload}
            // display messages
            modalTitle='Decrement Account Counter for HelloWorld (MnuChain).'
            modalSubtitle={`Decrement the account counter by ${decAcc}`}
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

export default observer(CommandDecrementAccountCounterComponent)

