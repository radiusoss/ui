import * as React from 'react'
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar'
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import { TextField } from 'office-ui-fabric-react/lib/TextField'
import { connect } from 'react-redux'
import { autobind } from 'office-ui-fabric-react/lib/Utilities'
import * as isEqual from 'lodash.isequal'
import { toastr } from 'react-redux-toastr'
import { NotebookStore } from './../../store/NotebookStore'
import NotebookApi from './../../api/notebook/NotebookApi'
import FabricIcon from '../../components/FabricIcon'
import history from './../../history/History'
import { IConfig, emptyConfig } from './../../api/config/ConfigApi'
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona'
import { mapDispatchToPropsConfig, mapStateToPropsConfig } from '../../actions/ConfigActions'
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from './../../actions/NotebookActions'
import { mapStateToPropsAuth, mapDispatchToPropsAuth } from '../../actions/AuthActions'
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox'
import { SwatchColorPicker } from 'office-ui-fabric-react/lib/SwatchColorPicker'
import GoogleProfileWidget from './../profile/GoogleProfileWidget'
import ClusterCapacity from './../cluster/ClusterCapacity'
import ClusterUsageStatus from './../cluster/ClusterUsageStatus'
import ClusterStatus from './../cluster/ClusterStatus'
import ReservationsStatus from './../reservations/ReservationsStatus'
import HDFStatus from './../hdfs/HDFSStatus'
import SparkStatus from './../spark/SparkStatus'
import RunningStatus from './../run/RunningStatus'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../network/NetworkStatus'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ControlHeader extends React.Component<any, any> {
  private notebookApi: NotebookApi

  state = {
    config: emptyConfig,
    statusPanel: '',
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob)
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window['NotebookApi']
  }

  public render() {
    const { statusPanel, profilePhoto } = this.state
    return (
      <div>
        <div style={{ float: 'right', padding: '0px 10px' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); this.setState({statusPanel: 'profile'}) }}>
            <Persona
              imageUrl = { profilePhoto }
              hidePersonaDetails = { true }
              presence = { PersonaPresence.online }
              size = { PersonaSize.extraSmall }
              className = "text-center"
            />
          </a>
        </div>
        <div style={{ float: 'right' }}>
          <SwatchColorPicker
            columnCount={ 9 }
            cellShape={ 'circle' }
            colorCells={
            [
              { id: 'cluster', label: 'Cluster', color: 'green' },
              { id: 'usage', label: 'Usage', color: 'red' },
              { id: 'hdfs', label: 'HDFS', color: 'green' },
              { id: 'spark', label: 'Spark', color: 'yellow' },
              { id: 'running', label: 'Running', color: 'blue' },
              { id: 'network', label: 'Network', color: 'green' },
              { id: 'reservations', label: 'Reservations', color: 'yellow' }
            ]
            }
            onCellFocused={(id?: string, color?: string) => {
            if (id) {
                this.setState({
                statusPanel: id
                })
            }
            }}
          />
        </div>
        <Panel
          isBlocking={ true }
          isOpen={ statusPanel != '' }
          type={ PanelType.medium }
          onDismiss={() => this.setState({statusPanel: ''})}
        >
        <div>
          {(statusPanel == 'profile') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Accounts" /> Profile</div>
            <GoogleProfileWidget/>
          </div>
          }
          {
            (statusPanel == 'cluster') &&
            <div>
              <div className="ms-font-su"><FabricIcon name="Health" /> Cluster</div>
              <ClusterStatus/>
            </div>
          }
          {
            (statusPanel == 'usage') &&
            <div>
              <div className="ms-font-su"><FabricIcon name="TFVCLogo" /> Usage</div>
              <ClusterUsageStatus/>
            </div>
          }
          {
            (statusPanel == 'hdfs') &&
            <div>
              <div className="ms-font-su"><FabricIcon name="OfflineStorageSolid" /> HDFS</div>
              <HDFStatus/>
            </div>
          }
          {
            (statusPanel == 'spark') &&
            <div>
              <div className="ms-font-su"><FabricIcon name="LightningBolt" /> Spark</div>
              <SparkStatus/>
            </div>
          }
          {
            (statusPanel == 'running') &&
            <div>
              <div className="ms-font-su"><FabricIcon name="Running" /> Running</div>
              <RunningStatus/>
            </div>
          }
          {
            (statusPanel == 'reservations') &&
            <div>
              <div className="ms-font-su"><FabricIcon name="Clock" /> Reservations</div>
              <ReservationsStatus/>
            </div>
          }
          {
            (statusPanel == 'network') &&
            <div>
              <div className="ms-font-su"><FabricIcon name="NetworkTower" /> Network</div>
              <NetworkStatus/>
            </div>
          }
          </div>
        </Panel>
      </div>
    )
  }

  public componentWillReceiveProps(nextProps) {
    const { config, runningParagraphs } = nextProps
    if (config && ! isEqual(config, this.state.config)) {
      this.setState({
        config: config
      })
    }
  }

}
