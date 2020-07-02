import React from 'react'
import request from './Request.js'
import {Redirect} from 'react-router-dom'
//The qs import was a response to a stack overflow question on how to set up an axios request to be read properly by my api
// You can view the question here https://stackoverflow.com/questions/54772894/axios-post-params-not-being-sent
import qs from "qs";
import { Button, Form, FormGroup, Label, Input, FormText, Container, Row, Col } from 'reactstrap';
import Navbar    from './navbar.js'

class Register extends React.Component{
  constructor(){
    super()
    this.state = {
      courseCode: [],
      interests : [],
      studentNumber: "",
      fname: "",
      lname: "",
      email: "",
      photo: "NULL",
      interest1: "",
      interest2: "",
      interest3: "",
      mentor: "",
      mentee: "",
      course: "",
      gender: "",
      year: "",
      fnameError:"",
      lnameError:"",
      emailError: "",
      passwordError: "",
      accountError: "",
      courseError: "",
      studentNumberError: "",
      fieldsEmpty: true,
      submitStatus: 0
    }
    this.parseFields        = this.parseFields.bind(this);
    this.handleRadioButtons = this.handleRadioButtons.bind(this);
    this.handleEvent        = this.handleEvent.bind(this);
    this.checkValidation    = this.checkValidation.bind(this);
    this.selectInterests    = this.selectInterests.bind(this);
    this.selectCourse       = this.selectCourse.bind(this);
    this.checkEmptyFields   = this.checkEmptyFields.bind(this);
    this.handleSubmit       = this.handleSubmit.bind(this);

  }
  //retrieve course codes and interests
  parseFields(data){
    let interests = []
    let courses   = []
    for(var i = 0; i < data.length; i++){
        //make sure no duplicate values are added to the arrays
        if(!courses.includes(data[i].cCode)) courses.push(data[i].cCode)
        if(!interests.includes(data[i].interest)) interests.push(data[i].interest)
    }
    this.setState({courseCode: courses, interests: interests,interest1: interests[0], interest2:interests[1], interest3:interests[2]})
  }
  //make sure only one radio button is 'on' at one time
  handleRadioButtons(event){
    let key = event.target.id;
    if(key === "mentor"){
      if(this.state.mentee === "on"){
         this.setState({mentee: "", mentor: "on"})
      }
      this.setState({mentor:"on"})
    }else if(key === "mentee"){
      if(this.state.mentor === "on"){
         this.setState({mentee: "on", mentor: ""})
       }
       this.setState({mentee: "on"})
    }

  }
  //retrieve user input
  handleEvent(event){
    var fields = this.checkEmptyFields()
    var key = event.target.id
    var val= event.target
    console.log(key + ": " + val)
    this.setState({[key]:val.value, fieldsEmpty:fields})
    if(key === "photo"){
      let blob = val.files[0]
      console.log(blob)
      this.setState({[key]:blob})
    }


  }
  //validate user fields
  checkValidation(){
    let noErrors = true;
    let studentNumber = this.state.studentNumber;
    let fname         = this.state.fname;
    let lname         = this.state.lname;
    let email         = this.state.email;
    let password      = this.state.email;
    let mentor        = this.state.mentor;
    let mentee        = this.state.mentee;
    let interest1     = this.state.interest1;
    let interest2     = this.state.interest2;
    let interest3     = this.state.interest3;
    let course        = this.state.course;

      if(studentNumber.toString().length !== 8){
        this.setState({studentNumberError: "You're student number must be 7 digits long"})
        noErrors = false;
      }
      if(!fname.match(/^[a-zA-Z]+$/)){
        this.setState({fnameError: "Characters only!", fname: ""});
        noErrors = false;
      }
      if(!lname.match(/^[a-zA-Z]+$/)){
        this.setState({lnameError: "Characters only!", lname: ""});
        noErrors = false;
      }
     if(mentor === "on" && mentee === "on") {
       this.setState({accountError: "You can only choose one type of account!", mentor: "",mentee:""});
       noErrors = false;
     }
     if(mentor === "" && mentee === "") {
       this.setState({accountError: "You have to choose what account you want", mentor: "",mentee:""});
       noErrors = false;
     }
     if(!email.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)){
       console.log("not a match")
       this.setState({emailError: "Not in proper email format!", email: ""})
       noErrors = false
     }
     console.log("Validation returns: " + noErrors)
     return noErrors
  }
  //fill select field with interests
  selectInterests(){
    let options = []
    for(var i = 0; i < this.state.interests.length; i++){
      options.push(<option key={i} value={this.state.interests[i]}>{this.state.interests[i]}</option>)
    }
    return options
  }
  //fill select field with course codes
  selectCourse(){
    let options = []
    for(var i = 0; i < this.state.courseCode.length; i++){

      options.push(<option key={i} value={this.state.courseCode[i]}>{this.state.courseCode[i]}</option>)
    }
    return options
  }
  //check to see if a user has missed an input field
  checkEmptyFields(){
    if(!this.state.studentNumber || !this.state.email || !this.state.password || !this.state.fname || !this.state.lname || !this.state.interest1 || !this.state.interest2 || (!this.state.mentor && !this.state.mentee) || !this.state.interest3 || !this.state.course || !this.state.gender){
      return true
    }
    return false
  }
  //send POST request to server
  handleSubmit(){
    let studentNumber = this.state.studentNumber
    let fname         = this.state.fname;
    let lname         = this.state.lname;
    let email         = this.state.email;
    let password      = this.state.password;
    let mentor        = this.state.mentor;
    let mentee        = this.state.mentee;
    let photo         = this.state.photo
    let interest1     = this.state.interest1;
    let interest2     = this.state.interest2;
    let interest3     = this.state.interest3;
    let course        = this.state.course;
    let gender        = this.state.gender;
    let year          = this.state.year;

    const requestBody = {
      studentNumber: studentNumber,
      fname: fname,
      lname: lname,
      email: email,
      password: password,
      photo: photo,
      mentor: mentor,
      mentee: mentee,
      interest1: interest1,
      interest2: interest2,
      interest3: interest3,
      course: course,
      gender: gender,
      year: year
    }
    const config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }}
    if(this.checkValidation()) {
      request.post("/register",qs.stringify(requestBody),config)
             .then(result => this.setState({submitStatus: result.status}))
             .catch(err   => console.log(err))
    }
  }
  //retrieve interests and course codes
  componentWillMount(){
    request.get("/RegisterFields")
      	   .then(results => this.parseFields(results.data))
           .catch(err => console.log(err))
  }

  //render Register Page
  render(){
    if(this.state.submitStatus === 200){
      return <Redirect to="/Dashboard" />
    }else
      {
        return(
        <div>

            <div className="Register">
              <Navbar />

              <div className="RegisterForm">
              <Container>
              <Row>
              <Col xs="5">
                  <Form>
                    <FormGroup>
                      <Label for="studentNumber">Student Number</Label>
                      <Input type="number" name="studentNumber" id="studentNumber" placeholder="17108152"onChange={this.handleEvent} value={this.state.studentNumber} />
                      <span style={{color:"red"}}>{this.state.studentNumberError}</span>
                    </FormGroup>
                    <FormGroup>
                      <Label for="fname">First Name</Label>
                      <Input type="text" name="fname" id="fname" placeholder="Joe"onChange={this.handleEvent} value={this.state.fname} />
                      <span style={{color:"red"}}>{this.state.fnameError}</span>
                    </FormGroup>
                    <FormGroup>
                      <Label for="lname">Last Name</Label>
                      <Input type="text" name="lname" id="lname" placeholder=" bloggs" onChange={this.handleEvent} value={this.state.lname}/>
                        <span style={{color:"red"}}>{this.state.lnameError}</span>
                    </FormGroup>
                    <FormGroup>
                      <Label for="email">Email</Label>
                      <Input type="email" name="email" id="email" placeholder="joebloggs@gmail.com"onChange={this.handleEvent} value={this.state.email} />
                          <span style={{color:"red"}}>{this.state.emailError}</span>
                    </FormGroup>
                    <FormGroup>
                      <Label for="password">Password</Label>
                      <Input type="password" name="password" id="password" placeholder="password placeholder" onChange={this.handleEvent} value={this.state.password || ""} />
                        <span style={{color:"red"}}>{this.state.passwordError}</span>
                    </FormGroup>
                    <FormGroup check>
                      <Label> Account Type </Label>
                        <Label check>
                          <Input id="mentee" type="radio" name="accountType" onChange={this.handleRadioButtons}  />{' '}
                        Create a Mentee Account
                        </Label>
                        <br/>
                        <Label check>
                          <Input id="mentor" type="radio" name="accountType" onChange={this.handleRadioButtons}  />{' '}
                          Create a Mentor Account
                        </Label>
                        <span style={{color:"red"}}>{this.state.accountError}</span>
                    </FormGroup>
                    </Form>
                    </Col>
                    <Col  md={{ size: 5, offset: 2 }}>
                    <Form>
                    <FormGroup>
                        <Label for="Interest 1">Interest 1</Label>
                        <Input id="interest1" type="select" name="Interests" onChange={this.handleEvent} value={this.state.interest1}>
                          {this.selectInterests()}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Interest 2">Interest 2</Label>
                        <Input id="interest2" type="select" name="Interests" onChange={this.handleEvent} value={this.state.interest2}>
                          {this.selectInterests()}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="Interest 3">Interest 3</Label>
                        <Input id="interest3" type="select" name="Interests" onChange={this.handleEvent} value={this.state.interest3}>
                          {this.selectInterests()}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="course">Course</Label>
                        <Input id="course" type="select" name="course" onChange={this.handleEvent}  value={this.state.course}>
                          {this.selectCourse()}
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="gender">Gender</Label>
                        <Input id="gender" type="select" name="gender" onChange={this.handleEvent}  value={this.state.gender}>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                        <Label for="year">Year</Label>
                        <Input id="year" type="select" name="year" onChange={this.handleEvent}  value={this.state.year}>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                        </Input>
                    </FormGroup>

                   </Form>
                   </Col>
                   </Row>
                   <br />
                   <Row>
                     <Button type="button"  onClick={this.handleSubmit} block>Register</Button>
                     </Row>
                   </Container>
                  </div>
              </div>

        </div>
      )
    }
  }
}

export default Register
