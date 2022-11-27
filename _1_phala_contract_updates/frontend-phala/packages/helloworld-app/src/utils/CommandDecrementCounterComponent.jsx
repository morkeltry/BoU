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

const CommandDecrementCounterComponent = () => {
  const { state: dec, bindings: decBindings } = useInput('1');

  const decrementCounterCommandPayload = useMemo(() => {
    const num = parseInt(dec)
    if (isNaN(num) || dec <= 0) {
      return undefined
    } else {
      return {
        DecrementCounter: {
          value: num
        }
      }
    }
  }, [dec])

  return (      
    <section>
      <h3>Decrement Counter comp</h3>
      <div>
        <Input label="By" {...decBindings} />
      </div>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={decrementCounterCommandPayload}
            // display messages
            modalTitle='Decrement the HelloWorld (MnuChai) Counter()'
            modalSubtitle={`Increment the counter by ${dec}`}
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

export default observer(CommandDecrementCounterComponent)

