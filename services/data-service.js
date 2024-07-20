export const fetchSensor = async (namespace, precision) => {
  try {
    const url =
      process.env.NEXT_PUBLIC_HOST + "/stream/" + namespace + "/" + precision ||
      10;
    console.log("url: ", url);

    // Create headers object with the custom header
    const headers = new Headers();
    headers.append("ngrok-skip-browser-warning", "true");

    // Fetch with custom headers
    const res = await fetch(url, {
      method: "GET", // or 'POST' or other HTTP methods
      headers: headers,
    });
    console.log("res");
    return await res.json();
  } catch (err) {
    console.log("Failed to fetch sensors: ", err);
  }
};

export const fetchAggregated = async (path) => {
  const url = process.env.NEXT_PUBLIC_HOST + "/aggregated/all";
  console.log("url: ", url);

  // Create headers object with the custom header
  const headers = new Headers();
  headers.append("ngrok-skip-browser-warning", "true");

  // Fetch with custom headers
  const res = await fetch(url, {
    method: "GET", // or 'POST' or other HTTP methods
    headers: headers,
  });
  return await res.json();
};
