import axiosInstance from "../Routes/axiosInstance";

export const LOGIN_URL = "/login";

export const CREATEACCOUNT_URL = "/createaccount";

export const APPLY_LEAVE_URL = "/applyleave";

export const GET_LEAVES_URL = "/leaves";

export const ACTION_URL = "/leave/action";

export const ORG_CHART_URL = "/org-chart";

export const DASHBOARD_URL = "/dashboard/summary";

export const HOLIDAY_URL = "/holidays";

export const ED_URL = "/employee/dashboard";

export const LEAVE_HISTORY_URL = "/leave/history";

export const DROPDOWN_URL = "/usercode/details";

export const DELETE_LEAVE_URL = "/leave/delete";

export const GET_REPORTING = "/reporting-to";

export const GET_USER_HISTORY = (userId: number | string) =>
  `/leave-history/${userId}`;

export const getUserHistory = async (userId: number | string) => {
  return axiosInstance.get(GET_USER_HISTORY(userId));
};