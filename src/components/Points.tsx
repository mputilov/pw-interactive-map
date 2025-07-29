import React, { useState } from "react";
import { CoordinatePoint } from "../data/types";

import clsx from "clsx";

const PARAMETERS_MAP = {
  world: { ox: 1470, oz: 4, size_x: 1024, shift_x: 234, size_y: 768, r: 0.695 },
  a21: { ox: 215, oz: -397, size_x: 1024, shift_x: 0, size_y: 768, r: 2.5 },
  a22: { ox: 206, oz: -398, size_x: 1024, shift_x: 0, size_y: 768, r: 2.53 },
};

const PointComponent = ({
  x,
  y,
  mapParameters: { ox, oz, size_x, shift_x, size_y, r },
  onClick,
}: CoordinatePoint & {
  onClick: (coords: string) => void;
  mapParameters: (typeof PARAMETERS_MAP)[keyof typeof PARAMETERS_MAP];
}) => {
  const stringValue = `${Math.round(x)} ${Math.round(y)}`;
  return (
    <div
      className="absolute"
      style={{
        left: Math.abs(Math.round((x + ox) * r) - size_x + shift_x),
        top: Math.abs(Math.round((y + oz) * r) - size_y),
      }}
    >
      <div
        className={clsx(
          "absolute bg-point border border-black tooltip pointer size-7 -translate-1/2",
          "hover:bg-point-hover active:bg-point-active hover:size-9 active:size-9 hover:z-9999"
        )}
        onClick={() => {
          navigator.clipboard.writeText(stringValue);
          onClick(stringValue);
        }}
        data-tip={stringValue}
      ></div>
    </div>
  );
};

export const Points = ({
  coordinates,
  mapId,
}: {
  coordinates: CoordinatePoint[];
  mapId: keyof typeof PARAMETERS_MAP;
}) => {
  const [toast, setToast] = useState<string | null>(null);

  const handlePointClick = (coords: string) => {
    setToast(`Координати скопійовано: ${coords}`);
    setTimeout(() => setToast(null), 2000);
  };

  const mapParameters = PARAMETERS_MAP[mapId];

  console.log(
    "Rendering Points for map:",
    mapId,
    "with parameters:",
    mapParameters
  );
  return (
    <div className="absolute inset-0">
      {coordinates.map((coordinates, idx) => {
        return (
          <PointComponent
            key={idx}
            x={coordinates.x}
            y={coordinates.y}
            mapParameters={PARAMETERS_MAP[mapId]}
            onClick={handlePointClick}
          />
        );
      })}
      {toast && (
        <div className="toast toast-top toast-end z-[99999]">
          <div className="alert alert-success">
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
};
