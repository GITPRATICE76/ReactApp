export type DayAnalytics = {
  date: string;
  total_resources: number;
  on_leave: number;
  leave_percentage: number;
  available_percentage: number;
  remaining_allowed_percentage: number;
  employees_on_leave: string[]; // MUST be array from backend
};
