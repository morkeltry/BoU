import { observer } from 'mobx-react'
import { Button, useToasts } from '@zeit-ui/react'
import { useStore } from "@/store"

const QueryCounterComponent = () => {
  const { appRuntime, helloworldApp } = useStore();
  const [, setToast] = useToasts();

  async function updateCounter () {
    if (!helloworldApp) return
    try {
      const response = await helloworldApp.queryCounter(appRuntime)
      console.log('Response::GetCounter', response);
      helloworldApp.setCounter(response.GetCounter.counter)
    } catch (err) {
      setToast(err.message, 'error')
    }
  }
  
  return (
    <section>
      <h3>Counter</h3>
      <div>Counter: {helloworldApp.counter === null ? 'unknown' : helloworldApp.counter}</div>
      <div><Button onClick={updateCounter}>Update</Button></div>
    </section>
  )
}

export default observer(QueryCounterComponent)
