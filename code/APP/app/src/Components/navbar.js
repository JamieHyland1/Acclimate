import React, { Component } from 'react';
import { Redirect,  NavLink } from "react-router-dom";
import Request from './Request.js'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    } from 'reactstrap';

class myNav extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,
            authenticated: false,
            userType: "",
            loggedOut: false,
            route: ""
        };
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.handleLogout         = this.handleLogout.bind(this);
    }
    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    handleAuthentication(){
        let authenticated = false
        let userType = ""
        Request.get("http://localhost:4000/LoggedIn")
                .then(results => {authenticated = results.data.authenticated
                                  userType = results.data.userType})
                .then(()=>{
                    console.log(authenticated + " " + userType)
                    this.setState({authenticated: authenticated, userType: userType})
                })
                .catch(err => console.error(err))
    }
    handleLogout(){
        let route ="/"
         this.setState({authenticated: false})
        Request("http://localhost:4000/Logout")
        .then((results) => console.log(results))
        .catch(err => console.error(err))
        return route
    }
    componentDidMount(){
        this.handleAuthentication();
    }
    render() {
            if(!this.state.loggedOut){
                if(this.state.userType !== "Admin")
                {
                    return (
                    <div className="myNav">
                        <Navbar light expand="md">
                            <NavbarBrand href="/" style={{ color: "white" }} className="NavLink">Acclimate</NavbarBrand>
                            <NavbarToggler onClick={this.toggle} />
                            <Collapse isOpen={this.state.isOpen} navbar>
                                <Nav className="ml-auto" navbar>
                                    <NavItem className="NavLink">
                                        <NavLink to={"/Login"} style={{
                                            color: "white"}} hidden={this.state.authenticated}>Login</NavLink>
                                    </NavItem>
                                    <NavItem className="NavLink">
                                        <NavLink to={"/Register"} style={{ color: "white" }} hidden={this.state.authenticated}>Register</NavLink>
                                    </NavItem>
                                    <NavItem className="NavLink">
                                        <NavLink to={"/Dashboard"} style={{ color: "white" }} hidden={!this.state.authenticated}>Dashboard</NavLink>
                                    </NavItem>
                                    <NavItem className="NavLink">
                                        <a href="http://localhost:3000" style={{ color: "white" }} hidden={!this.state.authenticated} onClick={this.handleLogout}> Logout</a>
                                    </NavItem>
                                </Nav>
                            </Collapse>
                        </Navbar>
                    </div>
                );
            }else{
                return (
                <div className="myNav">
                    <Navbar light expand="md">
                        <NavbarBrand href="/" style={{ color: "white" }} className="NavLink">Acclimate</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem className="NavLink">
                                    <NavLink to={"/Login"} style={{
                                        color: "white"}} hidden={this.state.authenticated}>Login</NavLink>
                                </NavItem>
                                <NavItem className="NavLink">
                                    <NavLink to={"/Register"} style={{ color: "white" }} hidden={this.state.authenticated}>Register</NavLink>
                                </NavItem>
                                <NavItem className="NavLink">
                                    <NavLink to={"/Dashboard"} style={{ color: "white" }} hidden={!this.state.authenticated}>Dashboard</NavLink>
                                </NavItem>
                                <NavItem className="NavLink">
                                    <NavLink to={"/Matching"} style={{ color: "white" }} hidden={!this.state.authenticated}>Matching</NavLink>
                                </NavItem>
                                <NavItem className="NavLink">
                                    <a href="http://localhost:3000" style={{ color: "white" }} hidden={!this.state.authenticated} onClick={this.handleLogout}> Logout</a>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </Navbar>
                </div>
            );
            }
        }else{
            return <Redirect to="/" />
        }
    }
}
export default myNav
