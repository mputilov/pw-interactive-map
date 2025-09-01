import { useState, useMemo } from "react";
import { Data } from "../../data/types";

export const useFilters = ({
  resource_list,
  coordinates,
}: Pick<Data, "resource_list" | "coordinates">) => {
  // State for selected resource IDs
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  // Build a lookup map for resource details
  const resourceMap = useMemo(() => {
    const map = {};
    for (const item of resource_list) {
      map[item.id] = item;
    }
    return map;
  }, []);

  // Compute coordinates to render based on selected resources
  const filteredCoordinates = useMemo(() => {
    if (selectedResources.length === 0) return [];
    return selectedResources.map((id) => coordinates[id] || []).flat();
  }, [selectedResources]);

  // Callback for Filters
  const handleFilterChange = (id, checked) => {
    setSelectedResources((prev) =>
      checked ? [...prev, id] : prev.filter((rid) => rid !== id)
    );
  };

  return {
    selectedResources,
    resourceMap,
    filteredCoordinates,
    handleFilterChange,
  };
};
