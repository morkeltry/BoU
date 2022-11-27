import { observer } from 'mobx-react'
import { useStore } from "@/store"

const PRuntimeDisplay = () => {
  const { appRuntime } = useStore(); 

  return (
    <section>
      <div>PRuntime: {appRuntime ? 'yes' : 'no'}</div>
      <div>PRuntime ping: {appRuntime.latency || '+∞'}</div>
      <div>PRuntime connected: {appRuntime?.channelReady ? 'yes' : 'no'}</div>
    </section>
  )
}

export default observer(PRuntimeDisplay)
