import * as React from 'react'
import TableBaseDisplay from './_TableBaseDisplay'
import {Bar} from 'react-chartjs-2';
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class TableBarDisplay extends TableBaseDisplay {
  barData = {}

  constructor(props) {
    super(props)
    const { columns, items } = props
    this.barData = this.prepareData(columns, items, this.barData)
  }

  render() {
    const { stripDisplay } = this.props
    return (
      <div className={styles.overflowYOverlay} style={{ maxHeight: this.getHeigthStyle(stripDisplay), overflowY: 'auto' }}>
        <Bar
          data={this.barData}
          options={this.options}
        />
      </div>
    )
  }

}
