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

const CommandIncrementCounterComponent = () => {
  const { state: inc, bindings: incBindings } = useInput('1');

  const incrementCounterCommandPayload = useMemo(() => {
    const num = parseInt(inc)
    if (isNaN(num) || inc <= 0) {
      return undefined
    } else {
      return {
        IncrementCounter: {
          value: num
        }
      }
    }
  }, [inc])
  
  return (
    <section>
      <h3>Increment Counter comp</h3>
      <div>
        <Input label="By" {...incBindings} />
      </div>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={incrementCounterCommandPayload}
            // display messages
            modalTitle='Increment The Hello World (MnuChain) Counter'
            modalSubtitle={`Increment the counter by ${inc}`}
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

export default observer(CommandIncrementCounterComponent)

