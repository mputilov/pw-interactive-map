import "./App.css";
import { MapWorld } from "./components/MapWorld";
import { MapHell } from "./components/MapHell";
import { MapHeaven } from "./components/MapHeaven";
import { Filters } from "./components/Filters";
import { useUrlParam } from "./hooks";

const MAP_OPTIONS = {
  world: {
    component: MapWorld,
    label: "Світ",
  },
  heaven: {
    component: MapHeaven,
    label: "Небеса",
  },
  hell: {
    component: MapHell,
    label: "Пекло",
  },
};

function App() {
  const [selectedMap, setSelectedMap] = useUrlParam("map", "world");

  const renderSelectedMap = () => {
    const MapComponent = MAP_OPTIONS[selectedMap]?.component;
    return <MapComponent />;
  };

  return (
    <div className="flex justify-around w-full">
      <ul className="bg-base-200 rounded-box fixed top-10 right-10 z-1">
        {Object.entries(MAP_OPTIONS).map(([key, { label }]) => (
          <li
            key={key}
            className="border-b-1 border-base-content last:border-transparent hover:bg-base-300 first:rounded-t-box last:rounded-b-box"
          >
            <label className="flex items-center gap-8 p-10">
              <input
                type="radio"
                name="map"
                value={key}
                checked={selectedMap === key}
                onChange={(e) => setSelectedMap(e.target.value)}
                className="radio"
              />
              <span className="text-sm font-bold">{label}</span>
            </label>
          </li>
        ))}
      </ul>

      {renderSelectedMap()}
    </div>
  );
}

export default App;
