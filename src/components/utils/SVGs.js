import React from 'react';
import {useState} from 'react';
// Hook

const INSTANT_CLUE_BLUE = "#286FA4"
const INSTANT_CLUE_RED = "#B84D29"


function getHoverColor(mouserOver) {
  return mouserOver?INSTANT_CLUE_RED:INSTANT_CLUE_BLUE
}
export function InstantClueIcon() {
    // Declare a new state variable, which we'll call "mouseOver"
    const [mouseOver, setmouseOver] = useState(false);

  return (
      
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 407 403">
    <g 
        onMouseEnter = {() => setmouseOver(true)}
        onMouseLeave = {() => setmouseOver(false)}>
        
        <circle 
                stroke = {"black"} 
                strokeWidth = {"2px"} 
                cx="203.2" 
                cy="201.2" 
                r="184.3" 
                
                fill={"white"}/>
        <g>
            <path stroke = {mouseOver?INSTANT_CLUE_BLUE:"black"} strokeWidth = {mouseOver?"4px":"2px"} fill = {"none"}  d="M203.2,46.7c67.9,0,115.2,68.9,91.1,132.4c-5.6,14.8-14.3,28-21.8,41.9c-7.1,13.1-12.7,26.6-12.8,41.8
                c0,3.2-0.5,7.4-2.5,9.6c-11.5,12.6-6.6,27.3-5.7,41.3c0.7,10.6-3.6,16.7-14.1,17.9c-3,0.3-5.8,0.4-8.5,2.4
                c-17.5,13.1-34.8,13.1-51.4,0.1c-2.8-2.2-6-2.8-9.4-2.9c-8.8-0.4-13-5.9-12.7-13.8c0.3-10-2.6-20.1,1-29.9c0.9-2.5-0.2-4.5-2-6.2
                c-6-5.6-8.2-12.9-8.6-20.8c-0.5-13.8-5.4-26.1-11.8-38c-9.1-16.8-20-32.6-25.3-51.2C91.3,109,138.7,46.6,203.2,46.7z M202.8,278.7
                c0,0.1,0,0.3,0,0.4c4.4,0,8.7,0,13.1,0c4.4-0.1,8.7-0.2,13.1-0.4c14.2-0.7,20.2-6.1,20.9-20.3c0.6-12.3,4-23.7,9.6-34.6
                c7.1-13.7,14-27.5,21.3-41.1c15.3-28.4,12.8-56.1-3-83.2c-21.1-36.3-66.2-52-105.4-37c-39.5,15.2-63.8,57.4-55.7,97.3
                c3.5,17,12.9,31.6,20.9,46.6c9.4,17.5,18.1,35,19.2,55.5c0.5,10.9,6.7,16,17.9,16.5C184,279.1,193.4,278.7,202.8,278.7z
                 M172.9,309.7c20.6-3.6,41.9-7.4,63.3-11.2c2.5-0.4,4.7-1.6,4.3-4.5c-0.4-2.5-2.5-4.1-5.1-3.8c-5.3,0.7-10.6,1.6-15.9,2.5
                c-15.8,2.7-31.6,5.5-47.4,8.3c-3.1,0.5-6.3,1.6-6.2,5.3C166.1,309.8,169.2,309.9,172.9,309.7z M173.6,321.3
                c20-3.5,41.3-7.2,62.6-11.1c2.6-0.5,5.5-1.8,4.5-5.3c-0.9-3.2-3.7-3.5-6.5-3c-21,3.6-42,7.3-63,11c-2.7,0.5-5.5,1.8-5.2,5.1
                C166.3,321.5,169.4,321.5,173.6,321.3z M200.1,319.5c0.1,0.8,0.2,1.5,0.4,2.3c11.2,0,22.4,0.1,33.6-0.1c3.1,0,7.6,0.4,7.1-4.5
                c-0.5-4.3-4.2-4.3-7.8-3.7C222.2,315.6,211.2,317.5,200.1,319.5z M206.2,291.9c-0.1-0.7-0.1-1.3-0.2-2c-11.7,0-23.5-0.1-35.2,0.1
                c-2.7,0-5.7,0.9-5.3,4.4c0.3,3.3,3.1,4.2,6,3.7C183.1,296.2,194.6,294,206.2,291.9z M190.3,330.4c13.1,5.3,14.5,5.3,24.6,0
                C206.9,330.4,200.2,330.4,190.3,330.4z"/>
        </g>
    </g>
    </svg>
  );
}


