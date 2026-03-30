import { interpret } from '@bemedev/app-ts';
import { machine } from './machine.machine';

export const service = interpret(machine, {
  context: {
    autosave: true,
    decks: [],
    dirty: false,
    internet: false,
    notfications: {
      auth: {
        token: 'notExists',
        session: false,
        login: false,
        registration: false,
        deleteToken: false,
      },
      save: {
        local: false,
        online: false,
      },
    },
  },
  pContext: {},
});
