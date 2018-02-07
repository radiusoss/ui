import * as React from 'react'
import BigCalendar from 'react-big-calendar'
import events from './Events'
import * as moment from 'moment'
import NotebookApi from './../../api/notebook/NotebookApi'
// import * as stylesImport from '.  /react-big-calendar/lib/less/styles.less'

export default class Calendar extends React.Component<any, any> {
  private notebookApi: NotebookApi

  public constructor(props) {
    super(props)
    this.notebookApi = window['NotebookApi']
    BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
  }

  public render() {
    return (
      <div style={{ height: 1000}}>
        <BigCalendar
          selectable
          events={events}
          defaultView="week"
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
    )
  }

  public componentDidMount() {
  }

}
