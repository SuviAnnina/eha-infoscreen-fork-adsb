"use client"; // flag component as client component (to use react hooks)

import { useState, useEffect } from "react";

export default function Notams() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/api/data")
      .then((response) => {
        if (!response.ok)
          throw new Error("Error in fetch: " + response.statusText);
        return response.json();
      })
      .then((fetchedData) => setData(fetchedData.message))
      .catch((err) => console.error(err));
  };

  return (
    <>
      <p>{data || "Loading..."}</p>
    </>
  );
}
