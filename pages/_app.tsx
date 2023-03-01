import * as React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import PageHeader from '../components/PageHeader';
import { Provider } from 'react-redux';
import userStore from '../store/userStore';
import { instrumentsStore } from '../store/instrumentsStore';
import studentsStore from '../store/studentsStore';
import { classFormatsStore } from '../store/classFormatsStore';
import Head from 'next/head';

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <Provider store={userStore}>
      <Provider store={instrumentsStore}>
        <Provider store={studentsStore}>
          <Provider store={classFormatsStore}>
            <Head>
              <title>Alunos</title>
              <meta name='theme-color' content='#1976d2' />
            </Head>
            <main className='bg-gray-50' style={{ minHeight: '100dvh' }}>
              <PageHeader />
              <main>
                <Component {...pageProps} />
              </main>
            </main>
          </Provider>
        </Provider>
      </Provider>
    </Provider>
  );
}

export default MyApp;
