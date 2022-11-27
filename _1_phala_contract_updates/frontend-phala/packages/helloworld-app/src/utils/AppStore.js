import { types, flow } from 'mobx-state-tree'

export const CONTRACT_HELLOWORLD = 5;

export const createHelloWorldAppStore = (defaultValue = {}, options = {}) => {
  const HelloWorldAppStore = types
    .model('HelloWorldAppStore', {
      counter: types.maybeNull(types.number),
      note: types.maybeNull(types.string),
      accountCounter: types.maybeNull(types.number),
      accountNote: types.maybeNull(types.string)
    })
    .actions(self => ({
      setCounter (num) {
        self.counter = num
      },
      setNote (str) {
        self.note = str
      },
      setAccountCounter (num) {
        self.accountCounter = num
      },
      setAccountNote (str) {
        self.accountNote = str
      },
      async queryCounter (runtime) {
        return await runtime.query(CONTRACT_HELLOWORLD, 'GetCounter')
      },
      async queryNote (runtime) {
        return await runtime.query(CONTRACT_HELLOWORLD, 'GetNote')
      },
      async queryAccountCounter (runtime) {
        return await runtime.query(CONTRACT_HELLOWORLD, 'GetAccountCounter')
      },
      async queryAccountNote (runtime) {
        return await runtime.query(CONTRACT_HELLOWORLD, 'GetAccountNote')
      }
    }))

  return HelloWorldAppStore.create(defaultValue)
}

