import worldSrc from "../assets/world.jpg";
import a21Src from "../assets/a21.jpg";
import a22Src from "../assets/a22.jpg";
import { Points } from "./Points";
import type { CoordinatePoint } from "../data/types";

const MAPS_MAP = {
  world: worldSrc,
  a21: a21Src,
  a22: a22Src,
};

export const Map = ({
  coordinates,
  id = "world",
}: {
  coordinates: CoordinatePoint[];
  id?: keyof typeof MAPS_MAP;
}) => {
  const mapSrc = MAPS_MAP[id];
  return (
    <div className="relative flex">
      <img src={mapSrc} alt={`${id}-map`} className="shrink-0 w-1024 h-768" />
      <Points coordinates={coordinates} mapId={id} />
    </div>
  );
};
