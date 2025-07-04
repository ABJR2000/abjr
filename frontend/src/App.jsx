import { useEffect, useState } from 'react';
import AdminUserForm from './components/AdminUserForm';
import FrancoCalendar from './components/FrancoCalendar';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (newToken, userRole) => {
    setToken(newToken);
    setRole(userRole);
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userRole);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Legajos</h1>
        <button
          onClick={() => {
            setToken(null);
            setRole(null);
            localStorage.clear();
          }}
          className="mt-2 text-red-600 underline"
        >
          Cerrar sesión
        </button>
      </header>
      {role === 'admin' ? (
        <AdminUserForm token={token} />
      ) : (
        <>
        <UserProfile />
        <FrancoCalendar token={token} />
        </>
      )}
    </div>
  );
}
