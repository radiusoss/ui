import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import { CommandButton } from 'office-ui-fabric-react/lib/Button'
import JSONTree from 'react-json-tree'
import NotebookApi from './../../api/notebook/NotebookApi'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { DetailsList, IGroup } from 'office-ui-fabric-react/lib/DetailsList'
import { createListItems, createGroups } from '../../util/msc/data'
import './../_styles/DetailsList.scss'

const ITEMS_PER_GROUP = 20
const GROUP_COUNT = 20

var items: any[]
var groups: IGroup[]

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SpitfireInterpreters extends React.Component<any, any> {
  private notebookApi: NotebookApi

  public constructor(props) {
    super(props)
    this.state = {
      interpreterSettings: {}
    }
    this.notebookApi = window["NotebookApi"]
    items = items || createListItems(500)
    groups = groups || createGroups(GROUP_COUNT, 1, 0, ITEMS_PER_GROUP)
  }

  public render() {
    return (
      <div>
        <br/>
        <div>
          <CommandButton iconProps={ { iconName: 'Sync' } } onClick={ (e => this.restartInterpreters(e))} >Restart Interpreters</CommandButton>
        </div>
        <div style={{ padding: "10px", backgroundColor: "black" }}>
          <JSONTree 
            data={this.state.interpreterSettings} 
            theme='greenscreen'
            invertTheme={false}
          />
        </div>
{/*
        <DetailsList
          items={ items }
          groups={ groups }
          groupProps={ {
            onRenderHeader: props => (
              <div className='DetailsList-customHeader'>
                <div className='DetailsList-customHeaderTitle'>{ `I am a custom header for: ${props.group.name}` }</div>
                <div className='DetailsList-customHeaderLinkSet'>
                  <Link
                    className='DetailsList-customHeaderLink'
                    onClick={ () => props.onToggleSelectGroup(props.group) }>
                    { props.isSelected ? 'Remove selection' : 'Select group' }
                  </Link>
                  <Link
                    className='DetailsList-customHeaderLink'
                    onClick={ () => props.onToggleCollapse(props.group) }>
                    { props.group.isCollapsed ? 'Expand group' : 'Collapse group' }
                  </Link>
                </div>
              </div>
            ),
            onRenderFooter: props => (
              <div className='DetailsList-customHeader'>
                <div className='DetailsList-customHeaderTitle'>{ `I'm a custom footer for: ${props.group.name}` }</div>
              </div>
            )
          } }
        />
*/}
      </div>
    )
  }

  public async componentDidMount() {
    this.loadInterpreterSettings()
  }

  private async loadInterpreterSettings() {
    var interpreterSettings = await this.notebookApi.interpreterSetting()
    this.setState({
      interpreterSettings: interpreterSettings
    })
  }

  private async restartInterpreters(e) {
    e.stopPropagation()
    e.preventDefault()
    var interpreterSettings = this.state.interpreterSettings
    this.setState({
        interpreterSettings: {}
    })
    var body = interpreterSettings.result.body
    for (var i in body) {
      var id = body[i].id
      var name = body[i].name
      var interpreter = await this.notebookApi.restartInterpreter(id)
    }
    this.loadInterpreterSettings()
  }

}
