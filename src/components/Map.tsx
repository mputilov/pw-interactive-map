import React from "react";
import mapSrc from "../assets/world.jpg";
import { Points } from "./Points";
import type { CoordinatePoint } from "../data/types";

export const Map = ({ coordinates }: { coordinates: CoordinatePoint[] }) => {
  return (
    <div className="relative flex">
      <img src={mapSrc} alt="world-map" className="w-1024 h-768" />
      <Points coordinates={coordinates} />
    </div>
  );
};
