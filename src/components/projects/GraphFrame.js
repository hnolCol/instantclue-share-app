
import React from "react"
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom'
import GraphBase from "./Graph"
import { Button, InputGroup, Navbar, Alignment, NavbarGroup } from "@blueprintjs/core";
import { isObjectLike } from "lodash";


export function GraphFrame(props) {
    const [inputValue, setInputValue] = useState("Check for password ...");
    const [isLoading, setIsLoading] = useState(true)
    const [isProtected, setIsProtected] = useState(true);
    const [checkRequired, setCheckRequired] = useState(true);
    const [pwd, setPwdString] = useState("");
    const { graphID } = useParams()

    // if (!props.isInLastClicked(graphID)) {
    //     props.reportLastClicked(graphID)
    // }

    const checkPwd = function(e){
        setIsProtected(false)
        // axios.post('/api/v1/graph/protected')

       
    }    
    const submitButton = <Button icon="arrow-right" onClick={checkPwd}/>

    useEffect(() => {
        
        
            axios.get("/api/v1/graph/protected", {params :{ graphID : graphID}} 
            )
            .then(response => {
        
                    if (response.data["protected"]!==undefined) {

                        setIsProtected(JSON.parse(response.data["protected"]))
                        setInputValue("Password required.")
                    }
                
                    if (response.data["error"]!==undefined){
                        setInputValue(response.data["error"])
                    }
                    })
                setCheckRequired(false)
                setIsLoading(false)
                
        })
    
    const handleInputChange = function(e){
        setPwdString(e.target.value)   
    }       

    return (
        <div style={{width:"100%",textAlign:"center",marginTop:"30px"}}>
            
            {
            isLoading?<p>Loading</p>:
            isProtected?
                <div style={{width:"20%"}}>
                <p>Checking for password</p>
                <InputGroup
                    placeholder={inputValue}
                    small={true}
                    type={"password"}
                    rightElement = {submitButton}
                    onChange = {handleInputChange}
                />
               
                </div>
            :
            <GraphBase key = {Math.random()} graphID = {graphID}/>
            }
      
        </div>
    ) 

}