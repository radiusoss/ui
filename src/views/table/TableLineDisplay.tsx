import * as React from 'react'
import TableBaseDisplay from './_TableBaseDisplay'
import {Line} from 'react-chartjs-2'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class TableLineDisplay extends TableBaseDisplay {
  lineData = {}

  constructor(props) {
    super(props)
    const { columns, items } = props
    this.lineData = this.prepareData(columns, items, this.lineData)
  }

  render() {
    return (
      <div className={styles.overflowYOverlay} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <Line
          data={this.lineData}
          options={this.options}
        />
      </div>
    )
  }

}
