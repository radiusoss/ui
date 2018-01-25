import * as React from 'react'
import { Route, IndexRoute, Switch } from 'react-router-dom'
import About from './../views/About'
import Simple from './../views/Simple'
import KuberSpl from './../views/spl/KuberSpl'

export default class SimpleLayout extends React.Component<any, any> {

  render() {

    return (

      <div className="app">
{/*
      <div className="app flex-row align-items-center">
*/}
{/*
        <IndexRoute component={About}/>
        <Route path="{this.props.location.pathname}/about" name="Simple About" component={About}/> 
        <Route path="{`${this.props.location.pathname}/tmp`}" name="Simple Temporary" component={Tmp}/> 
*/}
        <Route exact path="/simple" name="Simple Simple" component={Simple} />
        <Route path="/simple/about" name="Simple About" component={About} />
        <Route exact path="/simple/kuberspl" name="Simple KuberSpl" component={KuberSpl} />
      </div>
    )

  }

}
