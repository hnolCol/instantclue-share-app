
import React from "react"
import {useState} from 'react';
import { H5, Text, Code, Tag, Icon } from "@blueprintjs/core"
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import IconWithToolTip from "../utils/IconWithToolTip"
export function ProjectEntry(props) {
    
    const [contentVisible, setVisibility] = useState(true);
    const removeEntry = () => props.removeRequest(props.ID)

    return (
        <div className="entry-block">
            <div >
            <div style={{position:"absolute",left:"5px",top:"5px",verticalAlign:"middle"}}>
                <div style = {{float:"left",paddingRight:"10px"}}>
                    <Tag interactive = {true} onRemove={removeEntry}>
                        {props.title}
                    </Tag> 
                </div>
                
                
                <div style = {{float:"right"}}><Code>Text</Code></div>
            </div>

            <div style={{position:"absolute",right:"5px",top:"5px"}}>
                
                <div style = {{float:"left",paddingRight:"10px"}}>    
                    <p>{props.timeFrmt}</p>
                </div>
                
                <div style = {{float:"right",paddingRight:"10px"}}>
                <Icon  
                    icon = {contentVisible?"chevron-down":"chevron-left"} 
                    iconSize={12} 
                    color = {contentVisible?"blue":"red"} 
                    onClick = {() => setVisibility(!contentVisible)}/>
                </div>
            </div>

            </div>
            {contentVisible?
            
                <div style = {{paddingTop:"20px"}}>
                {props.isMarkDown?<ReactMarkdown plugins = {[gfm]} children={props.text}/>:<Text>{props.text}</Text>}
                </div>
                :
                null}


            <div style={{position:"absolute",right:"5px",bottom:"1px"}}>

                
            </div>
        </div>
    ) 

}