import React from "react";
//@ts-ignore
import { useGlobalState, GlobalActions } from "../store/GlobalStateContext";
import moment from "moment";
import classNames from "classnames";
import { NotificationService } from "../services/NotificationService";
import { NotificationEntity } from "../types/notification";

export function NotificationWidget() {
  const {
    state: { notifications },
    actions: { loadNotifications },
  } = useGlobalState();

  function Notification({
    notification,
  }: {
    notification: NotificationEntity;
  }) {
    return (
      <div
        className={classNames("flex flex-column border-top highlight-hover", {
          "text-italic": !notification.read,
        })}
      >
        <div className="flex flex-row align-items-space-between">
          <div className="flex flex-row flex-1">
            <strong className="flex-1">{notification.subject}</strong>
            <span className="italic">
              {moment(notification.notificationDate, "dd/MM/yyyy").fromNow(
                false
              )}
            </span>
          </div>
        </div>
        <p>{notification.text}</p>
        <div className="buttons">
          <a
            href="#read"
            className="info"
            onClick={(e) => {
              e.preventDefault();
              NotificationService.markAsRead(notification.id).then(() =>
                loadNotifications()
              );
            }}
          >
            <i className="bx bx-check-double"></i>
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="titlebar padding-v">
        <strong>Notifications</strong>
      </div>
      <div className="flex flex-column padding-top">
        {
          //@ts-ignore
          notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} />
          ))
        }
      </div>
    </>
  );
}
