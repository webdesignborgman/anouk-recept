'use client';

import { Header } from './Header';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export const HeaderWrapper = () => {
  const [user] = useAuthState(auth);

  const handleSignOut = () => {
    signOut(auth);
  };

  const mappedUser = user
    ? {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      }
    : null;

  return <Header user={mappedUser} onSignOut={handleSignOut} />;
};