export function MacDownloadIcon() {
  // Declare a new state variable, which we'll call "mouseOver"
  const [mouseOver, setmouseOver] = useState(false);

return (
 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.7 73.6">
  <g onMouseEnter = {() => setmouseOver(true)} onMouseLeave = {() => setmouseOver(false)}>
	
	<path stroke = {getHoverColor(mouseOver)}  strokeWidth = {0.75} fill = {"white"} d="M19.4,70.7c-0.3-0.3-0.7-0.2-1.1-0.3c-1.9-0.5-3.5-1.6-4.9-2.9c-1.7-1.7-3.1-3.6-4.5-5.5c-1.7-2.4-3-5-4.1-7.7
		c-1.2-2.8-2-5.8-2.6-8.8c-0.2-1-0.3-2-0.4-2.9c0-0.1,0.1-0.3-0.1-0.4c0-1.6,0-3.1,0-4.7C2.1,36.8,2,36,2.1,35.2
		C3.4,28,7.2,23,14,20.2c3.3-1.3,6.6-1.2,10-0.2c1.6,0.5,3.2,1.1,4.9,1.6c2.3,0.7,4.6,0.5,6.8-0.4c2.2-0.8,4.4-1.6,6.8-1.9
		c4.1-0.5,7.8,0.7,11.1,3c1.3,0.9,2.4,2,3.5,3.2c0.6,0.6,0.5,1-0.3,1.4c-3.8,2.3-6.1,5.7-6.7,10.1c-0.9,6.5,2.8,12.6,8.5,15.1
		c0.3,0.1,0.5,0.3,0.7,0.5c0,0.2,0,0.3,0,0.5c-0.8,2.3-1.9,4.4-3.2,6.4c-1.4,2.2-2.8,4.4-4.5,6.4c-1.5,1.8-3.3,3.4-5.6,4.4
		c-0.7,0.3-1.4,0.3-2.1,0.5c-1,0-2.1,0-3.1,0c-1.2-0.1-2.3-0.6-3.4-1.1c-3.7-1.7-7.4-1.7-11.2,0c-1,0.4-1.9,1-3,1.1
		c-0.3,0-0.6-0.1-0.8,0.1C21.4,70.7,20.4,70.7,19.4,70.7z"/>
	<path stroke = {getHoverColor(mouseOver)}   strokeWidth = {0.75} fill = {"white"} d="M43.1,3.8c0.2,0.2,0.3,0.4,0.4,0.8c0.5,6.9-4,13.6-10.7,15.5c-0.9,0.2-1.8,0.4-2.7,0.4c-0.8,0-0.9-0.2-1-1
		C28.7,12.5,33.9,5.9,41,4C41.3,4,41.5,4,41.7,3.8C42.2,3.8,42.7,3.8,43.1,3.8z"/>
</g>
  </svg>
);
}




export function WindowsDownloadIcon() {
  // Declare a new state variable, which we'll call "mouseOver"
  const [mouseOver, setmouseOver] = useState(false);
  const svgProps = {fill:"white",strokeWidth:0.5}
return (
  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.7 73.6">
   <g onMouseEnter = {() => setmouseOver(true)} onMouseLeave = {() => setmouseOver(false)}>

	<polygon stroke = {getHoverColor(mouseOver)}  points="2.4,13.2 24.6,9.3 24.6,34.6 2.4,34.9 " {...svgProps}/>
  <polygon stroke = {"darkgrey"} points="28.7,8.6 58.6,3.4 58.6,34.6 28.7,34.9 "{...svgProps}/>
  <polygon stroke = {"darkgrey"} points="2,39 24.6,38.7 24.6,64 2,60.3 "{...svgProps}/>
  <polygon stroke = {getHoverColor(mouseOver)}   points="28.7,38.7 58.6,38.7 58.6,70.2 28.7,64.8 "{...svgProps}/>

  </g>
  </svg>
);
}



export function AddFeatureRequestMail() {
  // Declare a new state variable, which we'll call "mouseOver"
  const [mouseOver, setmouseOver] = useState(false);
  const svgProps = {strokeWidth:0.5,stroke:"darkgrey",fill:"white"}
return (
  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.7 73.6">
   <g onMouseEnter = {() => setmouseOver(true)} onMouseLeave = {() => setmouseOver(false)}>

      <polyline  points="32.5,11.6 59,29.2 59,62.1 6,62.1 6,29.2 32.5,11.6 " {...svgProps}/>
      <polygon  points="17.8,15.9 17.8,39.7 27.6,48.5 32.4,45.6 37.2,48.5 47.3,39.7 47.3,15.9 " {...svgProps}/>
      <line  x1="26.1" y1="40.9" x2="39.1" y2="40.9" {...svgProps}/>
      <circle  cx="32.6" cy="25.2" r="5.9" {...svgProps}/>
      <line  x1="32.6" y1="21.3" x2="32.6" y2="29.2" stroke = {getHoverColor(mouseOver)}/>
      <line  x1="28.8" y1="25.2" x2="36.6" y2="25.2" stroke = {getHoverColor(mouseOver)}/>
      <line  x1="6" y1="62.1" x2="27.6" y2="48.5" {...svgProps}/>
      <line  x1="37.2" y1="48.5" x2="59" y2="62.1" {...svgProps}/>
      <line  x1="59" y1="29.2" x2="47.3" y2="39.7" {...svgProps}/>
      <line  x1="6" y1="29.2" x2="17.8" y2="39.7" {...svgProps}/>
      <line  x1="24.7" y1="36.5" x2="41.2" y2="36.5" {...svgProps}/>
  </g>
  </svg>
);
}

