import { useEffect, useState } from "react";
import { loadWorkoutData } from "./utils/loadWorkoutData";

function App() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkoutData()
      .then(setData)
      .catch(err => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <h1>Error: {error}</h1>;
  }

  if (!data.length) {
    return <h1>Loading XLSX…</h1>;
  }

  return (
    <pre style={{ padding: 20 }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

export default App;
