
export type WindowCleaning = {
  frequency: string;
  lastCompleted: string;
  nextScheduled: string;
}

export type SteamCleaning = {
  charges: string;
  frequency: string;
  lastCompleted: string;
}

export type Periodicals = {
  windowCleaning: WindowCleaning;
  steamCleaning: SteamCleaning;
}
