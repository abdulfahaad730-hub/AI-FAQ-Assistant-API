import React, { useEffect } from 'react';
import { useHackathon } from '../context/HackathonContext';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';

export const Admin: React.FC = () => {
  const { isAdminLoggedIn } = useHackathon();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isAdminLoggedIn]);

  return (
    <div className="min-h-screen relative z-10">
      {isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />}
    </div>
  );
};
