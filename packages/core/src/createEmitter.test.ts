import { expect, test, mock } from 'bun:test'

import type { ConnectorEventMap } from './connectors/connector'
import { createEmitter } from './createEmitter.js'
import { uid } from './utils/uid'

test('default', () => {
  const emitter = createEmitter<ConnectorEventMap>(uid())

  const onMessage = mock(() => {});
  emitter.on('message', onMessage)
  emitter.emit('message', { type: 'bar', data: 'baz' })

  expect(onMessage).toHaveBeenCalledWith({
    type: 'bar',
    data: 'baz',
    uid: emitter.uid,
  })
})