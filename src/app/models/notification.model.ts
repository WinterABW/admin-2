export interface Notification {
  id: number;
  users: any[];
  mail?: {
    subject: string,
    body: string
  };
  notification: {
    msg: string
  };
}

export function createNotification(params: Partial<Notification>) {
  return {} as Notification;
}
