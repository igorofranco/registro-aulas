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
import { userSlice } from '../features/user/userSlice';
import { useRouter } from 'next/router';
import User from '../types/user';
import StudentApi from '../Api/StudentApi';
import { studentsSlice } from '../features/student/studentsSlice';

function MyApp ({ Component, pageProps }: AppProps) {
  const themeColor = '1976d2';
  const [user, setUser] = React.useState<User>(userStore.getState());
  const [isLoading, setLoading] = React.useState<boolean>(true);
  userStore.subscribe(() => {
    setUser(userStore.getState());
  });
  React.useEffect(() => {
    userStore.dispatch(userSlice.actions.autoLoginByLocalStorage());
  }, []);

  React.useEffect(() => {
    setLoading(true);
    if (!userStore.getState()?.id) {
      if (typeof window !== 'undefined') {
        const router = useRouter();
        router.push('/login');
      }
      return;
    }
    StudentApi.getAll()
      .then(res => {
        studentsStore.dispatch(studentsSlice.actions.setStudents(res));
      })
      .then(() => setLoading(false));
  }, [user]);

  if (isLoading) {
    return <div>carregando</div>;
  }

  return (
    <Provider store={userStore}>
      <Provider store={instrumentsStore}>
        <Provider store={studentsStore}>
          <Provider store={classFormatsStore}>
            <Head>
              <title>Alunos</title>
              <meta name='theme-color' content={themeColor} />
              <meta name='msapplication-TileColor' content={themeColor} />
              <meta name='msapplication-navbutton-color' content={themeColor} />
              <meta name='apple-mobile-web-app-status-bar-style' content={themeColor} />
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
