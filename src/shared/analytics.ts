export type DayAnalytics = {
  date: string;
  total_resources: number;
  on_leave: number;

  approved: number;
  pending: number;

  leave_percentage: number;
  available_percentage: number;
  remaining_allowed_percentage: number;

  employees_on_leave: string[];
  employees_pending: string[];
};