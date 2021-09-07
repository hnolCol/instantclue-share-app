import React from "react";
import {
        Collapse, Callout} from "@blueprintjs/core"
import {useState} from 'react';
import {MenuButton} from "./MenuButton"

export function CollapsableText(props) {
       
    const {title, openAtRender, id, ...rest} = props
    const [isOpen, setIsOpen] = useState(true);
    const toggleState = () => setIsOpen(!isOpen);
    return(

            <div style = {{paddingLeft:"8px",paddingRight:"8px",height:"100%"}} > 
                <MenuButton buttonText = {props.title} toggleFunc = {toggleState} maxWidth = "100%" minWidth = {"96%"} {...rest}/>
                <Collapse isOpen = {isOpen} transitionDuration = {500}>
                    <Callout style = {{overflowY:"scroll",maxWidth:"100%",overflowX:"hidden", height:"350px"}}>

                        {props.content}

                    </Callout>
                </Collapse>
            </div>
            )
}
