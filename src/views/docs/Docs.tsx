import * as React from 'react'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class Docs extends React.Component<any, any> {

  public render() {
    return (
      <div className={styles.editorHeight} style={{ width: "100%" }}>
         <iframe src="http://docs.datalayer.io/docs/home" className={styles.editorHeight} style={{ width: "100%" }}></iframe> 
      </div>
    )
  }

}
