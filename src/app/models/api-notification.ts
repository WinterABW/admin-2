export interface ApiNotification {
  users: any[];
  mail?: {
    subject: string,
    body: string
  };
  notification: {
    msg: string
  };
}
