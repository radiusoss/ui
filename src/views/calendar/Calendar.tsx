import * as React from 'react'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import NotebookApi from './../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

export interface CalendarProps {
  defaultView?: string
  toolbar: boolean
  events: any
}

@DragDropContext(HTML5Backend)
export default class Calendar extends React.Component<CalendarProps, any> {
  private notebookApi: NotebookApi

  public static defaultProps: Partial<CalendarProps> = {
    defaultView: 'week',
    toolbar: true,
    events: []
  }

  public constructor(props) {
    super(props)
    this.state = {
      defaultView: props.defaultView,
      toolbar: props.toolbar,
      events: props.events
    }
    this.notebookApi = window['NotebookApi']
  }

  public render() {

    const { events, defaultView, toolbar } = this.state

    return (
      <div style={{ height: 1000}}>
        <DragAndDropCalendar
          selectable
          resizable
          popup
          events={events}
          defaultView={defaultView}
          toolbar={toolbar}
          step={15}
          timeslots={2}
          scrollToTime={new Date(2018, 0, 1)}
          defaultDate={new Date()}
          onEventDrop={this.moveEvent}
          onEventResize={this.resizeEvent}
          onSelectEvent={event => this.onSelectEvent(event)}
          onSelectSlot={slotInfo =>this.onSelectSlot(slotInfo)}
        />
      </div>
    )

  }

  @autobind
  private onSelectEvent(event) {
    console.log('onSelectEvent', event)
  }

  @autobind
  private onSelectSlot(slotInfo) {
    console.log('onSelectSlot', slotInfo)
    var events = this.state.events
    events.push({
      id: events.length + 1,
      title: 'CLUSTER UP',
      start: slotInfo.start,
      end: slotInfo.end,
      desc: 'CLUSTER UP',
    })
    this.setState({
      events: events
    })
  }

  @autobind
  private moveEvent({ event, start, end }) {
    const { events } = this.state
    const idx = events.indexOf(event)
    const updatedEvent = { ...event, start, end }
    const nextEvents = [...events]
    nextEvents.splice(idx, 1, updatedEvent)
    this.setState({
      events: nextEvents
    })
  }

  @autobind
  private resizeEvent(resizeType, { event, start, end }) {
    const { events } = this.state
    const nextEvents = events.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })
    this.setState({
      events: nextEvents
    })
  }

}
