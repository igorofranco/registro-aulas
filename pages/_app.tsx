import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageHeader from '../components/PageHeader';
import { Provider } from 'react-redux';
import store from '../store/userStore';

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <main className='min-h-screen bg-gray-50'>
        <PageHeader />
        <main>
          <Component {...pageProps} />
        </main>
      </main>
    </Provider>
  );
}

export default MyApp;
