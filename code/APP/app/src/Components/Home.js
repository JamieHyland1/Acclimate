import React, { Component } from 'react';
import { Row, Jumbotron } from 'reactstrap';
import Navbar    from './navbar.js'


class Home extends Component {
    render() {
        return (
            <div className="App">
            <Navbar />
                <div className="Body">
                  <Jumbotron className="jumbotron">
                    <div>
                        <h1>Acclimate</h1>
                        <hr/>
                        <p>A mentorship and support app for students.</p>
                      </div>
                    <h2>  <a href="/Login"> Login </a></h2>
                      <br/>
                      <h2><a href="/Register"> Register </a></h2>
                  </Jumbotron>
                  <Row>
                  </Row>
                  <Row>
                  </Row>
                </div>
            </div>
        );
    }
}

export default Home;
