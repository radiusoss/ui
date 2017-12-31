import * as React from 'react'

//export const NODE_ID = "id"
export const NODE_ID = "noteId"

export const EMPTY_TYPE = "empty"
export const STANDARD_TYPE = "standard" 
export const STANDARD_CHILD_SUBTYPE = "standardChild"

export const EMPTY_EDGE_TYPE = "emptyEdge"
export const STANDARD_EDGE_TYPE = "standardEdge"
/*
const dagSample = {
  "nodes": [
    {
      "id": 1,
      "title": "Node A",
      "x": 258.3976135253906,
      "y": 331.9783248901367,
      "type": STANDARD_TYPE
    }, {
      "id": 2,
      "title": "Node B",
      "x": 593.9393920898438,
      "y": 260.6060791015625,
      "type": EMPTY_TYPE,
      "subtype": STANDARD_CHILD_SUBTYPE
    }, {
      "id": 3,
      "title": "Node C",
      "x": 237.5757598876953,
      "y": 61.81818389892578,
      "type": EMPTY_TYPE
    }, {
      "id": 4,
      "title": "Node D",
      "x": 600.5757598876953,
      "y": 600.81818389892578,
      "type": EMPTY_TYPE
    }, {
      "id": 5,
      "title": "Node E",
      "x": 400.5757598876953,
      "y": 600.81818389892578,
      "type": STANDARD_TYPE,
      "subtype": STANDARD_CHILD_SUBTYPE
    }
  ],
  "edges": [
    {
      "source": 1,
      "target": 2,
      "type": EMPTY_EDGE_TYPE
    }, {
      "source": 2,
      "target": 4,
      "type": STANDARD_EDGE_TYPE
    }
  ]
}
*/

const EmptyNode = (
  <symbol viewBox="0 0 100 100" id="empty" key="0">
    <circle cx="50" cy="50" r="45"></circle>
  </symbol>
)
const StandardNode = (
  <symbol viewBox="0 0 100 100" id="standard" key="1">
    <rect transform="translate(50) rotate(45)" width="70" height="70" fill="rgba(30, 144, 255, 0.12)"></rect>
  </symbol>
)
const StandardChildNode = (
  <symbol viewBox="0 0 100 100" id="standardChild" key="0">
    <rect x="2.5" y="0" width="95" height="97.5" fill="rgba(30, 144, 255, 0.12)"></rect>
  </symbol>
)
const EmptyEdge = (
  <symbol viewBox="0 0 50 50" id="emptyEdge" key="0">
    <circle cx="25" cy="25" r="8" fill="currentColor"></circle>
  </symbol>
)
const StandardEdge = (
  <symbol viewBox="0 0 50 50" id="standardEdge" key="1">
    <rect transform="rotate(45)"  x="25" y="-4.5" width="15" height="15" fill="currentColor"></rect>
  </symbol>
)

export default {
  NodeTypes: {
    empty: {
      typeText: "",
      shapeId: "#empty",
      shape: EmptyNode
    },
    standard: {
      typeText: "",
      shapeId: "#standard",
      shape: StandardNode
    }
  },
  NodeSubtypes: {
    standardChild: {
      shapeId: "#standardChild",
      shape: StandardChildNode
    }
  }, 
  EdgeTypes: {
    emptyEdge: {
      shapeId: "#emptyEdge",
      shape: EmptyEdge
    },
    standardEdge: {
      shapeId: "#standardEdge",
      shape: StandardEdge
    }
  }

}
