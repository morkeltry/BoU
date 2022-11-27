import { observer } from 'mobx-react'
import { Button, useToasts } from '@zeit-ui/react'
import { useStore } from "@/store"

const QueryAccountCounterComponent = () => {
  const { appRuntime, helloworldApp } = useStore();
  const [, setToast] = useToasts();

  async function updateAccountCounter () {
    if (!helloworldApp)
      return
    try {
      const response = await helloworldApp.queryAccountCounter(appRuntime)
      console.log('Response::GetAccountCounter', response);
      if (response=='AccountHasNoDetails'){
        helloworldApp.setAccountCounter(0)
      } else {
        helloworldApp.setAccountCounter(response.GetAccountCounter.counter)
      }
    } catch (err) {
      setToast(err.message, 'error')
    }
  }

  return (
    <section>  
      <h3>Account Counter</h3>
      <div>Counter: {helloworldApp.accountCounter === null ? 'unknown' : helloworldApp.accountCounter}</div>
      <div><Button onClick={updateAccountCounter}>Update Account</Button></div>
    </section>
  )
}

export default observer(QueryAccountCounterComponent)

