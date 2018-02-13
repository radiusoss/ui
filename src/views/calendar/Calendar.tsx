import * as React from 'react'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import { mapStateToPropsKuber, mapDispatchToPropsKuber } from '../../actions/KuberActions'
import { NotebookStore } from './../../store/NotebookStore'
import NotebookApi from './../../api/notebook/NotebookApi'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import KuberApi from '../../api/kuber/KuberApi'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

const DragAndDropCalendar = withDragAndDrop(BigCalendar)

export interface CalendarProps {
  defaultView?: string
  toolbar: boolean
  slots: any
}

@DragDropContext(HTML5Backend)
@connect(mapStateToPropsKuber, mapDispatchToPropsKuber)
export default class Calendar extends React.Component<CalendarProps, any> {
  private notebookApi: NotebookApi
  private k8sApi: KuberApi

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
    this.k8sApi = window['KuberApi']
  }

  public render() {
    const { slots, defaultView, toolbar } = this.state
    return (
      <div className={styles.rendererHeight}>
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
  public async componentDidMount() {
    this.k8sApi.getSlots()
  }

  public componentWillReceiveProps(nextProps) {
    const { kuberMessageReceived } = nextProps
    if (kuberMessageReceived && kuberMessageReceived.op) {
      console.log('---', kuberMessageReceived)
      if (kuberMessageReceived.op == "GET_SLOTS") {
        this.setState({
          slots: kuberMessageReceived.slots.map(s => {
            s.start = new Date(s.start)
            s.end = new Date(s.end)
            return s
          })
        })
      }
    }
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
    this.k8sApi.putSlots(slots)
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
