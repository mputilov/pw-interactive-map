import React from "react";
import mapSrc from "../assets/world.jpg";

export const Map: React.FC = () => {
  return (
    <div className="relative">
      {/* <img src={mapSrc} alt="world-map" /> */}
      <img
        src="http://www.pwdatabase.com/images/maps/ru/world.jpg"
        alt="world-map"
      />
    </div>
  );
};
