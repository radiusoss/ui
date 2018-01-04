import * as React from 'react'
import * as stylesImport from './_styles/Styles.scss'
const styles: any = stylesImport

export default class Highlights extends React.Component<any, any> {

  public constructor(props) {
    super(props)
  }

  public render() {

    return (

      <div>

        <div className={ styles.featured }>
          <span className={ styles.featuredTitle }>Highlights</span>
          <span className={ styles.featuredDescription }>Datalayer offers a variety of elements to help you create an experience that delights users and complements Office 365.</span>
          <ul className={ styles.featureList } aria-label='List of highlighted features'>
            <li className="text-center">
              <a href='http://www.apache.org' target="_blank">
                <img src={ 'img/apache/apache.svg' } alt='' />
                <span>Apache Foundation</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://www.linuxfoundation.org' target="_blank">
                <img src={ 'img/linux/linux-foundation.svg' } alt='' />
                <span>Linux Foundation</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://kubernetes.io' target="_blank">
                <img src={ 'img/kubernetes/kubernetes_logo.png' } alt='' />
                <span>Kubernetes</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://aws.amazon.com' target="_blank">
                <img src={ 'img/aws/aws-w.svg' } alt='' />
                <span>Amazon AWS</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://microsoftmarketplace.microsoft.com/en-us/marketplace/apps/datalayer.datalayer-notebook' target="_blank">
                <img src={ 'img/azure/microsoft-azure-certified.png' } alt='' />
                <span>Microsoft Azure</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://spark.apache.org' target="_blank">
                <img src={ 'img/spark/apache-spark-w.svg' } alt='' />
                  <span>Apache Spark</span>
              </a>
            </li>
            <li className="text-center">
              <a href='http://hadoop.apache.org' target="_blank">
                <img src={ 'img/hadoop/apache-hadoop.svg' } alt='' />
                <span>Apache Hadoop</span>
              </a>
            </li>
            <li className="text-center">
              <a href='http://zeppelin.apache.org' target="_blank">
                <img src={ 'img/zeppelin/apache-zeppelin.svg' } alt='' />
                <span>Apache Zeppelin</span>
              </a>
            </li>
            <li className="text-center">
              <a href='http://datalayer.io' target="_blank">
                <img src={ 'img/spitfire/datalayer-spitfire.svg' } alt='' />
                  <span>Datalayer Spitfire</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://github.com/datalayer' target="_blank">
                <img src={ 'img/github/github-octocat.svg' } alt='' />
                <span>Github</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://www.office.com' target="_blank">
                <img src={ 'img/microsoft/microsoft-office-365.svg' } alt='' />
                <span>Office 365</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://hbase.apache.org' target="_blank">
                <img src={ 'img/hbase/apache-hbase-square.svg' } alt='' />
                <span>Apache HBase</span>
              </a>
            </li>
            <li className="text-center">
              <a href='http://janusgraph.org' target="_blank">
                <img src={ 'img/janusgraph/janusgraph.png' } alt='' />
                <span>JanusGraph</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://reactjs.org' target="_blank">
                <img src={ 'img/reactjs/reactjs.svg' } alt='' />
                <span>React.js</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://www.tensorflow.org' target="_blank">
                <img src={ 'img/tensorflow/tensorflow.svg' } alt='' />
                <span>Tensorflow</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://twitter.com' target="_blank">
                <img src={ 'img/twitter/twitter.svg' } alt='' />
                <span>Twitter</span>
              </a>
            </li>
          </ul>
          <span className={ styles.trademark }>All trademarks are the property of their respective owners.</span>
        </div>

      </div>

    )

  }

}
