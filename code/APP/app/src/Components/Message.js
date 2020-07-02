import React from 'react';
class Message extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      message: props.message,
      type: props.type
    }
  }
  render(){
    const divStyle = {
      border: '5px solid  white',
      border_radius: "5px"
    };
    const pStyle = {
      fontSize: '15px',
      textAlign: 'center'
    };
    return(
      <div style={divStyle} className={this.state.type}>
      <p style={pStyle}>{this.state.message}</p>
    </div>
    )
  }
}
export default Message
