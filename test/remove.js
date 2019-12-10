const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('removes react-native-firebase', async t => {
  const removeModule = sinon.spy()
  const ask = (question) => ({ [question.name]: [] })
  const confirm = sinon.spy()
  const info = sinon.spy()
  const warning = sinon.spy()
  const success = sinon.spy()

  const context = {
    ignite: { removeModule },
    parameters: { options: {} },
    prompt: { ask, confirm },
    print: { info, warning, success },
  }

  await plugin.remove(context)

  t.true(removeModule.calledWith('react-native-firebase', { unlink: false }))
})
