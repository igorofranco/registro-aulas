import * as React from 'react';
import Link from 'next/link';
import userStore from '../store/userStore';
import { userSlice } from '../features/user/userSlice';
import { AppBar, Box, Toolbar } from '@mui/material';

const PageHeader = () => {
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
            {userStore.getState().token ? 'Logout' : 'Login'}
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default PageHeader;
