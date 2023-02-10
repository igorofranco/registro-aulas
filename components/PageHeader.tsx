import React from 'react';
import Link from 'next/link';

const PageHeader = () => {
  return (
    <header className='bg-white px-6 py-4 shadow-gray-400 shadow-md flex justify-center'>
      <main className='w-[960px] flex justify-between'>
        <section className="font-bold">
          Alunos
        </section>
        <nav>
          <ul className="flex gap-x-3">
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/cadastro">Cadastro</Link>
            </li>
          </ul>
        </nav>
      </main>
    </header>
  );
};

export default PageHeader;
