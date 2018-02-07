import * as React from 'react'
import Highlights from './Highlights'

export default class ReleaseNotes extends React.Component<any, any> {

  public render() {

    return (
      <div className="ms-scaleDownIn100">
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <p className="ms-font-xxl">Version 1.0.0 #Arcadia</p>
              <img src="img/releases/arcadia.png" style={{ maxHeight: 150 }} />
            </div>
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              <p>The release `1.0.0` of the `Datalayer Science Platform` contains the following features.</p>
              <ul>
                <li>Google Authentication</li>
                <li>Spitfire Shiro Authentication</li>
                <li>Basic User Management</li>
                <li>Better Note Editor</li>
                <li>Resources Requests</li>
              </ul>
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <p className="ms-font-xxl">Version 0.1.0 #OMalley</p>
              <img src="img/releases/omalley.png" style={{ maxHeight: 150 }} />
            </div>
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
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
                <li>Configure pull timeout (--runtime-request-timeout 4m0s on kubelet service)</li>
                <li>Ensure fixed IP address for K8S Master</li>
                <li>Manage HDFS with cluster-id</li>
              </ul>              
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4">
              <p className="ms-font-xxl">Version 0.0.1 #Basic</p>
              <img src="img/releases/basic-1.jpg" style={{ maxHeight: 150 }} />
            </div>
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              <p>
                Version 0.0.1 is the very first release of the Datalayer Science Platform. Follow the provided <a href="http://docs.datalayer.io/docs/install">quick start install guide</a> to deploy your first cluster.
              </p>
              <p>
                You will get as many as you want Zeppelin based Notebooks with with Apache Spark (data analytics) and Apache Hadoop (distributed file system) running natively on Kubernetes in [Amazon AWS Cloud](https://aws.amazon.com).
              </p>
              <p>
                Last but not least, we also ship the premises of Kuber Board, a nice user interface to control your cluster which also acts as a collaborative Data Science Notebook to share datasets analysis with authentication via Twitter OAuth.
              </p>
            </div>
          </div>
        </div>
      </div>
    )

  }

}
