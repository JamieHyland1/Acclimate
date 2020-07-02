//These imports are somewhat self explanatory I guess, but just in case! They act as imports you'd use in python.
// Generally, these imports are imports of components (Navbar, Home etc) They're like chunks of html we're importing.
// If an import has {param1, param2, param3} it just means that you're taking multiple components from a file somewhere
// you can also rename things using the 'as' command when importing them you can see an example below
// if you want to use a component you imported you simply use the name you imported it as (the name before the 'from' in the statement)
// for example navbar, if you wanted a navbar in your app, simply place it in the render method using tags <Navbar/>
// Its important to note, some Tags are self closing <ComponentName /> like that and some are like <div> Tags
// <ComponentName> some content here..... </ComponentName> This might have a css effect, reactstrap works this way, it can be a way to pass info into a component
// so just make sure you know which one you're using and why. Generally self closing tags are the most you'll be using.



import React, { Component } from 'react'; // This imports all the react Modules
import './App.css'; // Imports the Css for the app Component
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'; // Imports the necessary components for routing
import Home      from './Components/Home.js' // Home component
import error     from './Components/NotFound.js';
import Login     from './Components/Login.js';
import Dashboard from './Components/Dashboard.js'
import Footer    from './Components/Footer.js';
import Register  from './Components/Register.js';
import Matching  from './Components/Matching.js';
import Chat      from  './Components/Chat.js';
import pairedDashboard from './Components/PairedDashboard.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faSmile } from '@fortawesome/free-solid-svg-icons';

library.add(faComment, faSmile)



class App extends Component {
  render() {
      return (
          <Router>
              <div>

                 <Switch>
                      <Route exact path="/"                component={Home}             />
                      <Route exact path="/Login"           component={Login}            />
                      <Route exact path="/Dashboard"       component={Dashboard}        />
                      <Route exact path="/Register"        component={Register}         />
                      <Route exact path="/Matching"        component={Matching}         />
                      <Route exact path="/Chat"            component={Chat}         />
                      <Route exact path="/pairedDashboard" component={pairedDashboard}  />
                      <Route component={error}                                          />
                  </Switch>
                  <Footer />
               </div>
        </Router>
    );
  }
}

export default App;
