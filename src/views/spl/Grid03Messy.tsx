import * as React from 'react'
import * as _ from "lodash";
import { WidthProvider } from "react-grid-layout";
import * as RGL from 'react-grid-layout'

const ReactGridLayout = WidthProvider(RGL);

export default class Grid03Messy extends React.Component<any, any> {
  static defaultProps = {
    className: "layout",
    items: 20,
    rowHeight: 30,
    onLayoutChange: function() {},
    cols: 12
  };

  constructor(props) {
    super(props);

    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), function(i) {
      return (
        <div key={i}>
          <span className="text">{i}</span>
        </div>
      );
    });
  }

  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function(item, i) {
      const w = Math.ceil(Math.random() * 4);
      const y = Math.ceil(Math.random() * 4) + 1;
      return {
        x: (i * 2) % 12,
        y: Math.floor(i / 6) * y,
        w: w,
        h: y,
        i: i.toString()
      };
    });
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <ReactGridLayout
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}
