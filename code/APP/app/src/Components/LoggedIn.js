import React from 'react';
import {Redirect} from 'react-router-dom';
import request from './Request.js'

class LoggedIn extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      loggedIn: false
    }
    this.loggedIn = this.loggedIn.bind(this);
  }
  loggedIn(){
    request.get("/LoggedIn")
    .then(results => {
      let result = results.data
      console.log(results.data)
      this.setState({loggedIn: result})
      console.log(this.state.loggedIn)
    })
    .catch(err=> console.log(err))
  }
  componentDidMount(){
    this.loggedIn();
  }
  render(){
    if(!this.loggedIn) return <Redirect to="/"/>
    return <div>{this.props.children}</div>

  }
}

export default LoggedIn
