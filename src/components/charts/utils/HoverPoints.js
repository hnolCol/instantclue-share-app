import React from "react";
import { Text } from '@visx/text';
import _ from "lodash"


export function ICHoverPoints(props) {
    const {hoverData, hoverColor} = props
    
    return(
            <g>


                {hoverData.map(data => {
                    
                    return (
                    <g key = {`hoverGroup-${data.idx}`}>
                    {/* <rect x = {xValue} y = {yValue} width = {30} height={30} enableBackground={true} fill={"white"} stroke={"black"} strokeWidth={0.2}/> */}
                    <circle
                        key = {`selectedCircle-${data.idx}`} 
                        cx = {data.x} 
                        cy = {data.y}
                        r = {data.size}
                        fill={hoverColor} //data.color
                        strokeWidth={0.7} 
                        stroke={"black"}/>
                    <Text 
                        key = {`SelectedTXT-${data.idx}`}
                        style = {{cursor:"pointer"}}
                        x = {data.xLabel} 
                        y = {data.yLabel}>
                            {data.text}
                    </Text>
                    </g>)
                })
                }
                
            </g>
            
            )
}

