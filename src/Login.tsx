import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      localStorage.setItem('admin_password', password);
      onLogin();
      navigate('/admin');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mt-2"
        placeholder="Password"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded mt-2 ml-2">Login</button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
