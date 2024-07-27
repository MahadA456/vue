import { Machine, assign } from 'xstate';
import { login, registerUser, logout, fetchBooks, createBook, updateBook, deleteBook } from './services';

export const bookMachine = Machine({
  id: 'bookMachine',
  initial: 'idle',
  context: {
    user: null,
    books: [],
    genres: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller', 'Biography', 'Other'],
    error: null
  },
  states: {
    idle: {
      on: {
        LOGIN: "authenticating"
       
      }
    },
    authenticating: {
      invoke: {
        id: 'login',
        src: (context, event) => login(event.data),
        onDone: {
          target: 'authenticated',
          actions: assign({
            user: (context, event) => event.data
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.data
          })
        }
      }
    },
    registering: {
      invoke: {
        id: 'register',
        src: (context, event) => registerUser(event.data),
        onDone: {
          target: 'authenticated',
          actions: assign({
            user: (context, event) => event.data
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.data
          })
        }
      }
    },
    authenticated: {
      on: {
        FETCH_BOOKS: 'fetchingBooks',
        CREATE_BOOK: 'creatingBook',
        UPDATE_BOOK: 'updatingBook',
        DELETE_BOOK: 'deletingBook',
        LOGOUT: 'loggingOut'
      }
    },
    fetchingBooks: {
      invoke: {
        id: 'fetchBooks',
        src: fetchBooks,
        onDone: {
          target: 'authenticated',
          actions: assign({
            books: (context, event) => event.data
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.data
          })
        }
      }
    },
    creatingBook: {
      invoke: {
        id: 'createBook',
        src: (context, event) => createBook(event.data),
        onDone: {
          target: 'authenticated',
          actions: assign({
            books: (context, event) => [...context.books, event.data]
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.data
          })
        }
      }
    },
    updatingBook: {
      invoke: {
        id: 'updateBook',
        src: (context, event) => updateBook(event.data),
        onDone: {
          target: 'authenticated',
          actions: assign({
            books: (context, event) => context.books.map(book => book.id === event.data.id ? event.data : book)
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.data
          })
        }
      }
    },
    deletingBook: {
      invoke: {
        id: 'deleteBook',
        src: (context, event) => deleteBook(event.data),
        onDone: {
          target: 'authenticated',
          actions: assign({
            books: (context, event) => context.books.filter(book => book.id !== event.data)
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.data
          })
        }
      }
    },
    loggingOut: {
      invoke: {
        id: 'logout',
        src: logout,
        onDone: {
          target: 'idle',
          actions: assign({
            user: null
          })
        },
        onError: {
          target: 'error',
          actions: assign({
            error: (context, event) => event.data
          })
        }
      }
    },
    error: {
      on: {
        RETRY: 'idle'
      }
    }
  }
});