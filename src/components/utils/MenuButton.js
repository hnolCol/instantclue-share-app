import React from 'react';
import {useState} from 'react';



export function MenuButton(props) {
    // Declare a new state variable, which we'll call "mouseOver"
    const [mouseOver, setmouseOver] = useState(false);
    const maxWidth = props.maxWidth === undefined?"210px":props.maxWidth
    const minWidth = props.minWidth === undefined?"95%":props.minWidth
  return (
    <div style = {{cursor: "pointer", 
            paddingTop:"5px",
            paddingBottom:"5px",
            paddingRight:"3px",
            backgroundColor: mouseOver?"#E4DED4":"white",
            display:"flex",
            justifyContent:"space-between",
            listStyle: "none",
            maxWidth:maxWidth,
            height:"30px",
            borderBottom: props.border ? "1px solid darkgrey" : "none"}} 
        onMouseEnter = {() => setmouseOver(true)} 
        onMouseLeave = {() => setmouseOver(false)}
        onClick = {props.callback!==undefined?() => props.callback(props.buttonText):() => props.toggleFunc()}>

            <div style = {{minWidth:minWidth}}>
                <p className = {"centered-p-in-div"}>{props.buttonText}</p>
            </div>
                
            <div>
            <svg viewBox = "0 0 16 16" style = {{maxHeight:"100%",paddingLeft:"2px",paddingRight:"9px",height:"10px"}}>
                    <circle cx = {8} cy = {8} r = {8} stroke = {"black"} fill = {mouseOver?"#B84D29":"#286FA4"} strokeWidth={0.2}/>
            </svg>
            </div>
    </div>
    
  );
}


