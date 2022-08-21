import { http } from "../Http";

const ENDPOINT = "/api/v1/notifications";

export const NotificationService = {
  markAsRead: (id: number) => http.put<{}>(`${ENDPOINT}/read/${id}`),
};
