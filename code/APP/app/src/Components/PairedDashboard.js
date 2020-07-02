import React from 'react'
import request from './Request.js'
import {Container, Row, Col, Button, Spinner, Table, ListGroup, ListGroupItem} from 'reactstrap'
import {Redirect}  from 'react-router-dom'
import user from "../img/user.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar    from './navbar.js'

class Dashboard extends React.Component {
  constructor(){
    super();
    this.state = {
      id: 0,
      fname: "Uzair",
      lname: "Ali",
      email: "uzaira960@gmail.com",
      photo: null,
      interest1: "Running",
      interest2: "Swimming",
      interest3: "Programming",
      authenticated: false,
      meetings: []
    }
    this.getUserDetails       = this.getUserDetails.bind(this);
    this.getAppointments      = this.getAppointments.bind(this);
    this.getPairedInterests   = this.getPairedInterests.bind(this);
    this.displayAppointments  = this.displayAppointments.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.setPairedPageButton  = () => {this.setState({pairedPageButton: !this.state.pairedPageButton})}
  }
  //get the users details via get request
  getUserDetails(){
    request.get("http://localhost:4000/pairedUserDetails")
        .then((results)=> {
          const {id,fname,lname,email,photo} = results.data
          console.log(results)

          this.setState({  id: id,
            fname: fname,
            lname: lname,
            email: email,
            photo: photo});
        })
        .catch((err)   => console.log(err))
  }


  getPairedInterests(){
    request.get("http://localhost:4000/pairedInterests")
    .then((results) => {
      this.setState({
        interest1: results.data[0].interest,
        interest2: results.data[1].interest,
        interest3: results.data[2].interest
      })
    })
    .catch(err => console.log(err))
  }


  handleAuthentication(){
        let authenticated = false
        request.get("http://localhost:4000/LoggedIn")
                .then(results => authenticated = results.data)
                .then(()=>{
                    console.log(authenticated)
                    this.setState({authenticated: authenticated})
                })
                .catch(err => console.error(err))
    }

    getAppointments(){
      request.get("http://localhost:4000/pairedAppointments")
      .then((result) => this.setState({meetings:result.data})).catch(err => console.log(err))
    }

    //display the users meetings in a table
    displayAppointments(){
      let meetings = []
      if(this.state.meetings.length === 0){
        return <p>The user has no current meetings</p>
      }
      for(var i = 0; i < this.state.meetings.length; i++){
        meetings.push(<thead id={"head"}><tr id={"row"}>
                      <th id={"id"}>{i}</th>
                      <th id={"date"}>{this.state.meetings[i].date}</th>
                      <th id={"date"}>{this.state.meetings[i].time}</th>
                      <th id={"description"}>{this.state.meetings[i].description}</th>
                      <th id={"hsa"}>{"false"}</th>
                    </tr></thead>)
      }
      console.log(meetings)
      return meetings

    }


  //get the users details on startup
  componentDidMount(){
    this.handleAuthentication();
    this.getUserDetails();
    this.getPairedInterests();
    this.getAppointments();


  }
  render(){
    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(this.state.photo)));
    console.log(base64String)
    if(this.state.authenticated)
        {
          if(!this.state.pairedPageButton)
          {return (
            <div>
            <Navbar />
            <Container className="dashboardContentContainer">
              <Row>
                <Col className="dashboardPictureCol">
                  <img src={ user } alt="Profile Photo"className="profilePhoto rounded-circle"/>
                </Col>
              </Row>
              <Row>
                <div className="dashboardName">
                  <h3>{this.state.fname + " " + this.state.lname}</h3>
                  <p>{this.state.email}</p>
                </div>
              </Row>
              <Row className="dashboardContent">
                <Col>
                  <h4>Interests</h4>
                  <ListGroup>
                    <ListGroupItem>{this.state.interest1}</ListGroupItem>
                    <ListGroupItem>{this.state.interest2}</ListGroupItem>
                    <ListGroupItem>{this.state.interest3}</ListGroupItem>
                  </ListGroup>
                </Col>
                </Row>
                <Row>
                <Table>
                   <thead>
                     <tr>
                       <th>#</th>
                       <th>Date</th>
                       <th>Time</th>
                       <th>Description</th>
                       <th>Done</th>
                     </tr>
                   </thead>
                    {this.displayAppointments()}
                    </Table>
                </Row>
            </Container>
          </div>
        )}else{
          return <Redirect to="/Dashboard" />
        }}
        else{
          return  (
            <div>
              <Navbar />
              <div className="Spinner" align="center">
                <Spinner color="primary" />
              </div>
            </div>
          )
        }
    }
}
export default Dashboard
