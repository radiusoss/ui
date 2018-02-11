import * as React from 'react'
import { Link } from 'office-ui-fabric-react/lib/Link'
import { MessageBarButton } from 'office-ui-fabric-react/lib/Button'
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar'
import * as stylesImport from './../_styles/Styles.scss'
const styles: any = stylesImport

export default class NotYetAvailable extends React.Component<any, any> {

  state = {
    showReleases: false
  }

  public render() {
    const { showReleases } = this.state
    return (
      <div>
        <MessageBar
          messageBarType={ MessageBarType.severeWarning }
          actions={
            <div>
              <MessageBarButton
                onClick={() => this.setState({showReleases: true})}
                >Releases</MessageBarButton>
            </div>
          }
        >
          <span>SevereWarning - This feature is not yet available. Send comments or questions to our Twitter account <a href="https://twitter.com/datalayerio" target="_blank">@datalayerio</a>.</span>
        </MessageBar>
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
