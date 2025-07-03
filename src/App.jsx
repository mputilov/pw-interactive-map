import "./App.css";
import { Map } from "./components/Map";
import { Filters } from "./components/Filters";
import { data } from "./data/data";
import React, { useState, useMemo } from "react";

function App() {
  // State for selected resource IDs
  const [selectedResources, setSelectedResources] = useState([]);

  // Build a lookup map for resource details
  const resourceMap = useMemo(() => {
    const map = {};
    for (const item of data.resource_list) {
      map[item.id] = item;
    }
    return map;
  }, []);

  // Compute coordinates to render based on selected resources
  const filteredCoordinates = useMemo(() => {
    if (selectedResources.length === 0) return [];
    return selectedResources.map((id) => data.coordinates[id] || []).flat();
  }, [selectedResources]);

  // Callback for Filters
  const handleFilterChange = (id, checked) => {
    setSelectedResources((prev) =>
      checked ? [...prev, id] : prev.filter((rid) => rid !== id)
    );
  };

  return (
    <div className="flex justify-around w-full">
      <Filters
        resourcesByTier={data.resource_by_tier}
        weedsByTier={data.weeds_by_tier}
        resourceMap={resourceMap}
        selected={selectedResources}
        onChange={handleFilterChange}
      />
      <Map coordinates={filteredCoordinates} />
    </div>
  );
}

export default App;
