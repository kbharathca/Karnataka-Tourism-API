/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login';
import Admin from './Admin';

function Home() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check_availability?check_in=07-04-2026&check_out=08-04-2026&hotel_id=35077');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Hotel Availability</h1>
      <button onClick={fetchData} className="bg-blue-500 text-white p-2 rounded mt-2">
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(data, null, 2)}</pre>
      <Link to="/login" className="text-blue-500 underline mt-4 block">Admin Panel</Link>
    </div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={() => setIsAdmin(true)} />} />
        <Route path="/admin" element={isAdmin ? <Admin /> : <Login onLogin={() => setIsAdmin(true)} />} />
      </Routes>
    </BrowserRouter>
  );
}
