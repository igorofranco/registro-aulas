import * as React from 'react';
import Link from 'next/link';
import userStore from '../store/userStore';
import User from '../types/user';
import { userSlice } from '../features/user/userSlice';
import { AppBar, Box, Toolbar } from '@mui/material';

const PageHeader = () => {
  const [user, setUser] = React.useState<User>(userStore.getState());
  userStore.subscribe(() => {
    setUser(userStore.getState());
  });
  const { logout } = userSlice.actions;

  function isLoggedIn (): boolean { return !!user.token; }

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar className='flex items-center justify-between'>
          <Link href='/' className='font-bold hover:no-underline'>
            Alunos
          </Link>
          <Link
            href='/login'
            onClick={() => (isLoggedIn() ? logout() : null)}
          >
            {isLoggedIn() ? 'Logout' : 'Login'}
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default PageHeader;
