export const searchExplorer = async (q) => {
  const res = await fetch(`http://localhost:3001/api/explorer/search/${q}`);

  if (!res.ok) {
    if (res.status === 400) {
      throw new Error("Invalid input");
    }
    if (res.status === 404) {
      throw new Error("Not found");
    }
    throw new Error("Server error");
  }

  return res.json();
};
