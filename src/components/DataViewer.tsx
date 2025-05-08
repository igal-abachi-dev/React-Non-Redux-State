import { useFetchData } from "../hooks/useFetchData";

interface Item {
  id: number;
  name: string;
}

export function DataViewer() {
  const [{ data, loading, error }] = useFetchData<Item[]>("/api/items");

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!data) return <p>No data.</p>;

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
