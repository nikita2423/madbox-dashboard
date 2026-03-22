/**
 * Data loader utility for dynamic brand and medium extraction from data.json
 */

export interface DataItem {
  brands?: string[];
  medium?: string;
  unix_timestamp?: number;
  [key: string]: any;
}

/**
 * Extract unique brands from data
 */
export function extractUniqueBrands(data: DataItem[]): string[] {
  const brands = new Set<string>();
  data.forEach((item) => {
    if (item.brands && Array.isArray(item.brands)) {
      item.brands.forEach((brand) => {
        if (brand && typeof brand === "string") {
          brands.add(brand);
        }
      });
    }
  });
  return Array.from(brands).sort();
}

/**
 * Extract unique mediums from data
 */
export function extractUniqueMediums(data: DataItem[]): string[] {
  const mediums = new Set<string>();
  data.forEach((item) => {
    if (item.medium && typeof item.medium === "string") {
      mediums.add(item.medium);
    }
  });
  return Array.from(mediums).sort();
}

/**
 * Filter data by brands
 */
export function filterByBrands(
  data: DataItem[],
  brands: string[]
): DataItem[] {
  if (brands.length === 0) return data;
  return data.filter((item) => {
    if (!item.brands || !Array.isArray(item.brands)) return false;
    return brands.some((brand) => item.brands?.includes(brand));
  });
}

/**
 * Filter data by mediums
 */
export function filterByMedium(
  data: DataItem[],
  mediums: string[]
): DataItem[] {
  if (mediums.length === 0) return data;
  return data.filter((item) => mediums.includes(item.medium || ""));
}

/**
 * Filter data by unix_timestamp range
 */
export function filterByDateRange(
  data: DataItem[],
  startTimestamp: number,
  endTimestamp: number
): DataItem[] {
  return data.filter((item) => {
    const timestamp = item.unix_timestamp;
    if (typeof timestamp !== "number") return false;
    return timestamp >= startTimestamp && timestamp <= endTimestamp;
  });
}

/**
 * Combined filter function
 */
export function filterData(
  data: DataItem[],
  options: {
    brands?: string[];
    mediums?: string[];
    startTimestamp?: number;
    endTimestamp?: number;
  }
): DataItem[] {
  let filtered = data;

  if (options.brands && options.brands.length > 0) {
    filtered = filterByBrands(filtered, options.brands);
  }

  if (options.mediums && options.mediums.length > 0) {
    filtered = filterByMedium(filtered, options.mediums);
  }

  if (
    options.startTimestamp !== undefined &&
    options.endTimestamp !== undefined
  ) {
    filtered = filterByDateRange(
      filtered,
      options.startTimestamp,
      options.endTimestamp
    );
  }

  return filtered;
}
