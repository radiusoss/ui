import * as React from 'react'
import HighlightsWidget from './HighlightsWidget'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class Highlights extends React.Component<any, any> {

  public render() {

    return (
      <div className={`${styles.homeHeight}`} style={{overflowY: 'scroll'}}>
        <HighlightsWidget showAll="true" />
      </div>
    )

  }

}
