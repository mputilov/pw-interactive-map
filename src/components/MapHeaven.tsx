import { Map } from "./Map";
import { Filters } from "./Filters";
import { useFilters } from "./Filters/useFilters";
import { data } from "../data/data";
import { omit } from "../utils";

const HEAVEN_ID = "a21"; // Assuming a21 is the ID for the Heaven map

export const MapHeaven = () => {
  const {
    selectedResources,
    resourceMap,
    filteredCoordinates,
    handleFilterChange,
  } = useFilters({
    resource_list: data.resource_list,
    coordinates: data.heaven_coordinates,
  });

  return (
    <div className="flex justify-around w-full">
      <Filters
        resourcesByTier={omit(data.resource_by_tier, ["1", "2", "3"])}
        weedsByTier={omit(data.weeds_by_tier, ["1", "2", "3"])}
        resourceMap={resourceMap}
        selected={selectedResources}
        onChange={handleFilterChange}
      />
      <Map coordinates={filteredCoordinates} id={HEAVEN_ID} />
    </div>
  );
};
