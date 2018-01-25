import * as React from 'react'
import NotesList from './NotesList'
import NotesTiles from './NotesTiles'

export default class Notes extends React.Component<any, any> {
  public constructor(props) {    
    super(props)
  }

  public render() {
    return (
      <div>
        <NotesTiles />
        <NotesList />
      </div>
    )
  }

  public async componentDidMount() {
  }

  public componentWillReceiveProps(nextProps) {
  }

}
