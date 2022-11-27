import { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'
import { useStore } from "@/store"
import { createHelloWorldAppStore } from './AppStore'

const StoreInjector = ({ children }) => {
  const appStore = useStore()
  const [shouldRenderContent, setShouldRenderContent] = useState(false)

  useEffect(() => {
  
    if (!appStore || !appStore.appRuntime)
      return

    if (typeof appStore.helloworldApp !== 'undefined')
      return

    appStore.helloworldApp = createHelloWorldAppStore({})
  }, [appStore])

  useEffect(() => reaction(
    () => appStore.helloworldApp,
    () => {
      if (appStore.helloworldApp && !shouldRenderContent) {
        setShouldRenderContent(true)
      }
    },
    { fireImmediately: true })
  )

  return shouldRenderContent && children;
}

export default observer(StoreInjector)

