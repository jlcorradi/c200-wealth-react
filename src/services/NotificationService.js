import {http} from '../Http';

const ENDPOINT = '/api/v1/notifications';

const NotificationService = {
  markAsRead: (id) => http.put(`${ENDPOINT}/read/${id}`),
};

export default NotificationService;
