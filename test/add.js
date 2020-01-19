const test = require('ava')
const sinon = require('sinon')
const plugin = require('../plugin')

test('adds react-native-firebase', async t => {
  // spy on few things so we know they're called
  const addModule = sinon.spy()
  const ask = (question) => ({ [question.name]: [] })
  const confirm = sinon.spy()
  const info = sinon.spy()
  const warning = sinon.spy()
  const success = sinon.spy()
  const run = sinon.spy()

  // mock a context
  const context = {
    ignite: { addModule },
    parameters: { options: {} },
    prompt: { ask, confirm },
    print: { info, warning, success },
    system: { run },
  }

  await plugin.add(context)

  t.true(addModule.calledWith('react-native-firebase', { link: false, version: '~6.2.0' }))
})
