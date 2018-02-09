import React from 'react'
import BigCalendar from 'react-big-calendar'
import events from '../events'

var allViews = Object.keys(BigCalendar.Views).map(k => BigCalendar.Views[k])

var Basic = () => (
  <BigCalendar
    events={events}
    views={allViews}
    step={60}
    showMultiDayTimes
    defaultDate={new Date(2015, 3, 1)}
  />
)

export default Basic
