import React         from 'react';
import Navbar        from './navbar.js';
import Request       from './Request.js';
import Message       from './Message.js';
import qs            from 'qs';
import {getMessages, sendMessageToServer} from './SocketHandler.js'
import { Table, Container, Row, Col, Input, Label, Button, Spinner  } from 'reactstrap';

class Chat extends React.Component{
  constructor(){
    super();
    this.state = {
      textbox: "",
      log: [],
      testMessage: "",
      emptyMsgBox: true,
      msgType: "sender",
      id: "",
      pId: "",
      logId: ""
    };
    getMessages((err,msg)=>
    {
        this.setState({msgType:"reciever"})
        this.state.log.push(msg)
        setTimeout(()=>this.setState(this.state),100)
    })
    this.handleEvent = this.handleEvent.bind(this);
    this.display     = this.display.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getID       = this.getID.bind(this);
  }
  handleEvent(event){
    var key = event.target.id
    var val= event.target.value
    this.setState({[key]:val})
    if(this.state.textbox != null) this.setState({emptyMsgBox: false})
  }
  display(){
    let log = this.state.log
    let messages = []
    for(var i = 0; i < log.length; i++){
        messages.push(<Message message={log[i]} type={this.state.msgType}/>)
    }
    return messages
  }
  sendMessage(){
    this.setState({msgType: "sender"})
    this.state.log.push(this.state.textbox)
    this.setState({textbox: ""})
    let msgObject = {
                    id:this.state.id,
                    to: this.state.pId,
                    msg:this.state.textbox,
                    logId: this.state.logId,
                    log: this.state.log
                  }
                  console.log(msgObject)
    sendMessageToServer(msgObject)
  }
  getID(){
    Request.get("/getPairIDs")
    .then(result=>{
      console.log(result)
      if(result.data[1] == "Mentee"){
        this.setState({id:result.data[0].menteeID, pId:result.data[0].mentorID})
      }else{
        this.setState({id:result.data[0].mentorID, pId:result.data[0].menteeID})
      }
    })
    .catch(err=>console.log(err))
  }
  componentDidMount(){
    this.getID()
  }
  render(){
    return(
      <div>
        <Navbar />
        <Container fluid>
          <Row>
            <div className="messageArea">
              {this.display()}
            </div>
          </Row>
          </Container>
          <Container fluid>
          <Row>
            <div className="textboxDiv">
              <Input type="text" id="textbox" name="textbox" cols="100" onChange={this.handleEvent} value={this.state.textbox}/>
              <Button color="primary" disabled={this.state.emptyMsgBox} onClick={this.sendMessage} block> Send </Button>
            </div>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Chat
