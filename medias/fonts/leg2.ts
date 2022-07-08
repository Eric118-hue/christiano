export type Leg2Id =
  | "arrival"
  | "departure"
  | "destination"
  | "receipt"
  | "resize"
  | "warehouse-gha"
  | "warehouse";

export type Leg2Key =
  | "Arrival"
  | "Departure"
  | "Destination"
  | "Receipt"
  | "Resize"
  | "WarehouseGha"
  | "Warehouse";

export enum Leg2 {
  Arrival = "arrival",
  Departure = "departure",
  Destination = "destination",
  Receipt = "receipt",
  Resize = "resize",
  WarehouseGha = "warehouse-gha",
  Warehouse = "warehouse",
}

export const LEG2_CODEPOINTS: { [key in Leg2]: string } = {
  [Leg2.Arrival]: "61697",
  [Leg2.Departure]: "61698",
  [Leg2.Destination]: "61699",
  [Leg2.Receipt]: "61700",
  [Leg2.Resize]: "61701",
  [Leg2.WarehouseGha]: "61702",
  [Leg2.Warehouse]: "61703",
};
