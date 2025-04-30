import React from 'react'
import { epochtoReadable } from '../../../utils/timeDateCalcs'

export default function NewChatMessage({notification}) {

    const notificationDateTime = epochtoReadable(notification.dateTime,'short');

    return (
    <div className='info-tile notification'>
    <p>You have received a new message from {notification.userName}</p>
    <span>{notificationDateTime}</span>
    </div>
  )
}
