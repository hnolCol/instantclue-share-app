import React from 'react';
import {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { H5, Divider, ButtonGroup, H4, NavbarGroup, NavbarDivider, NavbarHeading, Button, Alignment, Code} from "@blueprintjs/core"

import {InstantClueIcon} from "./components/utils/SVGs"
import {MenuButton} from "./components/utils/MenuButton"
import ProjectView from "./components/projects/ProjectView"
import {GraphFrame} from "./components/projects/GraphFrame"

import './App.css';

const __VERSION__ = "0.0.1"
const MENU_OPTIONS = [{"text":"graphs"}]

function App() {
  const [mainView, setMainView] = useState("home");
  const [lastClickedGraphs, setLastClickedGraphs] = useState([])

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
    
    <div className={"left-container"}>

      <div className={"logo-container"}>
          <div  style={{float:"left",width:"40%"}}>
          <InstantClueIcon />
          </div>
          <div style = {{marginTop:"25px"}}>
            <H5>InstantClue App</H5>
            
            <a href = {"https://github.com/hnolCol/instantclue"} target = "_blank" rel="noopener noreferrer">
                <p>View on GitHub</p>
            </a>
              <p>v.{__VERSION__}</p>
  
          </div>
      </div>

      <div className={"sideMenu-container"}>
            <ButtonGroup minimal = {true} 
                            vertical = {true} 
                            fill = {true}
                            >
                  {MENU_OPTIONS.map(m => {
                    return(
                      <div key = {`${m.text}${Math.random()}`}>
                        <Divider/>
                        <div>
                        <MenuButton style = {{marginTop:"2px"}} buttonText = {m.text} callback = {setMainView} maxWidth = {200} minWidth = {"175px"}/>
                        </div>
                      </div>
                    )
                  })}
                  
                  {lastClickedGraphs.map(graphClicked => {
                    return(
                    <Link key = {`${graphClicked}`} to={`/s/${graphClicked}`}><Code>{graphClicked}</Code></Link>
                    )
                  })}
                  
                  
                 <Divider/>
                
            </ButtonGroup>
       </div>
    </div>

    <div className={"right-container"}>  
        <NavbarGroup align={Alignment.RIGHT}>
                <NavbarHeading>InstantClue App</NavbarHeading>
                <NavbarDivider />
                <Button  icon="download" minimal={"true"}/>
                {/* <Button  icon="user" minimal={"true"}/> */}
                <Button  icon="menu" minimal={"true"}/>
          </NavbarGroup>
          
          
            <Route exact path="/">
              <ProjectView/>
            </Route>
                    
            <Route exact path="/s/:url">
              
              <GraphFrame reportLastClicked = {updateLastClicked} isInLastClicked = {isInLastClicked}/>
            </Route>
        
         
          
      
      
    </div>
    
   
   
    </div>
    </Switch>
    </Router>
  );
}

export default App;
