import React from 'react';
import {useState} from 'react';
import {
  BrowserRouter as Router,
 
  Switch,
  Route,
  Link,
  useParams,
  useHistory
} from "react-router-dom";
import { H5, Divider, ButtonGroup, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment, Code, Navbar, Text} from "@blueprintjs/core"

import GeneralSearch from "./components/utils/OmnibarSearch"

import {GraphFrame} from "./components/projects/GraphFrame"
import {WelcomeScreen} from "./components/WelcomeScreen"
import { APITextLabel } from './components/utils/APITextLabel';
import './App.css';

const __VERSION__ = "0.1.1"
const MENU_OPTIONS = [{"text":"graphs"}]

function App() {
  
  const [lastClickedGraphs, setLastClickedGraphs] = useState([]);
 

  const updateLastClicked = function(graphURL) {
    
    var lastClicked = lastClickedGraphs.slice()
    lastClicked = lastClicked.concat([graphURL])
    setLastClickedGraphs(lastClicked)
  }

  const isInLastClicked = function(graphURL){
    return lastClickedGraphs.includes(graphURL)
  }

  

  return (
    <Router>
    <Switch>
    <div className={"wrapper"}>
    <div className={"right-container"}>  
      <Navbar fixedToTop={true}>
        <NavbarGroup align={Alignment.RIGHT}>
                {/* {lastClickedGraphs.length > 0?<Code>{lastClickedGraphs[0]}</Code>:null} */}
                <GeneralSearch/>
                <NavbarDivider />
                <APITextLabel/>
                <NavbarDivider />
                <NavbarHeading>InstantClue App</NavbarHeading>
                <NavbarDivider />
                <Link to="/"><Button icon="home" minimal={true}/></Link>
                {/* <Button  icon="user" minimal={"true"}/> */}
                <Button  icon="menu" minimal={true} />
          </NavbarGroup>
          </Navbar>
          
            <Route exact path="/">
              <WelcomeScreen/>
             
            </Route>
            {/* testing routing */}
            <Route exact path = "/h">
                <p>h</p>
            </Route>
                    
            <Route exact path="/s/:graphID">
              <GraphFrame key = {Math.random()} reportLastClicked = {updateLastClicked} isInLastClicked = {isInLastClicked}/>
            </Route>
      
      
    </div>
    </div>
    </Switch>
    </Router>
  );
}

export default App;
