import React from 'react';
import { Col, Button, Form, FormGroup, Label, Input, Container} from 'reactstrap';
import {Redirect} from "react-router-dom";
import request from './Request.js'
import qs from "qs";
import LoggedIn from './LoggedIn'
import Navbar    from './navbar.js'
class Login extends React.Component{
    constructor(){
        super();
        this.state = {
          email: "",
          password: "",
          authorized: false,
          emailError: "",
          passwordError: "",
          networkError: false
        }
      this.handleValidation = this.handleValidation.bind(this);
      this.handleEvent      = this.handleEvent.bind(this);
      this.handleSubmit     = this.handleSubmit.bind(this);
    }
    handleValidation(){
      let email = this.state.email
      console.log(email)
      if(!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
        console.log("not a match")
        this.setState({emailError: "Not in proper email format!", email: "", password: ""})
        return false
      }

      return true
    }
    handleEvent(event){
      var key = event.target.id
      var val= event.target.value
      this.setState({[key]:val})

    }
    handleSubmit(){
    if(this.handleValidation())
    {
      const requestBody = {
      email: this.state.email,
      password: this.state.password
    }
      const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
      request.post('/login',qs.stringify(requestBody),config)
             .then(results => {
               console.log(results)
               if(results.status == 404) this.setState({passwordError: "Wrong password!"})
               this.setState({authorized:results.data})
             })
             .catch((err)   =>{
                 console.log(err.request)
                 if(err.response){
                     console.log(err.response)
                     this.setState({emailError:"Wrong Credentials!",passwordError: "Wrong Credentials!", email:"",password: ""})
                }else if(err.request){
                    this.setState({emailError:"There seems to be a problems connecting to the server please check your internet connection and try again"})
                }
             })
           }
     }
    render(){
        if(this.state.authorized){
            return<Redirect to="/Dashboard"/>
        }
        else{
        return (
              <div className="Login">
              <Navbar />

                <div>
                    <Container>
                  <div className="LoginForm">
                    <Col xs={{ size: '12'}}>
                        <Form onSubmit={this.handleSubmit}>
                          <FormGroup style={{padding: "10px;"}}>
                              <Label for="email" sm={2}>Email</Label>
                              <Col sm={10}>
                                  <Input type="email" name="email" id="email" placeholder="joebloggs@gmail.com" value={this.state.email}onChange={this.handleEvent} />
                                  <span style={{color:"red"}}>{this.state.emailError}</span>
                              </Col>
                          </FormGroup>
                          <FormGroup >
                              <Label for="password" sm={2}>Password:</Label>
                              <Col sm={10}>
                                  <Input type="password" name="password" id="password" placeholder="password" value={this.state.password} onChange={this.handleEvent} />
                                    <span style={{color:"red"}}>{this.state.passwordError}</span>
                              </Col>
                          </FormGroup>
                          <FormGroup check row>
                              <Col sm={{ size: 12 }}>
                                  <Button type="button" disabled={!this.state.email || !this.state.password}onClick={this.handleSubmit} block>Login</Button>
                              </Col>
                          </FormGroup>
                        </Form>
                    </Col>
                  </div>
              </Container>
            </div>
        </div>
        );
      }
  }
}

export default Login
