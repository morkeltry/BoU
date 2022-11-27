import { observer } from 'mobx-react'
import { Button, useToasts } from '@zeit-ui/react'
import { useStore } from "@/store"

const QueryNoteComponent = () => {
  const { appRuntime, helloworldApp } = useStore();
  const [, setToast] = useToasts();

  async function updateNote () {
    if (!helloworldApp)
      return
    try {
      const response = await helloworldApp.queryNote(appRuntime)
      console.log('Response::GetNote', response);
      helloworldApp.setNote(response.GetNote.note)
    } catch (err) {
      setToast(err.message, 'error')
    }
  }
  
  return (
    <section>
      <h3>Note</h3>    
      <div>Note: {helloworldApp.note === null ? 'unknown' : helloworldApp.note}</div>
      <div><Button onClick={updateNote}>Update</Button></div>
    </section>
  )
}

export default observer(QueryNoteComponent)
