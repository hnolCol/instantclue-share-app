
import React from "react"
import { useState, useEffect } from "react";
import axios from "axios";

import { Label, Text, Button} from "@blueprintjs/core";


export function APITextLabel(props) {
    const [textValue, setTextValue] = useState("200");


    useEffect(() => {
        
            axios.get("/api/v1/data/size"
            )
            .then(response => {
                console.log(response.data)
                console.log(toString(response.data))
                setTextValue(response.data)
            }
                )
            
            }
        )
   
    
    return (
        <Button text={textValue} minimal={true} intent={"success"}/>)

}