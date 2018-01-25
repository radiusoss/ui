import * as React from 'react'
import * as _ from "lodash";
import { WidthProvider } from "react-grid-layout";
import * as RGL from 'react-grid-layout'
import { autobind } from 'office-ui-fabric-react/lib/Utilities';

const ReactGridLayout = WidthProvider(RGL);

export default class Grid04GridProperty extends React.Component<any, any> {

  static defaultProps = {
    isDraggable: true,
    isResizable: true,
    items: 20,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12
  };

  render() {
    return (
      <ReactGridLayout onLayoutChange={ref => this.onLayoutChange(ref)} {...this.props}>
        {this.generateDOM()}
      </ReactGridLayout>
    )
  }

  generateDOM() {
    // Generate items with properties from the layout, rather than pass the layout directly
    const layout = this.generateLayout();
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div key={i} data-grid={layout[i]}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      var w = _.result(p, "w") || Math.ceil(Math.random() * 4);
      var y = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: w,
        h: y,
        i: i.toString()
      };
    });
  }

  @autobind
  onLayoutChange(layout) {
    console.log('onLayoutChange', layout)
//    this.props.onLayoutChange(layout);
  }

}
