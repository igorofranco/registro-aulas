import * as React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { LoginForm } from '../components/AuthForm';

const Login: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Login</title>
      </Head>
      <main className='mt-8 flex justify-center'>
        <main className='w-72'>
          <LoginForm />
        </main>
      </main>
    </main>
  );
};

export default Login;
