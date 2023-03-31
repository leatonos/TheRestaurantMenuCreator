import '../styles/globals.css'

import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
    )
}