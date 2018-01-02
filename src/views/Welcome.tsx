import * as React from 'react'
import * as queryString from 'query-string'
import history from './../routes/History'
import { connect } from 'react-redux'
import { AuthDispatchers, AuthProps, mapStateToPropsAuth, mapDispatchToPropsAuth } from '../actions/AuthActions'
import { NotebookStore } from './../store/NotebookStore'
import { css } from 'office-ui-fabric-react/lib/Utilities'
import { CompoundButton } from 'office-ui-fabric-react/lib/Button'
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { mapStateToPropsNotebook, mapDispatchToPropsNotebook } from '../actions/NotebookActions'
import NotebookApi from './../api/notebook/NotebookApi'
import AadApi from '../api/microsoft/AadApi'
import * as stylesImport from './_styles/Styles.scss'
const styles: any = stylesImport

@connect(mapStateToPropsNotebook, mapDispatchToPropsNotebook)
@connect(mapStateToPropsAuth, mapDispatchToPropsAuth)
export default class Welcome extends React.Component<any, any> {
  private readonly notebookApi: NotebookApi
  private aadApi: AadApi

  state = {
    isAadAuthenticated: NotebookStore.state().isAadAuthenticated,
    isTwitterAuthenticated: NotebookStore.state().isTwitterAuthenticated,
    profileDisplayName: NotebookStore.state().profileDisplayName,
    profilePhoto: window.URL.createObjectURL(NotebookStore.state().profilePhotoBlob)
  }

  public constructor(props) {
    super(props)
    this.notebookApi = window["notebookApi"]
    this.aadApi = window["aadApi"]
  }

