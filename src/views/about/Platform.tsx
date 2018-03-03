import * as React from 'react'
import history from './../../history/History'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class Platform extends React.Component<any, any> {

  public render() {
    return (
      <div className={`${styles.homeHeight}`} style={{overflowY: 'auto'}}>
        <div className="ms-fadeIn500">
          <div className="ms-Grid">
            <div className="ms-Grid-row">
              <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
                <div>
                  <p className="ms-font-su">Datalayer Science Platform</p>
                  <p className="ms-font-xxl">Version 0.0.2 #Arcadia</p>
                  <p className="ms-font-xxl"><a href="/#/dla/about/release-notes">Release Notes</a></p>                  
{/*
                  <p className="ms-font-xl">Simple. Collaborative. Multi Cloud. Big Data Science</p>
*/}
                  <img src="/img/datalayer/datalayer-square-name.png" style={{ width: '300px' }}/>
                  <p className="ms-font-xl">&copy; 2018 <a href="http://datalayer.io" target="_blank">http://datalayer.io</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
