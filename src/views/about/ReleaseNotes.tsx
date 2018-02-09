import * as React from 'react'
import Highlights from './Highlights'

export default class ReleaseNotes extends React.Component<any, any> {

  public render() {
    return (
      <div className="ms-scaleDownIn100">
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 ms-textAlignCenter">
              <div className="ms-font-su">Datalayer Science Platform</div>
              <div className="ms-font-xxl">Release Notes</div>
            </div>
          </div>
          <div className="ms-Grid-row">
            <hr/>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <p className="ms-font-xxl">Version 1.0.0</p>
              <img src="img/releases/arcadia.png" style={{ maxHeight: 150 }} />
              <p className="ms-font-xl">#Arcadia</p>
              <p>The release `1.0.0` of the `Datalayer Science Platform` contains the following features.</p>
              <ul>
                <li>Google Authentication</li>
                <li>Spitfire Shiro Authentication</li>
                <li>Basic User Management with Authorized Users</li>
                <li>Fully Operational Note Lines View</li>
                <li>Scratchpad Note</li>
                <li>Notebook Title</li>
                <li>Cluster Calendar with On-Off Slots</li>
                <li>Board and Side Views: Day Calendar + Cluster Usage + Latests Paragraphs</li>
              </ul>
            </div>
          </div>
          <div className="ms-Grid-row">
            <hr/>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <p className="ms-font-xxl">Version 0.1.0</p>
              <img src="img/releases/omalley.png" style={{ maxHeight: 150 }} />
              <p className="ms-font-xl">#OMalley</p>
              <p>
              The release `0.1.0` of the `Datalayer Science Platform` contains the following features.
              </p>
              <ul>
                <li>Twitter Profile page</li>
                <li>Paragraphs Tile View</li>
                <li>Notes Tile View</li>
                <li>Format HDFS only if needed</li>
                <li>Fetch K8s API for settings/config and settings/k8s</li>
                <li>Remount HDFS Volumes on restart</li>
                <li>Configure pull timeout (--runtime-request-timeout 4m0s on kubevar service)</li>
                <li>Ensure fixed IP address for K8S Master</li>
                <li>Manage HDFS with cluster-id</li>
              </ul>              
            </div>
          </div>
          <div className="ms-Grid-row">
            <hr/>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
              <p className="ms-font-xxl">Version 0.0.1</p>
              <img src="img/releases/basic-1.jpg" style={{ maxHeight: 150 }} />
              <p className="ms-font-xl">#Basic</p>
              <p>Version 0.0.1 is the very first release of the Datalayer Science Platform. Follow the provided <a href="http://docs.datalayer.io/docs/install">quick start install guide</a> to deploy your first cluster.</p>
              <p>You will get as many as you want Zeppelin based Notebooks with with Apache Spark (data analytics) and Apache Hadoop (distributed file system) running natively on Kubernetes in [Amazon AWS Cloud](https://aws.amazon.com).</p>
              <p>Last but not least, we also ship the premises of Kuber Board, a nice user interface to control your cluster which also acts as a collaborative Data Science Notebook to share datasets analysis with authentication via Twitter OAuth.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
