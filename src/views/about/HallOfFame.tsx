import * as React from 'react'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class HallOfFame extends React.Component<any, any> {

  public render() {
    return (
      <div className="ms-fadeIn500">
        <span>
          <ul className={ styles.featureList } style={{listStyle: "none"}}>
            <li>
              <img src="/img/hall-of-fame/eric-charles.png" width="100"/>
              <div className="ms-font-xl">Eric Charles</div>
            </li>
            <li>
              <img src="/img/hall-of-fame/ingrid-bayart.jpg" width="100"/>
              <div className="ms-font-xl">Ingrid Bayart</div>
            </li>
            <li>
              <img src="/img/hall-of-fame/benoit-marion.jpg" width="100"/>
              <div className="ms-font-xl">Benoit Marion</div>
            </li>
          </ul>
        </span>
      </div>
    )
  }

}
