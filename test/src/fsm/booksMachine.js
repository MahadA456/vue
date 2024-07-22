import { createMachine, assign } from 'xstate';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../main'; // Adjusted the import path to navigate correctly

const booksMachine = createMachine({
  id: 'books',
  initial: 'idle',
  context: {
    books: [],
    error: null,
  },
  states: {
    idle: {
      on: {
        FETCH: 'fetching',
        ADD: 'adding',
        UPDATE: 'updating',
        DELETE: 'deleting',
      },
    },
    fetching: {
      invoke: {
        id: 'fetchBooks',
        src: async () => {
          const querySnapshot = await getDocs(collection(db, 'books'));
          return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        },
        onDone: {
          target: 'idle',
          actions: assign({ books: (context, event) => event.data }),
        },
        onError: {
          target: 'idle',
          actions: assign({ error: (context, event) => event.data.message }),
        },
      },
    },
    adding: {
      invoke: {
        id: 'addBook',
        src: (context, event) => addDoc(collection(db, 'books'), event.book),
        onDone: {
          target: 'fetching',
        },
        onError: {
          target: 'idle',
          actions: assign({ error: (context, event) => event.data.message }),
        },
      },
    },
    updating: {
      invoke: {
        id: 'updateBook',
        src: (context, event) => updateDoc(doc(db, 'books', event.book.id), event.book),
        onDone: {
          target: 'fetching',
        },
        onError: {
          target: 'idle',
          actions: assign({ error: (context, event) => event.data.message }),
        },
      },
    },
    deleting: {
      invoke: {
        id: 'deleteBook',
        src: (context, event) => deleteDoc(doc(db, 'books', event.bookId)),
        onDone: {
          target: 'fetching',
        },
        onError: {
          target: 'idle',
          actions: assign({ error: (context, event) => event.data.message }),
        },
      },
    },
  },
});

export default booksMachine;
