import { observer } from 'mobx-react'
import { Spacer } from '@zeit-ui/react'
import Container from '@/components/Container'
import PRuntimeDisplay from './utils/PRuntimeDisplay'
import QueryCounterComponent from './utils/QueryCounterComponent'
import QueryNoteComponent from './utils/QueryNoteComponent'
import QueryAccountCounterComponent from './utils/QueryAccountCounterComponent'
import QueryAccountNoteComponent from './utils/QueryAccountNoteComponent'
import CommandIncrementCounterComponent from './utils/CommandIncrementCounterComponent'
import CommandDecrementCounterComponent from './utils/CommandDecrementCounterComponent'
import CommandIncrementAccountCounterComponent from './utils/CommandIncrementAccountCounterComponent'
import CommandDecrementAccountCounterComponent from './utils/CommandDecrementAccountCounterComponent'
import CommandAddNoteComponent from './utils/CommandAddNoteComponent'
import CommandDeleteNoteComponent from './utils/CommandDeleteNoteComponent'
import CommandAddAccountNoteComponent from './utils/CommandAddAccountNoteComponent'
import CommandDeleteAccountNoteComponent from './utils/CommandDeleteAccountNoteComponent'

import UnlockRequired from '@/components/accounts/UnlockRequired'
import StoreInjector from './utils/StoreInjector'

const AppBody = observer(() => {
  return (
    <>
      <Container>
        <h1>MnuChain (HelloWorld)!</h1>
      </Container>
      <Container>
        <Spacer y={1}/>
        <PRuntimeDisplay />
        <Spacer y={1}/>
        <QueryCounterComponent />
        <Spacer y={1}/>
        <QueryNoteComponent />
        <Spacer y={1}/>
        <QueryAccountCounterComponent />
        <Spacer y={1}/>
        <QueryAccountNoteComponent />
        <Spacer y={1}/>
        <CommandIncrementCounterComponent />
        <Spacer y={1}/>
        <CommandDecrementCounterComponent />
        <Spacer y={1}/>
        <CommandIncrementAccountCounterComponent />
        <Spacer y={1}/>
        <CommandDecrementAccountCounterComponent />
        <Spacer y={1}/>
        <CommandAddNoteComponent />
        <Spacer y={1}/>
        <CommandDeleteNoteComponent />
        <Spacer y={1}/>
        <CommandAddAccountNoteComponent />
        <Spacer y={1}/>
        <CommandDeleteAccountNoteComponent />
        <Spacer y={1}/>
      </Container>
    </>
  )
})

export default () => (
  <UnlockRequired>
    <StoreInjector>
      <AppBody />
    </StoreInjector>
  </UnlockRequired>
)
