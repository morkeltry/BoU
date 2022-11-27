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

const CommandIncrementAccountCounterComponent = () => {
  const { state: incAcc, bindings: incAccBindings } = useInput('1');

  const incrementAccountCounterCommandPayload = useMemo(() => {
    const num = parseInt(incAcc)
    if (isNaN(num) || incAcc <= 0) {
      return undefined
    } else {
      return {
        IncrementAccountCounter: {
          value: num
        }
      }
    }
  }, [incAcc])

  return (
    <section>
      <h3>Increment Account Counter comp</h3>
      <div>
        <Input label="By" {...incAccBindings} />
      </div>
      <ButtonWrapper>
        <PushCommandButton
            // tx arguments
            contractId={CONTRACT_HELLOWORLD}
            payload={incrementAccountCounterCommandPayload}
            // display messages
            modalTitle='HelloWorld.IncrementAccountCounter()'
            modalSubtitle={`Increment the account counter by ${incAcc}`}
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

export default observer(CommandIncrementAccountCounterComponent)

