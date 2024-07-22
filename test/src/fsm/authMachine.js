// authMachine.js
import { createMachine, assign } from 'xstate';
import { auth } from './main';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: {
    user: null,
    error: null,
  },
  states: {
    idle: {
      on: {
        LOGIN: 'loggingIn',
        REGISTER: 'registering',
        LOGOUT: 'loggingOut',
      },
    },
    loggingIn: {
      invoke: {
        id: 'login',
        src: (context, event) => signInWithEmailAndPassword(auth, event.email, event.password),
        onDone: {
          target: 'authenticated',
          actions: assign({ user: (context, event) => event.data.user }),
        },
        onError: {
          target: 'idle',
          actions: assign({ error: (context, event) => event.data.message }),
        },
      },
    },
    registering: {
      invoke: {
        id: 'register',
        src: (context, event) => createUserWithEmailAndPassword(auth, event.email, event.password),
        onDone: {
          target: 'authenticated',
          actions: assign({ user: (context, event) => event.data.user }),
        },
        onError: {
          target: 'idle',
          actions: assign({ error: (context, event) => event.data.message }),
        },
      },
    },
    loggingOut: {
      invoke: {
        id: 'logout',
        src: () => signOut(auth),
        onDone: {
          target: 'idle',
          actions: assign({ user: null }),
        },
        onError: {
          target: 'idle',
          actions: assign({ error: (context, event) => event.data.message }),
        },
      },
    },
    authenticated: {
      on: {
        LOGOUT: 'loggingOut',
      },
    },
  },
});

export default authMachine;