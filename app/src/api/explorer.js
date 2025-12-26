export const searchExplorer = async (q) => {
  const res = await fetch(`http://localhost:3001/api/explorer/search/${q}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
};
