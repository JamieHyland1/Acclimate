import React from 'react'
import request from './Request.js'
import { Redirect } from "react-router-dom";
import qs from "qs";
import {Container, Row, Col, Button, Spinner, Table, ListGroup, ListGroupItem} from 'reactstrap'
import user from "../img/user.png"
import { Breadcrumb, BreadcrumbItem} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Navbar    from './navbar.js'
import Appointment from './Appointment.js'

class Dashboard extends React.Component {

  constructor(){
    super();
    this.state = {
      id: 0,
      fname: "Uzair",
      lname: "Ali",
      email: "uzaira960@gmail.com",
      photo: null,
      meetings: [],
      interest1: "Running",
      interest2: "Swimming",
      interest3: "Programming",
      authenticated: false,
      pairedPageButton: false,
      chatPageButton: false,
      networkError: null

    }
    this.getUserDetails       = this.getUserDetails.bind(this);
    this.getPairDetails       = this.getPairDetails.bind(this);
    this.getInterests         = this.getInterests.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.getAppointments      = this.getAppointments.bind(this);
    this.cancelMeeting        = this.cancelMeeting.bind(this);
    this.setPairedPageButton  = () => {this.setState({pairedPageButton: !this.state.pairedPageButton})};
    this.setChatPageButton  = () => {this.setState({chatPageButton: !this.state.chatPageButton})};
  }

  //get the users details via get request
  getUserDetails(){
    request.get("http://localhost:4000/userDetails")
        .then((results)=> {
          const {id,fname,lname,email,photo,interest1,interest2,interest3,ccode,year} = results.data

          this.setState({
            id: id,
            fname: fname,
            lname: lname,
            email: email,
            photo: photo,
            interest1: interest1,
            interest2: interest2,
            interest3: interest3,
            ccode: ccode,
            year: year});
        })
        .catch((err)   => {
          console.log(err)
          this.setState({networkError: err})
        })
  }

  getPairDetails(){

    request.get("http://localhost:4000/pairedUserDetails")
      .then((results)=> {
        const {ccode, year} = results.data

        this.setState({
          pairCCode: ccode,
          pairYear: year
        })
      })
      .catch((err)   => {
        console.log(err)
        this.setState({networkError: err})
      })
  }

  //get the users interests
  getInterests(){
    request.get("/userInterests")
    .then((results) => {this.setState({interest1: results.data[0].interest,
                                       interest2: results.data[1].interest,
                                       interest3: results.data[2].interest})})
    .catch(err => console.log(err))
  }

  //check if a user is logged in or not
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

  //retrieve the users details from the API
  getAppointments(){

    request.get("http://localhost:4000/appointment")
    .then((result) => this.setState({meetings:result.data})).catch(err => console.log(err))
  }

  //display the users meetings in a table
  displayAppointments(){

    let meetings = []
    if(this.state.meetings.length == 0){
      return <p>The user has no current meetings</p>
    }
    for(var i = 0; i < this.state.meetings.length; i++){
      meetings.push(<thead id={"head"}><tr id={"row"}>
                    <th id={"id"}>{i}</th>
                    <th id={"date"}>{this.state.meetings[i].date}</th>
                    <th id={"date"}>{this.state.meetings[i].time}</th>
                    <th id={"description"}>{this.state.meetings[i].description}</th>
                    <th id={"hsa"}>{"false"}</th>
                    <th id={"hsa"}><button id={i} name={i} onClick={this.cancelMeeting}>&times;</button></th>
                  </tr></thead>)
    }
    console.log(meetings)
    return meetings

  }

  //cancel any specific meeting
  cancelMeeting(event){
    let meetingPosition = event.target.id // meetings position in the array
    let id = this.state.meetings[meetingPosition].id
    const requestBody = {id: id}
    const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }
    console.log(this.state.meetings.length)
    console.log(this.state.meetings.splice(id,0))
    console.log(this.state.meetings.splice(id,1))
    request.post("/deleteAppointment",qs.stringify(requestBody),config)
           .then(results => console.log(results))
           .then(()=> window.location.reload())
           .catch(err=> console.log(err))
  }

  //get the users details on startup
  componentDidMount(){
    this.handleAuthentication()
    this.getUserDetails()
    this.getPairDetails()
    this.getInterests()
    this.getAppointments()
  }

  //render the page
  render(){
    var base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(this.state.photo)));
    console.log(base64String)
    if(!this.state.networkError)
      {if(this.state.authenticated)
          {
            if(this.state.pairedPageButton)
            {
              return <Redirect to="/pairedDashboard" />
            }else if(this.state.chatPageButton){
              return <Redirect to="/Chat" />
            }else{
              return (
              <div>
              <Navbar />
              <Container className="dashboardContentContainer">
                <Row>
                  <Col>
                  </Col>
                  <Col>
                    <div className="dashboardMentorButton">
                      <Button color="primary" className="shadow rounded-circle" onClick={this.setPairedPageButton}>
                        <FontAwesomeIcon icon="smile" />
                      </Button>
                    </div>
                  </Col>
                  <Col className="dashboardPictureCol">
                    <img src={ user } className="profilePhoto rounded-circle"/>
                  </Col>
                  <Col>
                    <div className="dashboardChatButton">
                      <Button color="primary" className="shadow rounded-circle" onClick={this.setChatPageButton}>
                        <FontAwesomeIcon icon="comment" />
                      </Button>
                    </div>
                  </Col>
                  <Col>
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
                  <div className="appointmentButtonDiv">
                    <Appointment buttonLabel="Book a meeting" userCCode={this.state.ccode} userYear={this.state.year} pairCCode={this.state.pairCCode} pairYear={this.state.pairYear} onClick={()=>console.log("hi")}/>
                  </div>
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
          )
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
      }else{
        return <Redirect to="/" />
      }
    }
  }


export default Dashboard