export function ReportBug() {
  // Declare a new state variable, which we'll call "mouseOver"
  const [mouseOver, setmouseOver] = useState(false);
  const svgProps = {strokeWidth:0.5,stroke:"darkgrey",fill:"white"}
  const svgPropsMouse = {strokeWidth:0.6,stroke:getHoverColor(mouseOver),fill:"white"}
return (
  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.7 73.6">
   <g onMouseEnter = {() => setmouseOver(true)} onMouseLeave = {() => setmouseOver(false)}>

    <rect x="4.9" y="11.6"  width="54" height="50.4"{...svgProps}/>
    <line  x1="21.1" y1="45.4" x2="43" y2="45.4"{...svgProps}/>
    <line  x1="23.3" y1="51.1" x2="41" y2="51.1"{...svgProps}/>
    <line  x1="24.9" y1="56.7" x2="39" y2="56.7"{...svgProps}/>
    <ellipse  cx="31.8" cy="26.6" rx="5.5" ry="6.9" {...svgPropsMouse}/>
    <polyline  points="24.5,21.6 24.5,23.8 26.5,24.9 "{...svgPropsMouse}/>
    <line  x1="24.5" y1="27.1" x2="26.5" y2="27.1"{...svgPropsMouse}/>
    <line  x1="37.4" y1="27.1" x2="39.4" y2="27.1"{...svgPropsMouse}/>
    <polyline  points="39.6,21.6 39.6,23.8 37.4,24.9 "{...svgPropsMouse}/>
    <polyline  points="25.5,34.4 25.5,32.9 27.5,30.9 "{...svgPropsMouse}/> 
    <polyline  points="38.5,34.4 38.5,33 36.3,30.9 "{...svgPropsMouse}/>
    <path  d="M24.9,18.1c0,0,3.2,0.4,3.9,2.7" {...svgPropsMouse}/>
    <path  d="M38.7,17.7c0,0-2.2-0.4-4.1,2.7" {...svgPropsMouse}/>
    <ellipse  cx="30.2" cy="21.8" rx="0.6" ry="0.5" {...svgPropsMouse}/>
    <ellipse  cx="33.2" cy="21.8" rx="0.6" ry="0.5" {...svgPropsMouse}/>
    <path  d="M27.5,22.6c0,0,4.6,5.3,8.8-0.2"{...svgPropsMouse}/>
    
    <line  x1="32" y1="24.9" x2="32" y2="33.5"{...svgPropsMouse}/>

  </g>
  </svg>
);
}

export function SourceCodeDownload() {
  // Declare a new state variable, which we'll call "mouseOver"
  const [mouseOver, setmouseOver] = useState(false);
  const svgProps = {strokeWidth:0.5,stroke:"darkgrey",fill:"white"}
  const svgPropsMouse = {strokeWidth:0.6,stroke:getHoverColor(mouseOver),fill:"white"}
return (
  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.7 73.6">
  <g onMouseEnter = {() => setmouseOver(true)} onMouseLeave = {() => setmouseOver(false)}>

   <rect x="2.8" y="7" {...svgPropsMouse} width="34" height="3.5"/>
  <rect x="8" y="13.5" {...svgProps} width="33.1" height="3.5"/>
  <rect x="22.8" y="19.9" {...svgProps} width="28" height="3.5"/>
  <rect x="22.8" y="26.4" {...svgProps} width="28" height="3.5"/>
  <rect x="22.8" y="32.8" {...svgProps} width="28" height="3.5"/>
  <rect x="32.9" y="58.7" {...svgProps} width="28" height="3.5"/>
  <rect x="24.4" y="52.2" {...svgProps} width="28" height="3.5"/>
  <rect x="32.9" y="65.1" {...svgProps} width="28" height="3.5"/>
  <rect x="2.8" y="39.3" {...svgPropsMouse} width="34" height="3.5"/>
  <rect x="8" y="45.7" {...svgProps} width="34" height="3.5"/>

  </g>
  </svg>
);
}

export function VideoTutorialIcon() {
  // Declare a new state variable, which we'll call "mouseOver"
  const [mouseOver, setmouseOver] = useState(false);
  const svgProps = {strokeWidth:0.5,stroke:"darkgrey",fill:"white"}
  const svgPropsMouse = {strokeWidth:0.6,stroke:getHoverColor(mouseOver),fill:"white"}

return (
  
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63.7 73.6">
  <g onMouseEnter = {() => setmouseOver(true)} onMouseLeave = {() => setmouseOver(false)}>
  <path  d="M54.3,62H9c-2.8,0-5-2.2-5-5V35c0-2.8,2.2-5,5-5h45.3c2.8,0,5,2.2,5,5v22C59.3,59.7,57.1,62,54.3,62z" {...svgProps}/>
  <polygon  points="26.1,38.7 40,46.6 26.1,54.1" {...svgPropsMouse}/>
  <rect x="2" y="19.5" transform="matrix(0.9383 -0.3457 0.3457 0.9383 -5.9203 11.0594)" width="52" height="5.3" {...svgProps}/>
  <circle  cx="7.2" cy="29.8" r="1.9" {...svgProps}/>
  
  </g>
  </svg>
);
}


