import { Map } from "./Map";
import { Filters } from "./Filters";
import { useFilters } from "./Filters/useFilters";
import { data } from "../data/tier5/data";

const HEAVEN_ID = "a21"; // Assuming a21 is the ID for the Heaven map

export const MapHeaven = () => {
  const {
    selectedResources,
    resourceMap,
    filteredCoordinates,
    handleFilterChange,
  } = useFilters({ ...data, coordinates: data.coordinates[HEAVEN_ID] });

  return (
    <div className="flex justify-around w-full">
      <Filters
        resourcesByTier={data.resource_by_tier}
        weedsByTier={data.weeds_by_tier}
        resourceMap={resourceMap}
        selected={selectedResources}
        onChange={handleFilterChange}
      />
      <Map coordinates={filteredCoordinates} id={HEAVEN_ID} />
    </div>
  );
};
