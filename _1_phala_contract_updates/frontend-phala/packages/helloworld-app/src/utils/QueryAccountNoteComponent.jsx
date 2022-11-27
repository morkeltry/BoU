import { observer } from 'mobx-react'
import { Button, useToasts } from '@zeit-ui/react'
import { useStore } from "@/store"

const QueryAccountNoteComponent = () => {
  const { appRuntime, helloworldApp } = useStore();
  const [, setToast] = useToasts();

  async function updateAccountNote () {
    if (!helloworldApp)
      return
    try {
      const response = await helloworldApp.queryAccountNote(appRuntime)
      console.log('Response::GetAccountNote', response);
      if (response=='AccountHasNoDetails'){
        helloworldApp.setAccountNote('')
      } else {
        helloworldApp.setAccountNote(response.GetAccountNote.note)
      }
    } catch (err) {
      setToast(err.message, 'error')
    }
  }

  return (
    <section>
      <h3>Account Note</h3>
      <div>Note: {helloworldApp.accountNote === null ? 'unknown' : helloworldApp.accountNote}</div>
      <div><Button onClick={updateAccountNote}>Update</Button></div>
    </section>
  )
}

export default observer(QueryAccountNoteComponent)

