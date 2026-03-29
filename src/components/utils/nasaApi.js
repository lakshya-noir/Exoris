// src/utils/nasaApi.js

async function fetchPlanets() {
  try {
    const response = await fetch("https://api.le-systeme-solaire.net/rest/bodies?filter[]=isPlanet,eq,true");
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.bodies;
  } catch (error) {
    console.error("Error fetching planets:", error);
    return [];
  }
}

// Export as named export
export { fetchPlanets };