  public render() {

    const { isAadAuthenticated, isTwitterAuthenticated, profileDisplayName, profilePhoto } = this.state

    return (

      <div>

        <div className={ styles.hero } style={{margin: '0px'}}>

          <h1 className={ styles.title }>Kuber Plane</h1>

          <span className={ styles.tagline }>Kuber is the easy way to create and manage your Big Data Science Platform on Kubernetes.</span>

          { (!isAadAuthenticated && !isTwitterAuthenticated) && 

            <div>
            
              <div className="ms-Grid" style={{ padding: 0 }}>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
                    <div className={ styles.tagline }>Choose your favorite sign-in method.</div>
                  </div>
                </div>
                <div className="ms-Grid-row">
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 text-center">
                  <a href="#" className={ css(styles.button, styles.primaryButton) } onClick={ (e) => this.onAadAuthenticateClick(e) }>Microsoft</a>
                        <div className={ styles.version }>You need a valid Microsoft account.</div>
                    </div>
                    <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6 text-center">
                      <a href="#" className={ css(styles.button, styles.primaryButton) } onClick={ (e) => this.onTwitterAuthenticateClick(e) }>Twitter</a>
                      <div className={ styles.version }>You need a valid Twitter account.</div>
                    </div>
                </div>
              </div>

            </div>

          }

          { (isAadAuthenticated || isTwitterAuthenticated) && 
          
              <div className="ms-Grid">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12 text-center">
                    <div className={ styles.tagline }>Welcome { profileDisplayName }</div>
                  </div>
                </div>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
                    <a href="#" className={ css(styles.button, styles.primaryButton) } onClick={ (e) => this.onNotebookClick(e) }>Plane</a>
                  </div>
                  <div className="ms-Grid-col ms-u-sm6 ms-u-md6 ms-u-lg6">
                    <a href="#" className={ css(styles.button, styles.button) } onClick={ (e) => this.onLogoutClick(e) }>Logout</a>
                  </div>
                </div>
             </div>
                
            }

        </div>

        <div className={ styles.flavors } style={{margin: '0px'}}>

          <div className={ styles.flavor }>

            { (!isAadAuthenticated && !isTwitterAuthenticated) && 
              <img src={ 'img/datalayer/datalayer-square-white.png' } width='72' alt='Datalayer Logo' />
            }

            { (isAadAuthenticated || isTwitterAuthenticated) && 
              <div className="ms-Grid-row">
                <div className="ms-Grid-col ms-u-sm12 ms-u-md12 ms-u-lg12">
                  <br/>
                  <Persona
                    imageUrl = { profilePhoto }
                    hidePersonaDetails = { true }
                    presence = { PersonaPresence.online }
                    size = { PersonaSize.large }
                    className = "text-center"
                   />
                </div>                
              </div>
            }

            <span className={ styles.flavorTitle }>Built to Scale</span>
            <span className={ styles.flavorDescription }>Datalayer&rsquo;s robust, up-to-date technology is built on Kubernetes, Apache Hadoop and Spark</span>
{/*
            <a href='#/components' className={ styles.button }>See components</a>
*/}
          </div>
          <div className={ styles.flavor }>
            <span className={ styles.flavorTitle }>Collect</span>
            <span className={ styles.flavorDescription }>Pull data from various data sources</span>
{/*
            <a href='#/fabric-js'>Learn more</a>
*/}
          </div>
          <div className={ styles.flavor }>
            <span className={ styles.flavorTitle }>Deploy</span>
            <span className={ styles.flavorDescription }>Apply your models on production data</span>
{/*
            <a href='#/angular-js'>Learn more</a>
*/}
          </div>
          <div className={ styles.flavor }>
            <span className={ styles.flavorTitle }>Model and Share</span>
            <span className={ styles.flavorDescription }>Apply algorithms and collaborate with peers</span>
{/*
            <a href='#/fabric-ios'>Learn more</a>
*/}
          </div>

        </div>

        <div className={ css(styles.product, styles.productSharepoint) } style={{margin: '0px'}}>
            <div>
              <span className={ styles.productTitle }>Collaborate</span>
              <span className={ styles.productDescription }>Share your Big Data analysis with peers in a visual way.</span>
            </div>
            <img className={ styles.productImage } src={ 'img/home/collaborate.svg' } width='496' height='300' alt='' />
        </div>

        <div className={ css(styles.product, styles.productAddins) } style={{margin: '0px'}}>
          <div>
            <span className={ styles.productTitle }>Enterprise ready</span>
            <span className={ styles.productDescription }>Integrate with Azure Security.</span>
          </div>
          <img className={ styles.productImage } src={ 'img/datalayer/pipes.svg' } width='496' height='300' alt='' />
        </div>

        <div className={ styles.featured }>
          <span className={ styles.featuredTitle }>Highlights</span>
          <span className={ styles.featuredDescription }>Datalayer offers a variety of elements to help you create an experience that delights users and complements Office 365.</span>
          <ul className={ styles.featureList } aria-label='List of highlighted features'>
            <li className="text-center">
              <a href='http://www.apache.org' target="_blank">
                <img src={ 'img/apache/apache.svg' } alt='' />
                <span>Apache Software Foundation</span>
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
                <img src={ 'img/aws/aws.svg' } alt='' />
                <span>Amazon AWS</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://azuremarketplace.microsoft.com/en-us/marketplace/apps/datalayer.datalayer-notebook' target="_blank">
                <img src={ 'img/azure/microsoft-azure-certified.png' } alt='' />
              </a>
            </li>
            <li className="text-center">
              <a href='https://spark.apache.org' target="_blank">
                <img src={ 'img/spark/apache-spark.svg' } alt='' />
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
                <img src={ 'img/zeppelin/zeppelin.png' } alt='' />
                <span>Apache Zeppelin</span>
              </a>
            </li>
            <li className="text-center">
              <a href='https://datalayer.io' target="_blank">
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
                <span>Microsoft Office 365</span>
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
                <span>Janus Graph</span>
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

  public componentWillReceiveProps(nextProps) {
    const { isAadAuthenticated } = nextProps
    if ((this.state.isAadAuthenticated == true) && (isAadAuthenticated == false)) {
      this.aadApi.logout()
      this.setState({
        isAadAuthenticated: false,
        profileDisplayName: '',
        profilePhoto: 'img/datalayer/datalayer-square.png'
      })
    }
    else if ((this.state.isAadAuthenticated == false) && (isAadAuthenticated == true)) {
      var blobPhoto = NotebookStore.state().profilePhotoBlob
      var profilePhoto = window.URL.createObjectURL(blobPhoto)
      this.setState({
        isAadAuthenticated: true,
        profileDisplayName: NotebookStore.state().profileDisplayName,
        profilePhoto: profilePhoto
      })
    }
  }

  private onAadAuthenticateClick = (e) =>  {
    e.preventDefault()
    this.props.dispatchToAadAction()
  }

  private onTwitterAuthenticateClick = (e) =>  {
    e.preventDefault()
    this.props.dispatchToTwitterAction()
  }

  private onNotebookClick = (e) =>  {
    e.preventDefault()
    history.push("/dla/notes")
  }

  private onProfileClick = (e) =>  {
    e.preventDefault()
    history.push("/dla/profile")
  }

  private onLogoutClick = (e) =>  {
    e.preventDefault()
    window["aadApi"].logout()
    this.props.dispatchLogoutAction()
    history.push("/")
  }

}
