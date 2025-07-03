import React, { useState } from "react";
import { CoordinatePoint } from "../data/types";

import clsx from "clsx";

const oz = 4;
const ox = 1470;
const size_x = 1024;
const shift_x = 234;
const size_y = 768;
const r = 0.695;

const PointComponent = ({
  x,
  y,
  onClick,
}: CoordinatePoint & { onClick: (coords: string) => void }) => {
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

export const Points = ({ coordinates }: { coordinates: CoordinatePoint[] }) => {
  const [toast, setToast] = useState<string | null>(null);

  const handlePointClick = (coords: string) => {
    setToast(`Координати скопійовано: ${coords}`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="absolute inset-0">
      {coordinates.map((coordinates, idx) => {
        return (
          <PointComponent
            key={idx}
            x={coordinates.x}
            y={coordinates.y}
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
