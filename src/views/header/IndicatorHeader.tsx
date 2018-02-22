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
import ClusterUsage from './../cluster/ClusterUsage'
import ClusterHealth from './../cluster/ClusterHealth'
import ClusterReservations from './../cluster/ClusterReservations'
import HDFStatus from './../hdfs/HDFSStatus'
import SparkStatus from './../spark/SparkStatus'
import CurrentJobs from './../jobs/CurrentJobs'
import SpitfireInterpretersStatus from './../spitfire/SpitfireInterpretersStatus'
import NetworkStatus from './../network/NetworkStatus'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
@connect(mapStateToPropsConfig, mapDispatchToPropsConfig)
@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
export default class ControlHeader extends React.Component<any, any> {
  private config: IConfig = emptyConfig
  private notebookApi: NotebookApi

  state = {
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
                { id: 'cluster-capacity', label: 'Cluster Capacity', color: 'green' },
                { id: 'cluster-usage', label: 'Cluster Usage', color: 'green' },
                { id: 'cluster-health', label: 'Cluster Health', color: 'green' },
                { id: 'reservations', label: 'Reservations', color: 'yellow' },
                { id: 'hdfs', label: 'HDFS Status', color: 'green' },
                { id: 'interpreters', label: 'Interpreter Status', color: 'red' },
                { id: 'spark', label: 'Spark Status', color: 'yellow' },
                { id: 'jobs', label: 'Current Jobs', color: 'blue' },
                { id: 'network', label: 'Network Status', color: 'green' }
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
          {(statusPanel == 'cluster-capacity') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="CircleHalfFull" /> Cluster Capacity</div>
            <ClusterCapacity/>
          </div>
          }
          {(statusPanel == 'cluster-usage') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Frigid" /> Cluster Usage</div>
            <ClusterUsage/>
          </div>
          }
          {(statusPanel == 'cluster-health') &&
          <div>
              <div className="ms-font-su"><FabricIcon name="Health" /> Cluster Health</div>
              <ClusterHealth/>
          </div>
          }
          {(statusPanel == 'reservations') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Clock" /> Reservations</div>
            <ClusterReservations/>
          </div>
          }
          {(statusPanel == 'hdfs') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="OfflineStorageSolid" /> HDFS</div>
            <HDFStatus/>
          </div>
          }
          {(statusPanel == 'interpreters') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Light" /> Interpreters</div>
            <SpitfireInterpretersStatus/>
          </div>
          }
          {(statusPanel == 'spark') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="LightningBolt" /> Spark</div>
            <SparkStatus/>
          </div>
          }
          {(statusPanel == 'jobs') &&
          <div>
            <div className="ms-font-su"><FabricIcon name="Clock" /> Jobs</div>
            <CurrentJobs/>
          </div>
          }
          {(statusPanel == 'network') &&
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
    const { config } = nextProps
    if (config && ! isEqual(config, this.config)) {
      this.config = config
    }
  }

}
