import * as React from 'react'
import { createRenderer } from 'react-test-renderer/shallow'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { expect } from 'chai'

describe('Badge', () => {
  var renderer = createRenderer()

  it('should render children', () => {
    renderer.render(<Link>Yo!</Link>)
    var result = renderer.getRenderOutput();
    expect(result.type).equal('span');
    expect(result.props.children).equal('Yo!');
  })

  it('should render badges with default color', () => {
    renderer.render(<Link>Default Badge</Link>)
    var result = renderer.getRenderOutput()
    expect(result.props.className).contain("badge-default");
  })

  it('should render Badges with other colors', () => {
    renderer.render(<Link color="danger">Danger Badge</Link>)
    var result = renderer.getRenderOutput()
    expect(result.props.className).contain("badge-danger")
  })
/*
  it('should render Badges as pills', () => {
    renderer.render(<Link pill>Pill Badge</Link>)
    var result = renderer.getRenderOutput()
    expect(result.props.className).contain("badge-pill")
  })
*/
})
