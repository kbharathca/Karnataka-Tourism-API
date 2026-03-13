import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [whitelistedDomains, setWhitelistedDomains] = useState<string[]>([]);
  const [allowAllDomains, setAllowAllDomains] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    const response = await fetch('/api/admin/config');
    const data = await response.json();
    setWhitelistedDomains(data.config.whitelistedDomains);
    setAllowAllDomains(data.config.allowAllDomains);
  };

  const saveConfig = async () => {
    const password = localStorage.getItem('admin_password');
    const response = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whitelistedDomains, allowAllDomains, password }),
    });
    if (response.ok) {
      alert('Config updated');
    } else {
      alert('Failed to update config');
    }
  };

  const addDomain = () => {
    if (newDomain && !whitelistedDomains.includes(newDomain)) {
      setWhitelistedDomains([...whitelistedDomains, newDomain]);
      setNewDomain('');
    }
  };

  const removeDomain = (domain: string) => {
    setWhitelistedDomains(whitelistedDomains.filter(d => d !== domain));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="mt-4">
        <label>
          <input
            type="checkbox"
            checked={allowAllDomains}
            onChange={(e) => setAllowAllDomains(e.target.checked)}
          />
          Allow all domains
        </label>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Whitelisted Domains</h2>
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          className="border p-2"
          placeholder="e.g., example.com"
        />
        <button onClick={addDomain} className="bg-blue-500 text-white p-2 rounded ml-2">Add</button>
        <ul className="mt-2">
          {whitelistedDomains.map(domain => (
            <li key={domain} className="mt-1">
              {domain}
              <button onClick={() => removeDomain(domain)} className="bg-red-500 text-white p-1 rounded ml-2">Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={saveConfig} className="bg-green-500 text-white p-2 rounded mt-4">Save Config</button>
      <button onClick={() => navigate('/')} className="bg-gray-500 text-white p-2 rounded mt-4 ml-2">Back to Home</button>
    </div>
  );
}
