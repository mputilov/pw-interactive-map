import React, { useState, useRef, useEffect } from "react";
import type { ResourcesByTier, ResourceItem } from "../data/types";

type FiltersProps = {
  resourcesByTier: ResourcesByTier;
  weedsByTier: ResourcesByTier;
  resourceMap: { [id: string]: ResourceItem };
  selected: string[];
  onChange: (id: string, checked: boolean) => void;
};

type TierGroupsProps = {
  data: ResourcesByTier;
  resourceMap: { [id: string]: ResourceItem };
  selected: string[];
  onChange: (id: string, checked: boolean) => void;
  view: "list" | "grid";
};

const TierGroups = ({
  data,
  resourceMap,
  selected,
  onChange,
  view,
}: TierGroupsProps) => (
  <>
    {Object.entries(data).map(([tier, ids]) => {
      // Checkbox logic for select all
      const allSelected = ids.every((id) => selected.includes(id));
      const noneSelected = ids.every((id) => !selected.includes(id));
      const someSelected = !allSelected && !noneSelected;
      const tierCheckboxRef = useRef<HTMLInputElement>(null);
      useEffect(() => {
        if (tierCheckboxRef.current) {
          tierCheckboxRef.current.indeterminate = someSelected;
        }
      }, [someSelected]);
      const handleTierToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        ids.forEach((id) => {
          if (checked && !selected.includes(id)) onChange(id, true);
          if (!checked && selected.includes(id)) onChange(id, false);
        });
      };
      return (
        <div key={tier}>
          <div className="flex items-center gap-4 mb-4">
            <label className="cursor-pointer">
              <h3 className="text-base font-bold">Tier {tier}</h3>
              <input
                type="checkbox"
                ref={tierCheckboxRef}
                className="sr-only"
                checked={allSelected}
                onChange={handleTierToggle}
              />
            </label>
          </div>
          <div
            className={
              view === "grid"
                ? "flex flex-row flex-wrap gap-6"
                : "flex flex-col gap-3"
            }
          >
            {ids.map((id: string) => {
              const item = resourceMap[id];
              if (!item) return null;
              return (
                <label
                  key={id}
                  className={
                    "flex items-center gap-3 p-2 rounded cursor-pointer"
                  }
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm checkbox-accent"
                    checked={selected.includes(id)}
                    onChange={(e) => onChange(id, e.target.checked)}
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-32 object-contain"
                  />
                  {view === "list" && (
                    <span className="text-sm text-primary-content">
                      {item.name}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      );
    })}
  </>
);

export const Filters = ({
  resourcesByTier,
  weedsByTier,
  resourceMap,
  selected,
  onChange,
}: FiltersProps) => {
  const [open, setOpen] = useState(true);
  const [view, setView] = useState<"list" | "grid">("grid");

  if (!open) {
    return (
      <button
        className="fixed w-272 left-6 top-4 z-30 btn btn-primary"
        onClick={() => setOpen(true)}
      >
        Відкрити фільтри
      </button>
    );
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-300 overflow-y-auto bg-base-300 shadow-lg z-20 p-6 border-r border-gray-200">
      <div className="absolute top-4 left-190 flex gap-2 z-30">
        <button
          className="btn btn-primary"
          onClick={() => setView(view === "list" ? "grid" : "list")}
          aria-label="Змінити вигляд фільтрів"
        >
          {view === "list" ? "📋" : "🔲"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => setOpen(false)}
          aria-label="Закрити фільтри"
        >
          ×
        </button>
      </div>
      <div className="space-y-12">
        <div>
          <h2 className="text-lg font-bold mb-6 text-yellow-700">Ресурси</h2>
          <TierGroups
            data={resourcesByTier}
            resourceMap={resourceMap}
            selected={selected}
            onChange={onChange}
            view={view}
          />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-6 text-green-700">Трави</h2>
          <TierGroups
            data={weedsByTier}
            resourceMap={resourceMap}
            selected={selected}
            onChange={onChange}
            view={view}
          />
        </div>
      </div>
    </aside>
  );
};
