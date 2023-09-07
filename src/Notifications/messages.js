import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  notificationTitle: {
    id: 'notification.title',
    defaultMessage: 'Notifications',
    description: 'Notifications',
  },
  notificationTodayHeading: {
    id: 'notification.today.heading',
    defaultMessage: 'Last 24 hours',
    description: 'Today Notifications',
  },
  notificationEarlierHeading: {
    id: 'notification.earlier.heading',
    defaultMessage: 'Earlier',
    description: 'Earlier Notifications',
  },
  notificationMarkAsRead: {
    id: 'notification.mark.as.read',
    defaultMessage: 'Mark all as read',
    description: 'Mark all Notifications as read',
  },
  fullStop: {
    id: 'notification.fullStop',
    defaultMessage: '•',
    description: 'Fullstop shown to users to indicate who edited a post.',
  },
  loadMoreNotifications: {
    id: 'notification.load.more.notifications',
    defaultMessage: 'Load more notifications',
    description: 'Load more button to load more notifications',
  },
  feedback: {
    id: 'notification.feedback',
    defaultMessage: 'Feedback',
    description: 'text for feedback widget',
  },
  allRecentNotificationsMessage: {
    id: 'notification.recent.all.message',
    defaultMessage: 'That’s all of your recent notifications!',
    description: 'Message visible when all notifications are loaded',
  },
  expiredNotificationsDeleteMessage: {
    id: 'notification.expired.delete.message',
    defaultMessage: 'Notifications are automatically cleared after {days} days',
    description: 'Message showing that expired notifications will be deleted',
  },
});

export default messages;
