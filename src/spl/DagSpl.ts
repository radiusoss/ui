import { 
  STANDARD_TYPE, EMPTY_TYPE, STANDARD_CHILD_SUBTYPE,
  EMPTY_EDGE_TYPE, STANDARD_EDGE_TYPE
} from './../views/util/FlowShapes'

export const dagSample = {
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
