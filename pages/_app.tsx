import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageHeader from '../components/PageHeader';

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <main className='min-h-screen bg-gray-50'>
      <PageHeader />
      <main>
        <Component {...pageProps} />
      </main>
    </main>
  );
}

export default MyApp;
