import * as React from 'react'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import NotYetAvailable from './../message/NotYetAvailable'
import BigCalendar from 'react-big-calendar'
import CalendarSpl from './../../spl/CalendarSpl'

export default class Board extends React.Component<any, any> {

  public render() {

    return (

      <div className="ms-Grid ms-fadeIn500">

        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <NotYetAvailable/>
          </div>
        </div>

        <div className="ms-Grid-row">

          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <Icon iconName='ReadingMode' className='ms-Icon50 ms-IconColorExample-deepSkyBlue' />
           </div>

          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <Icon iconName='World' className='ms-Icon50 ms-IconColorExample-greenYellow' />
            <div className="text-uppercase mb-q mt-2">
              <small><b>CPU Usage</b></small>
            </div>
            <div className="progress progress-xs">
              <div className="progress-bar bg-info" role="progressbar" style={{ "width": "25%"}} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <small className="text-muted">348 Processes. 1/4 Cores.</small>
            <div className="text-uppercase mb-q mt-h">
              <small><b>Memory Usage</b></small>
            </div>
            <div className="progress progress-xs">
              <div className="progress-bar bg-warning" role="progressbar" style={{ "width": "70%" }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <small className="text-muted">11444GB/16384MB</small>
            <div className="text-uppercase mb-q mt-h">
              <small><b>Disk Usage</b></small>
            </div>
            <div className="progress progress-xs">
                <div className="progress-bar bg-danger" role="progressbar" style={{ "width": "95%" }} aria-valuenow="95" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <small className="text-muted">243GB/256GB</small>
          </div>

          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <Icon iconName='Calendar' className='ms-Icon50 ms-IconColorExample-salmon' />
            <div style={{ height: 1000}}>
              <BigCalendar
                selectable
                events={CalendarSpl}
                defaultView="day"
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date(2015, 3, 12)}
                onSelectEvent={event => alert(event.title)}
                onSelectSlot={slotInfo =>
                  alert(
                    `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                      `\nend: ${slotInfo.end.toLocaleString()}` +
                      `\naction: ${slotInfo.action}`
                  )
                }
              />
            </div>
          </div>

        </div>

      </div>

    )

  }

}
