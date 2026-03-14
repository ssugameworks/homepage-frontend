export type Category = "recruitment" | "gathering" | "social" | "networking" | "competition" | "trip";

export type GameEvent = {
  id: string;
  title: string;
  category: Category;
  start: string;
  end: string;
  link?: string;
  "링크"?: string;
  url?: string;
  URL?: string;
};

export type DayCell = {
  day: number;
  kind: "prev" | "cur" | "next";
};

export type DateAxis = "x" | "y";

export type DateMotion = {
  axis: DateAxis;
  dir: number;
};

export type EventStatus = "completed" | "ongoing" | "upcoming";

export type CellBar = {
  eventId: string;
  color: string;
  role: "solo" | "start" | "end" | "middle";
};
