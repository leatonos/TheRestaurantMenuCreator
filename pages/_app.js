import '../styles/globals.css'

import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import store from '../redux/store'
import { Provider } from 'react-redux'

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserProvider>
    )
}