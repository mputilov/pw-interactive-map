import { Map } from "./Map";
import { Filters } from "./Filters";
import { useFilters } from "./Filters/useFilters";
import { data } from "../data/data";

export const MapWorld = () => {
  const {
    selectedResources,
    resourceMap,
    filteredCoordinates,
    handleFilterChange,
  } = useFilters(data);

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
};
