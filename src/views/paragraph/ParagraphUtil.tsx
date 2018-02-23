import * as React from 'react'
import * as moment from 'moment'
import 'moment-duration-format'

export const ParagraphStatus = {
  READY: 'READY',
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  FINISHED: 'FINISHED',
  ABORT: 'ABORT',
  ERROR: 'ERROR'
}

export let isParagraphRunning = (paragraph) => {
  if (!paragraph) return false
  var status = paragraph.status
  if (!status) return false
  return status === ParagraphStatus.PENDING || status === ParagraphStatus.RUNNING
}  

export let getExecutionTime = function (pdata) {
  var momentDurationFormatSetup = require("moment-duration-format")
  const end = pdata.dateFinished
  const start = pdata.dateStarted
  let timeMs = Date.parse(end) - Date.parse(start)
  if (isNaN(timeMs) || timeMs < 0) {
    if (isResultOutdated(pdata)) {
      return <div>'outdated'</div>
    }
    return <div></div>
  }
  const durationFormat = moment.duration((timeMs / 1000), 'seconds').format('h [hrs] m [min] s [sec]')
  const endFormat = moment(pdata.dateFinished).format('MMMM DD YYYY, h:mm:ss A')
  let user = (pdata.user === undefined || pdata.user === null) ? 'anonymous' : pdata.user
  let desc = `Took ${durationFormat}. Last updated by ${user} at ${endFormat}.`
  if (isResultOutdated(pdata)) { desc += ' (outdated)' }
  return <div>{desc}</div>
}

export let getElapsedTime = function (paragraph) {
  return <div>{'Started ' + moment(paragraph.dateStarted).fromNow() + '.'}</div>
}

export let isResultOutdated = function (pdata) {
  if (pdata.dateUpdated !== undefined && Date.parse(pdata.dateUpdated) > Date.parse(pdata.dateStarted)) {
    return true
  }
  return false
}
