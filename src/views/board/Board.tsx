import * as React from 'react'
import { Icon } from 'office-ui-fabric-react/lib/Icon'
import NotYetAvailable from './../message/NotYetAvailable'

export default class Board extends React.Component<any, any> {

  public render() {

    return (
      <div className="ms-Grid ms-fadeIn500">
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <Icon iconName='ReadingMode' className='ms-Icon50 ms-IconColorExample-deepSkyBlue' />
           </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <Icon iconName='World' className='ms-Icon50 ms-IconColorExample-greenYellow' />
          </div>
          <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
            <Icon iconName='Calendar' className='ms-Icon50 ms-IconColorExample-salmon' />
          </div>
        </div>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
            <NotYetAvailable/>
          </div>
        </div>
      </div>
    )

  }

}
