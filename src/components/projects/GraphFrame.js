
import React from "react"
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom'
import GraphBase from "./Graph"
import { Button, InputGroup } from "@blueprintjs/core";


export function GraphFrame(props) {
    const [inputValue, setInputValue] = useState("Check for password ...");
    const [isProtected, setIsProtected] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isProtectedChecked, setIsProtectedChecked] = useState(false);
    const [pwd, setPwdString] = useState("");
    const { url } = useParams()

    if (!props.isInLastClicked(url)) {
        props.reportLastClicked(url)
    }

    const checkPwd = function(e){
        setIsProtected(false)
        // axios.post('/api/v1/graph/protected')

       
    }    
    const submitButton = <Button icon="arrow-right" onClick={checkPwd}/>

    useEffect(() => {
        if (isProtectedChecked){
        axios.get("/api/v1/graph/protected", {params :{ url : url}} 
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
            }
        // else {

        //     console.log(pwd)
        // }
            })
    
    const handleInputChange = function(e){
        setPwdString(e.target.value)
        
    }

    
       
    return (
        <div style={{width:"100%",textAlign:"center"}}>

            {isProtected?
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
            <GraphBase url = {url}/>
            }
      
        </div>
    ) 

}