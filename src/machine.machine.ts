import { createMachine, typings } from '@bemedev/app-ts';
import { SCHEMAS } from './machine.machine.gen';
import { Deck } from './schemas';
import { NO_INTERNET_ERROR } from './machine.errors';

/**
 * TODO:
 */
const userInfos = typings.any({});

export const machine = createMachine(
  {
    __tsSchema: SCHEMAS.machine.__tsSchema,
    initial: 'idle',
    states: {
      idle: {
        on: { START: '/preparing' },
      },

      preparing: {
        initial: 'internet',
        states: {
          internet: {
            actors: {
              internet: {
                then: {
                  actions: ['notifyInternetSuccess'],
                  target: '/preparing/authentication',
                },
                catch: {
                  actions: ['notifyInternetFailure'],
                  target: '/preparing/authentication',
                },
              },
            },
          },
          authentication: {
            initial: 'token',
            states: {
              token: {
                actors: {
                  authenticateByToken: {
                    then: {
                      actions: ['notifyAuthTokenSuccess'],
                      target: '/preparing/authentication/session',
                    },
                    description:
                      'Try to authenticate the user by a previously saved token. If expiration date is not reached, the user is authenticated and can directly access the app. Otherwise, the token is deleted and the user is redirected to the login/registration page.',
                    catch: [
                      {
                        guards: 'tokenExpired',
                        actions: ['notifyAuthTokenExpired'],
                        target: '/preparing/authentication/deleteToken',
                      },
                      {
                        actions: ['notifyAuthTokenNotExists'],
                        target: '/preparing/authentication/authentication',
                      },
                    ],
                  },
                },
              },

              deleteToken: {
                description: 'Delete the expired token from the storage.',
                actors: {
                  deleteToken: {
                    then: {
                      actions: ['notifyDeleteTokenSuccess'],
                      target: '/preparing/authentication/authentication',
                    },
                    catch: {
                      actions: ['notifyDeleteTokenFailure'],
                      target: '/preparing/authentication/authentication',
                    },
                  },
                },
              },

              session: {
                actors: {
                  stockSession: {
                    then: {
                      actions: ['notifySessionSuccess'],
                      target: '/working',
                    },
                    catch: {
                      actions: ['notifySessionFailure'],
                      target: '/preparing/authentication/authentication',
                    },
                  },
                },
              },

              authentication: {
                initial: 'idle',
                states: {
                  idle: {
                    on: {
                      LOGIN:
                        '/preparing/authentication/authentication/login',
                      REGISTER:
                        '/preparing/authentication/authentication/registration',
                    },
                  },
                  login: {
                    actors: {
                      login: {
                        then: {
                          actions: [
                            'assignUserID',
                            'assignSessionToken',
                            'assignUserInfos',
                            'notifyLoginSuccess',
                          ],
                          target: '/preparing/authentication/session',
                        },
                        catch: {
                          actions: ['notifyLoginFailure'],
                          target:
                            '/preparing/authentication/authentication/idle',
                        },
                      },
                    },
                  },
                  registration: {
                    actors: {
                      register: {
                        then: {
                          actions: [
                            'assignUserID',
                            'assignSessionToken',
                            'assignUserInfos',
                            'notifyRegistrationSuccess',
                          ],
                          target: '/preparing/authentication/session',
                        },
                        catch: {
                          actions: ['notifyRegistrationFailure'],
                          target:
                            '/preparing/authentication/authentication/idle',
                        },
                      },
                    },
                  },
                  error: {},
                },
              },
            },
          },
        },
      },

      working: {
        initial: 'idle',

        states: {
          idle: {
            always: [
              {
                guards: 'autosave',
                target: '/working/autosave',
              },
              '/working/save',
            ],
          },

          save: {
            on: {
              SAVE: {
                target: '/working/saving',
                description: 'save the current work',
              },
            },
          },

          autosave: {
            description:
              'Automatically save the user work at regular intervals. This state is entered from the idle state after a certain delay without activity, and is exited when the user starts interacting with the app again.',
            on: {
              SAVE: {
                target: '/working/saving',
                description: 'save the current work',
              },
            },
            after: {
              AUTO_SAVE_DELAY: {
                guards: 'isDirty',
                description:
                  'Automatically save the user work at regular intervals. This state is entered from the idle state after a certain delay without activity, and is exited when the user starts interacting with the app again.',
                target: '/working/saving',
              },
            },
          },
          saving: {
            initial: 'local',
            states: {
              local: {
                actors: {
                  saveLocal: {
                    then: {
                      target: '/working/saving/internet',
                      actions: ['notifySaveLocalSuccess', 'cleanData'],
                    },
                    catch: {
                      target: '/working/idle',
                      actions: ['notifySaveLocalFailure'],
                    },
                  },
                },
              },
              internet: {
                actors: {
                  internet: {
                    then: {
                      actions: ['notifyInternetSuccess'],
                      target: '/working/saving/online',
                    },
                    catch: {
                      actions: ['notifyInternetFailure'],
                      target: '/working/idle',
                    },
                  },
                },
              },
              online: {
                actors: {
                  saveOnline: {
                    then: {
                      target: '/working/idle',
                      actions: ['notifySaveOnlineSuccess'],
                    },
                    catch: {
                      target: '/working/idle',
                      actions: ['notifySaveOnlineFailure'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  typings({
    eventsMap: {
      SAVE: 'primitive',
      START: 'primitive',
      LOGIN: 'primitive', //TODO: add all authentication methods
      REGISTER: 'primitive', //TODO: add all authentication methods
    },
    context: {
      internet: 'boolean',
      autosave: 'boolean',
      dirty: 'boolean',
      userID: typings.optional('string'),
      userInfos: typings.optional(userInfos),
      currentDeckId: typings.optional('string'),
      decks: typings.array(typings.custom<Deck>()),
      notfications: {
        auth: {
          token: typings.litterals('valid', 'expired', 'notExists'),
          session: 'boolean',
          login: 'boolean',
          registration: 'boolean',
          deleteToken: 'boolean',
        },
        save: {
          local: 'boolean',
          online: 'boolean',
        },
      },
    },
    pContext: {
      sessionToken: typings.optional('string'),
    },
    actorsMap: {
      promisees: {
        saveOnline: {
          then: 'primitive',
          catch: 'primitive',
        },

        saveLocal: {
          then: 'primitive',
          catch: 'primitive',
        },

        internet: {
          then: 'void',
          catch: 'primitive',
        },

        stockSession: {
          then: 'primitive',
          catch: 'primitive',
        },

        authenticateByToken: {
          then: {
            userID: 'string',
            sessionToken: 'string',
          },

          catch: typings.litterals('expired', 'notExists'),
        },

        deleteToken: {
          then: 'primitive',
          catch: 'primitive',
        },

        login: {
          then: {
            userID: 'string',
            sessionToken: 'string',
            infos: userInfos,
          },

          catch: 'primitive',
        },

        register: {
          then: {
            userID: 'string',
            sessionToken: 'string',
            infos: userInfos,
          },

          catch: 'primitive',
        },
      },
    },
  }),
).provideOptions(({ assign }) => ({
  delays: {
    AUTO_SAVE_DELAY: 5 * 60 * 1000, // 5 minutes
  },

  predicates: {
    isDirty: ({ context }) => context.dirty,
    autosave: ({ context }) => context.autosave,
    tokenExpired: {
      'authenticateByToken::catch': event => event.payload === 'expired',
    },
  },

  actions: {
    // #region NOTIFICATIONS
    notifyInternetSuccess: assign('context.internet', () => true),
    notifyInternetFailure: assign('context.internet', () => false),

    notifyAuthTokenSuccess: assign(
      'context.notfications.auth.token',
      () => 'valid' as const,
    ),

    notifyAuthTokenExpired: assign(
      'context.notfications.auth.token',
      () => 'expired' as const,
    ),

    notifyAuthTokenNotExists: assign(
      'context.notfications.auth.token',
      () => 'notExists' as const,
    ),

    notifyDeleteTokenSuccess: assign(
      'context.notfications.auth.deleteToken',
      () => true,
    ),

    notifyDeleteTokenFailure: assign(
      'context.notfications.auth.deleteToken',
      () => false,
    ),

    notifySessionSuccess: assign(
      'context.notfications.auth.session',
      () => true,
    ),

    notifySessionFailure: assign(
      'context.notfications.auth.session',
      () => false,
    ),

    notifyLoginSuccess: assign(
      'context.notfications.auth.login',
      () => true,
    ),

    notifyLoginFailure: assign(
      'context.notfications.auth.login',
      () => false,
    ),

    notifyRegistrationSuccess: assign(
      'context.notfications.auth.registration',
      () => true,
    ),

    notifyRegistrationFailure: assign(
      'context.notfications.auth.registration',
      () => false,
    ),

    notifySaveLocalSuccess: assign(
      'context.notfications.save.local',
      () => true,
    ),

    notifySaveLocalFailure: assign(
      'context.notfications.save.local',
      () => false,
    ),

    notifySaveOnlineSuccess: assign(
      'context.notfications.save.online',
      () => true,
    ),

    notifySaveOnlineFailure: assign(
      'context.notfications.save.online',
      () => false,
    ),
    // #endregion

    cleanData: assign('context.dirty', () => false),

    assignSessionToken: assign('pContext.sessionToken', {
      'login::then': ({ payload }) => payload.sessionToken,
      'register::then': ({ payload }) => payload.sessionToken,
    }),

    assignUserID: assign('context.userID', {
      'login::then': ({ payload }) => payload.userID,
      'register::then': ({ payload }) => payload.userID,
    }),

    assignUserInfos: assign('context.userInfos', {
      'login::then': ({ payload }) => payload.infos,
      'register::then': ({ payload }) => payload.infos,
    }),
  },

  actors: {
    promises: {
      internet: async () => {
        //Check the internet connection by pinging a reliable server (e.g., Google DNS)
        try {
          const response = await fetch('https://dns.google/');
          if (!response.ok) throw NO_INTERNET_ERROR;
        } catch (error) {
          throw NO_INTERNET_ERROR;
        }
      },
    },
  },
}));
