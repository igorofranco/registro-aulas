import React, { useState } from 'react';
import Link from 'next/link';
import userStore from '../store/userStore';
import User from '../types/user';
import { userSlice } from '../features/user/userSlice';

const PageHeader = () => {
  const [user, setUser] = useState<User>(userStore.getState());
  userStore.subscribe(() => {
    setUser(userStore.getState());
  });
  const { logout } = userSlice.actions;

  function Nav () {
    return (
      <nav>
        <ul className="flex gap-x-3">
          {!user.token
            ? <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/cadastro">Cadastro</Link>
            </li>
          </>
            : <li>
              <Link
                href='/login'
                onClick={() => userStore.dispatch(logout())}
              >
                Logout
              </Link>
            </li>
          }
        </ul>
      </nav>
    );
  }

  return (
    <header className='bg-white px-6 py-4 shadow-gray-200 shadow-md flex justify-center'>
      <main className='w-[960px] flex items-center justify-between'>
        <section className="font-bold">
          <Link href="/">Alunos</Link>
        </section>
        <Nav />
      </main>
    </header>
  );
};

export default PageHeader;
