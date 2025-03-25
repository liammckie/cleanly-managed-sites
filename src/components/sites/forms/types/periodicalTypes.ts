
export interface PeriodicalService {
  frequency: string;
  lastCompleted?: string;
  nextScheduled?: string;
  charges?: number;
}
