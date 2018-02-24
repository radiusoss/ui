import * as React from 'react'
import Reservations from './../reservations/Reservations'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ReservationsStatus extends React.Component<any, any> {

public render() {
    return (
      <div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <Reservations 
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
