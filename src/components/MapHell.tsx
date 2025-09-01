import { Map } from "./Map";
import { Filters } from "./Filters";
import { useFilters } from "./Filters/useFilters";
import { data } from "../data/data";
import { omit } from "../utils";

const HELL_ID = "a22"; // Assuming a21 is the ID for the Hell map

export const MapHell = () => {
  const {
    selectedResources,
    resourceMap,
    filteredCoordinates,
    handleFilterChange,
  } = useFilters({
    resource_list: data.resource_list,
    coordinates: data.hell_coordinates,
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
      <Map coordinates={filteredCoordinates} id={HELL_ID} />
    </div>
  );
};
