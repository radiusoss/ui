import * as React from 'react'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { MessageBarButton } from 'office-ui-fabric-react/lib/Button'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class NotYetAvailable extends React.Component<any, any> {

  state = {
    showMessageBar: true,
    showReleases: false
  }

  public render() {
    const { showMessageBar, showReleases } = this.state
    return (
      <div>
        {
        (showMessageBar) &&
         <MessageBar
          messageBarType={ MessageBarType.severeWarning }
          onDismiss={ () => this.setState({showMessageBar: false, showReleases: false}) }
          actions={
            <div>
              <MessageBarButton
//                onClick={() => this.setState({showReleases: true})}
                onClick={() => window.open('http://docs.datalayer.io/docs/releases')}
                >Releases</MessageBarButton>
            </div>
          }
        >
          <span>This feature is not yet available. Send comments or questions to our Twitter account <a href="https://twitter.com/datalayerio" target="_blank">@datalayerio</a>.</span>
        </MessageBar>
        }
        {
          (showReleases) &&
          <div className={styles.editorHeight} style={{ width: "100%" }}>
            <iframe src="http://docs.datalayer.io/docs/releases" className={styles.editorHeight} style={{ width: "100%" }}></iframe>
          </div>
        }
      </div>
    )
  }

}
