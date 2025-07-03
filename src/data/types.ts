// Type for a single resource item in resource.json
export type ResourceItem = {
  id: string;
  resource: string;
  source_name: string;
  href: string;
  tier: string;
  name: string;
  ukrName?: string;
  image: string;
};

// Type for resources grouped by tier (now array of IDs)
export type ResourcesByTier = {
  [tier: string]: string[];
};

// Type for the full resource list
export type ResourceList = ResourceItem[];

// Type for a single coordinate point
export type CoordinatePoint = {
  x: number;
  y: number;
};

export type CoordinatesMap = {
  [id: string]: CoordinatePoint[];
};
