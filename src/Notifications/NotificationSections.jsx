/* eslint-disable react/forbid-prop-types */
import React, { useCallback, useMemo } from 'react';
import {
  Button, Icon, Spinner, IconButton,
} from '@edx/paragon';
import { AutoAwesome, CheckCircleLightOutline, NotificationsNone } from '@edx/paragon/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import messages from './messages';
import NotificationRowItem from './NotificationRowItem';
import { markAllNotificationsAsRead, fetchNotificationList } from './data/thunks';
import {
  selectExpiryDays, selectNotificationsByIds, selectPaginationData,
  selectSelectedAppName, selectNotificationListStatus, selectNotificationTabs,
} from './data/selectors';
import { splitNotificationsByTime } from './utils';
import { RequestStatus } from './data/slice';

const NotificationSections = ({ popoverHeaderRef }) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const selectedAppName = useSelector(selectSelectedAppName);
  const notificationRequestStatus = useSelector(selectNotificationListStatus);
  const notifications = useSelector(selectNotificationsByIds(selectedAppName));
  const { hasMorePages, currentPage } = useSelector(selectPaginationData);
  const notificationTabs = useSelector(selectNotificationTabs);
  const expiryDays = useSelector(selectExpiryDays);
  const { today = [], earlier = [] } = useMemo(
    () => splitNotificationsByTime(notifications),
    [notifications],
  );
  const trayRef = document.getElementById('notificationTray');

  const handleMarkAllAsRead = useCallback(() => {
    dispatch(markAllNotificationsAsRead(selectedAppName));
  }, [dispatch, selectedAppName]);

  const loadMoreNotifications = useCallback(() => {
    dispatch(fetchNotificationList({ appName: selectedAppName, page: currentPage + 1 }));
  }, [currentPage, dispatch, selectedAppName]);

  const renderNotificationSection = (section, items) => {
    if (isEmpty(items)) { return null; }

    return (
      <div className="pb-2">
        <div className="d-flex justify-content-between align-items-center py-10px mb-2">
          <span className="text-gray-500 line-height-10">
            {section === 'today' && intl.formatMessage(messages.notificationTodayHeading)}
            {section === 'earlier' && intl.formatMessage(messages.notificationEarlierHeading)}
          </span>
          {notifications?.length > 0 && (section === 'earlier' ? today.length === 0 : true) && (
            <Button
              variant="link"
              className="font-size-14 line-height-10 text-decoration-none p-0 border-0 text-info-500"
              onClick={handleMarkAllAsRead}
              data-testid="mark-all-read"
            >
              {intl.formatMessage(messages.notificationMarkAsRead)}
            </Button>
          )}
        </div>
        {items.map((notification) => (
          <NotificationRowItem
            key={notification.id}
            id={notification.id}
            type={notification.notificationType}
            contentUrl={notification.contentUrl}
            content={notification.content}
            courseName={notification.contentContext?.courseName || ''}
            createdAt={notification.created}
            lastRead={notification.lastRead}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={classNames('px-4', {
        'mt-4': notificationTabs.length > 1,
        'pb-3.5': notifications.length > 0,
      })}
      data-testid="notification-tray-section"
    >
      {renderNotificationSection('today', today)}
      {renderNotificationSection('earlier', earlier)}
      {(hasMorePages === undefined || hasMorePages) && notificationRequestStatus === RequestStatus.IN_PROGRESS ? (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" variant="primary" size="lg" data-testid="notifications-loading-spinner" />
        </div>
      ) : (hasMorePages && notificationRequestStatus === RequestStatus.SUCCESSFUL && (
        <Button
          variant="primary"
          className="w-100 bg-primary-500"
          onClick={loadMoreNotifications}
          data-testid="load-more-notifications"
        >
          {intl.formatMessage(messages.loadMoreNotifications)}
        </Button>
      )
      )}
      {
        notifications.length > 0 && !hasMorePages && notificationRequestStatus === RequestStatus.SUCCESSFUL && (
          <div
            className="d-flex flex-column my-5"
            data-testid="notifications-list-complete"
          >
            <Icon className="mx-auto icon-size-56" src={CheckCircleLightOutline} />
            <div className="mx-auto mb-3 font-size-22 notification-end-title line-height-24">
              {intl.formatMessage(messages.allRecentNotificationsMessage)}
            </div>
            <div className="d-flex flex-row mx-auto text-gray-500">
              <Icon src={AutoAwesome} />
              <span className="font-size-14 line-height-normal">
                {intl.formatMessage(messages.expiredNotificationsDeleteMessage, { days: expiryDays })}
              </span>
            </div>
          </div>
        )
      }

      {notifications.length === 0 && notificationRequestStatus === RequestStatus.SUCCESSFUL
       && trayRef && popoverHeaderRef.current && (
       <div
         className="d-flex flex-column justify-content-center align-items-center"
         data-testid="notifications-list-complete"
         style={{ height: `${trayRef.clientHeight - popoverHeaderRef.current.clientHeight}px` }}
       >
         <IconButton
           isActive
           alt="notification bell icon"
           src={NotificationsNone}
           iconAs={Icon}
           variant="light"
           id="bell-icon"
           iconClassNames="text-primary-500"
           className="ml-4 mr-1 notification-button notification-lg-bell-icon"
           data-testid="notification-bell-icon"
         />
         <div className="mx-auto mt-3.5 mb-3 font-size-22 notification-end-title line-height-24">
           {intl.formatMessage(messages.noNotificationsYetMessage)}
         </div>
         <div className="d-flex flex-row mx-auto text-gray-500">
           <span className="font-size-14 line-height-normal">
             {intl.formatMessage(messages.noNotificationHelpMessage)}
           </span>
         </div>
       </div>
      )}
    </div>
  );
};

NotificationSections.propTypes = {
  popoverHeaderRef: PropTypes.object,
};

NotificationSections.defaultProps = {
  popoverHeaderRef: null,
};

export default React.memo(NotificationSections);
