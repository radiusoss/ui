import * as React from 'react'
import Calendar from './../calendar/Calendar'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ClusterReservations extends React.Component<any, any> {
/*
TODO(ECH) Jaugue + Action if no Reservation
*/
public render() {
    return (
      <div>
        <div className="ms-font-xxl">Cluster Reservations</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Calendar 
                defaultView='agenda' 
                toolbar={false}
                slots={[
                  {
                    id: 0,
                    title: 'A Day Event very long title',
                    allDay: false,
                    start: new Date(2018, 1, 11, 10, 0, 0, 0),
                    end: new Date(2018, 1, 11, 19, 0, 0, 0),
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

}
