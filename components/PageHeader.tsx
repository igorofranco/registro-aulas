import * as React from 'react';
import Link from 'next/link';
import userStore from '../store/userStore';
import { userSlice } from '../features/user/userSlice';
import { AppBar, Box, Toolbar } from '@mui/material';
import User from '../types/user';

const PageHeader = () => {
  const [user, setUser] = React.useState<User>(userStore.getState());

  userStore.subscribe(() => setUser(userStore.getState()));

  function logout (): void {
    userStore.dispatch(userSlice.actions.logout());
  }
  return (
    <Box>
      <AppBar position="static">
        <Toolbar className="flex items-center justify-between">
          <Link
            href="/"
            className="font-bold hover:no-underline"
          >
            MCC
          </Link>
          <Link
            href="/login"
            onClick={() => (userStore.getState().token ? logout() : null)}
          >
            {user?.token ? 'Logout' : 'Login'}
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default PageHeader;
