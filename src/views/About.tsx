import * as React from 'react'

export default class About extends React.Component<any, any> {

  public render() {

    return (

      <div>

        <div className="ms-Grid">

          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
              <h1>Kuber Plane</h1>
              <h2>Collect. Explore. Model. Serve.</h2>
              <br/>
              <br/>
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4" style={{ minHeight: "200px"}}>
              <img src="/img/hadoop/spark.png" height="100px" />
            </div>
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              Apache Spark is an open-source cluster-computing framework. Originally developed at the University of California, Berkeley's AMPLab, the Spark codebase was later donated to the Apache Software Foundation, which has maintained it since.
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              Apache Hadoop is an open-source software framework used for distributed storage and processing of dataset of big data using the MapReduce programming model. It consists of computer clusters built from commodity hardware.
            </div>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4" style={{ minHeight: "200px"}}>
              <img src="/img/hadoop/hadoop.png" height="100px" />
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4" style={{ minHeight: "200px"}}>
              <img src="/img/amazon/amazon-aws-icon.svg" height="100px" />
            </div>
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              Amazon Web Services is a subsidiary of Amazon.com that provides on-demand cloud computing platforms to individuals, companies and governments, on a paid subscription basis with a free-tier option available for 12 months.
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              Microsoft Azure is a cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services through a global network of Microsoft-managed data centers. 
            </div>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4" style={{ minHeight: "200px"}}>
              <img src="/img/azure/microsoft-azure-certified.png" height="100px" />
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4" style={{ minHeight: "200px"}}>
              <img src="/img/zeppelin/zeppelin.png" height="100px" />
            </div>
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              Web-based notebook that enables data-driven, interactive data analytics and collaborative documents with SQL, 
            </div>
          </div>
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm8 ms-u-md8 ms-u-lg8">
              The Jupyter Notebook is an open-source web application that allows you to create and share documents that contain live code, equations, visualizations and narrative text. 
            </div>
            <div className="ms-Grid-col ms-u-sm4 ms-u-md4 ms-u-lg4" style={{ minHeight: "200px"}}>
              <img src="/img/jupyter/jupyter-square.png" height="100px" />
            </div>
          </div>

        </div>

      </div>

    )

  }

}
