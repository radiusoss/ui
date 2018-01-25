import * as React from 'react'
import { WidthProvider } from "react-grid-layout";
import * as RGL from 'react-grid-layout'

const ReactGridLayout = WidthProvider(RGL);
const originalLayout = getFromLS("layout") || [];
/**
 * This layout demonstrates how to sync to localstorage.
 */
export default class Grid07Localstorage extends React.Component<any, any> {
  static defaultProps = {
    className: "layout",
    cols: 12,
    rowHeight: 30,
    onLayoutChange: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
      layout: JSON.parse(JSON.stringify(originalLayout))
    };

    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.resetLayout = this.resetLayout.bind(this);
  }

  resetLayout() {
    this.setState({
      layout: []
    });
  }

  onLayoutChange(layout) {
    /*eslint no-console: 0*/
    saveToLS("layout", layout);
    this.setState({ layout });
    this.props.onLayoutChange(layout); // updates status display
  }

  render() {
    return (
      <div>
        <button onClick={this.resetLayout}>Reset Layout</button>
        <ReactGridLayout
          {...this.props}
          layout={this.state.layout}
          onLayoutChange={this.onLayoutChange}
        >
          <div key="1" data-grid={{ w: 2, h: 3, x: 0, y: 0 }}>
            <span className="text">1</span>
          </div>
          <div key="2" data-grid={{ w: 2, h: 3, x: 2, y: 0 }}>
            <span className="text">2</span>
          </div>
          <div key="3" data-grid={{ w: 2, h: 3, x: 4, y: 0 }}>
            <span className="text">3</span>
          </div>
          <div key="4" data-grid={{ w: 2, h: 3, x: 6, y: 0 }}>
            <span className="text">4</span>
          </div>
          <div key="5" data-grid={{ w: 2, h: 3, x: 8, y: 0 }}>
            <span className="text">5</span>
          </div>
        </ReactGridLayout>
      </div>
    );
  }
}

function getFromLS(key) {
  let ls = {};
  try {
    ls = JSON.parse(localStorage.getItem("rgl-7")) || {};
  } catch (e) {
    /*Ignore*/
  }
  return ls[key];
}

function saveToLS(key, value) {
  localStorage.setItem(
    "rgl-7",
    JSON.stringify({
      [key]: value
    })
  );
}
