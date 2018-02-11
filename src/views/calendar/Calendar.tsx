import * as React from 'react'
import BigCalendar from 'react-big-calendar'
import CalendarSpl from './../../spl/CalendarSpl'
import NotebookApi from './../../api/notebook/NotebookApi'

export interface CalendarProps {
  defaultView?: string
}

export default class Calendar extends React.Component<any, any> {
  private notebookApi: NotebookApi

  public static defaultProps: Partial<CalendarProps> = {
    defaultView: 'week'
  }

  state = {
    defaultView: "week"
  }

  public constructor(props) {
    super(props)
    this.state = {
      defaultView: props.defaultView
    }
    this.notebookApi = window['NotebookApi']
  }

  public render() {

    const { defaultView } = this.state

    return (
      <div style={{ height: 1000}}>
        <BigCalendar
          selectable
          events={CalendarSpl}
          defaultView={defaultView}
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

}
