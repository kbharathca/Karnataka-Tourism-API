/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${window.location.origin}/check_availability?check_in=07-04-2026&check_out=08-04-2026&hotel_id=35077`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Hotel Availability</h1>
      <button onClick={fetchData} className="bg-blue-500 text-white p-2 rounded mt-2 flex items-center gap-2" disabled={loading}>
        {loading && <Loader2 className="animate-spin" size={16} />}
        {loading ? 'Fetching...' : 'Fetch Data'}
      </button>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
      <pre className="mt-4 bg-gray-100 p-2">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
