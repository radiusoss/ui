import * as React from 'react'
import { connect } from 'react-redux'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../../actions/NotebookActions'
import NotebookApi from './../../api/notebook/NotebookApi'
import JSONTree from 'react-json-tree'
import { json_theme_monokai } from './../../theme/Themes'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { DetailsList, IGroup } from 'office-ui-fabric-react/lib/DetailsList'
import { createListItems, createGroups } from '../../util/msc/data'
import './../_styles/DetailsList.scss'

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class SpitfireInterpreters extends React.Component<any, any> {
  private notebookApi: NotebookApi

  public constructor(props) {
    super(props)
    this.state = {
      interpreterSettings: {}
    }
    this.notebookApi = window["NotebookApi"]
  }

  public render() {
    const { interpreterSettings } = this.state
    var out = ''
    if (interpreterSettings && interpreterSettings.result) {
      out = interpreterSettings.result.body.map((i) => {
        return i.interpreterGroup.map((ig) => {
          return <div className="ms-Grid-row" style={{padding: 0}} key={i.name + '-' + ig.name}>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <div className="ms-fontSize-l">%{i.name}</div>
            </div>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <div className="ms-fontSize-l">%{i.name}.{ig.name}</div>
            </div>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <div className="ms-fontSize-l">{ig.class}</div>
            </div>
          </div>
        })
      })
    }
    return (
      <div>
        <div className="ms-font-xxl">Spitfire Interpreters</div>
        <div className="ms-Grid" style={{padding: 0}}>
          {out}
        </div>
        <hr/>
        <div className="ms-font-xl">Complete Definition</div>
        <div className="ms-Grid" style={{ padding: 0 }}>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <div style={{ padding: "10px", backgroundColor: "rgb(39,40,34)" }}>
                <JSONTree
                  data={interpreterSettings} 
                  theme={json_theme_monokai}
                  invertTheme={false}
                  hideRoot={true}
                  sortObjectKeys={true}
                  shouldExpandNode={(keyName, data, level) => true}
                  />
              </div>
            </div>
          </div>
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
    var interpreterSettings = this.notebookApi.interpreterSetting().then(interpreterSettings => {
      this.setState({
        interpreterSettings: interpreterSettings
      })
    })
  }

}
