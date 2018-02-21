import * as React from 'react'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class Help extends React.Component<any, any> {

  render() {
    return (
      <div>
        <div className={styles.editorHeight} style={{ width: "100%" }}>
          <iframe src="https://github.com/datalayer/datalayer/issues" className={styles.editorHeight} style={{ width: "100%" }}></iframe>
        </div>
      </div>
    )
  }

}
