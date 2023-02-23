import * as React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { SignupForm } from '../components/AuthForm';

const Cadastro: NextPage = () => {
  return (
    <main>
      <Head>
        <title>Cadastro</title>
      </Head>
      <main className='mt-8 flex justify-center'>
        <main className='w-72'>
          <SignupForm />
        </main>
      </main>
    </main>
  );
};

export default Cadastro;
