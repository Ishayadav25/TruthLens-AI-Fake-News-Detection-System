/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

type View = 'dashboard' | 'profile';

export default function App() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [localUser, setLocalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeUser = firebaseUser || localUser;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!activeUser) return <Login onLocalLogin={setLocalUser} />;

  return view === 'dashboard' ? (
    <Dashboard user={activeUser} onNavigate={setView} />
  ) : (
    <Profile user={activeUser} onNavigate={setView} />
  );
}
