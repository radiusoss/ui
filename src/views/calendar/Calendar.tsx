import * as React from 'react'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import { NotebookStore } from './../../store/NotebookStore'
import NotebookApi from './../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

export interface CalendarProps {
  defaultView?: string
  toolbar: boolean
  slots: any
}

@DragDropContext(HTML5Backend)
export default class Calendar extends React.Component<CalendarProps, any> {
  private notebookApi: NotebookApi

  public static defaultProps: Partial<CalendarProps> = {
    defaultView: 'week',
    toolbar: true,
    slots: []
  }

  public constructor(props) {
    super(props)
    this.state = {
      defaultView: props.defaultView,
      toolbar: props.toolbar,
      slots: props.slots
    }
    this.notebookApi = window['NotebookApi']
  }

  public render() {

    const { slots, defaultView, toolbar } = this.state

    return (
      <div style={{ height: 1000}}>
        <DragAndDropCalendar
          selectable={true}
          resizable={true}
          popup={true}
          events={slots}
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
    var slots = this.state.slots
    slots.push({
      id: slots.length + 1,
      title: 'Cluster UP - ' + NotebookStore.state().profileDisplayName,
      start: slotInfo.start,
      end: slotInfo.end,
      desc: 'Cluster UP - ' + NotebookStore.state().profileDisplayName
    })
    this.setState({
      slots: slots
    })
  }

  @autobind
  private moveEvent({ event, start, end }) {
    const { slots } = this.state
    const idx = slots.indexOf(event)
    const updatedEvent = { ...event, start, end }
    const nextEvents = [...slots]
    nextEvents.splice(idx, 1, updatedEvent)
    this.setState({
      slots: nextEvents
    })
  }

//  @autobind
//  private resizeEvent(resizeType, { event, start, end }) {
  private resizeEvent = (resizeType, { event, start, end }) => {
    console.log('resizeEvent', event)
    const { slots } = this.state
    const nextEvents = slots.map(existingEvent => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })
    this.setState({
      slots: nextEvents
    })
  }

}
