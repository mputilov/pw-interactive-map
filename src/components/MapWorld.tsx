import { Map } from "./Map";
import { Filters } from "./Filters";
import { useFilters } from "./Filters/useFilters";
import { data } from "../data/data";
import { omit } from "../utils";

export const MapWorld = () => {
  const {
    selectedResources,
    resourceMap,
    filteredCoordinates,
    handleFilterChange,
  } = useFilters({
    resource_list: data.resource_list,
    coordinates: data.coordinates,
  });

  return (
    <div className="flex justify-around w-full">
      <Filters
        resourcesByTier={omit(data.resource_by_tier, ["5"])}
        weedsByTier={omit(data.weeds_by_tier, ["5"])}
        resourceMap={resourceMap}
        selected={selectedResources}
        onChange={handleFilterChange}
      />
      <Map coordinates={filteredCoordinates} />
    </div>
  );
};
