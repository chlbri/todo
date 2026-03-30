/**
 *
 * All paths of the concerned files
 * 
 * ### Author
 *
 * chlbri (bri_lvi@icloud.com)
 *
 * [My GitHub](https://github.com/chlbri?tab=repositories)
 *
 * <br/>
 *
 * ### Documentation
 *
 * Link to machine lib [here](https://www.npmjs.com/package/@bemedev/app-ts).
 *
 * Link to this lib [here](https://www.npmjs.com/package/@bemedev/app-cli)
 *
 *
 * This file is auto-generated. Do not edit manually.
 */
   export type _AllPaths = {
    machine: '/' | '/idle' | '/preparing' | '/preparing/internet' | '/preparing/authentication' | '/preparing/authentication/token' | '/preparing/authentication/deleteToken' | '/preparing/authentication/session' | '/preparing/authentication/authentication' | '/preparing/authentication/authentication/idle' | '/preparing/authentication/authentication/login' | '/preparing/authentication/authentication/registration' | '/preparing/authentication/authentication/error' | '/working' | '/working/idle' | '/working/save' | '/working/autosave' | '/working/saving' | '/working/saving/local' | '/working/saving/internet' | '/working/saving/online';
  }
   /**
   * 
   * Constants as type helpers for the concerned file. 
   * Don't use it as values, just for typings
   * 
   * ### Author
   * 
   * chlbri (bri_lvi@icloud.com)
   * 
   * [My GitHub](https://github.com/chlbri?tab=repositories)
   * 
   * <br/>
   * 
   * ### Documentation
   *
   * Link to machine lib [here](https://www.npmjs.com/package/@bemedev/app-ts).
   * 
   * Link to this lib [here](https://www.npmjs.com/package/@bemedev/app-cli)
   * 
   * NB: This file is auto-generated. Do not edit manually.
   */
    export const SCHEMAS = {
   machine: {
        __tsSchema: undefined as unknown as {
      readonly targets: Exclude<_AllPaths['machine'], '/'>;
      readonly states: {
        readonly idle: {
      readonly targets: Exclude<_AllPaths['machine'], '/idle'>;
    };
   readonly preparing: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing'>;
      readonly states: {
        readonly internet: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/internet'>;
    };
   readonly authentication: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication'>;
      readonly states: {
        readonly token: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/token'>;
    };
   readonly deleteToken: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/deleteToken'>;
    };
   readonly session: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/session'>;
    };
   readonly authentication: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/authentication'>;
      readonly states: {
        readonly idle: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/authentication/idle'>;
    };
   readonly login: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/authentication/login'>;
    };
   readonly registration: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/authentication/registration'>;
    };
   readonly error: {
      readonly targets: Exclude<_AllPaths['machine'], '/preparing/authentication/authentication/error'>;
    };
      };
      readonly initial: 'idle' | 'login' | 'registration' | 'error';
    };
      };
      readonly initial: 'token' | 'deleteToken' | 'session' | 'authentication';
    };
      };
      readonly initial: 'internet' | 'authentication';
    };
   readonly working: {
      readonly targets: Exclude<_AllPaths['machine'], '/working'>;
      readonly states: {
        readonly idle: {
      readonly targets: Exclude<_AllPaths['machine'], '/working/idle'>;
    };
   readonly save: {
      readonly targets: Exclude<_AllPaths['machine'], '/working/save'>;
    };
   readonly autosave: {
      readonly targets: Exclude<_AllPaths['machine'], '/working/autosave'>;
    };
   readonly saving: {
      readonly targets: Exclude<_AllPaths['machine'], '/working/saving'>;
      readonly states: {
        readonly local: {
      readonly targets: Exclude<_AllPaths['machine'], '/working/saving/local'>;
    };
   readonly internet: {
      readonly targets: Exclude<_AllPaths['machine'], '/working/saving/internet'>;
    };
   readonly online: {
      readonly targets: Exclude<_AllPaths['machine'], '/working/saving/online'>;
    };
      };
      readonly initial: 'local' | 'internet' | 'online';
    };
      };
      readonly initial: 'idle' | 'save' | 'autosave' | 'saving';
    };
      };
      readonly initial: 'idle' | 'preparing' | 'working';
    },
      },
   }