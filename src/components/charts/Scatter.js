import React from "react";

import { scaleLinear} from '@visx/scale';
import { Text } from '@visx/text';
import Axis from "./utils/Axis"
import _ from "lodash"
import { localPoint } from '@visx/event';
import {findClosestMatch} from "../utils/Misc"
import { min } from "lodash-es";

var lastClickedIdx = -1


class ICScatter extends React.Component {
    constructor(props) {
        super(props);
        this.getMouseCoordinates = this.getMouseCoordinates.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        const {yDomain, xDomain} = this.props
        
        this.yDomainDiff = Math.abs(yDomain[1] - yDomain[0]) * 0.015
        this.xDomainDiff = Math.abs(xDomain[1] - xDomain[0]) * 0.015
       
        //define scales
        this.xScale = scaleLinear({
            domain : xDomain,
            //paddingInner: 0.3,
            nice: true
        }) 

        this.yScale = scaleLinear({
            domain : yDomain,
            nice: true
        }) 
    }

    
    getMouseCoordinates(e){
        const {xLabel,yLabel,plotData, onHover, hoverColumnName} = this.props
        const mouseCoord = localPoint(e)

        const point = {[xLabel]:this.xScale.invert(mouseCoord.x),
                        [yLabel]:this.yScale.invert(mouseCoord.y)}

        const minIdx = findClosestMatch(point,plotData,
                xLabel,
                yLabel)
        const closestPoint = plotData[minIdx]
        if (minIdx !== lastClickedIdx) {
            lastClickedIdx  = minIdx
            const xSVGCoords = this.xScale(closestPoint[xLabel])
            const ySVGCoords = this.yScale(closestPoint[yLabel])
            const xLabelCoord = this.xScale(closestPoint[xLabel]+this.xDomainDiff )
            const yLabelCoord = this.yScale(closestPoint[yLabel]+this.yDomainDiff)
            onHover([{
                x:xSVGCoords,
                y:ySVGCoords,
                xLabel:xLabelCoord,
                yLabel:yLabelCoord,
                size:closestPoint["size"],
                color:closestPoint["color"],
                idx:closestPoint["idx"],
                text:closestPoint[this.props.hoverSearchColumn]
            }])
        }
   
        
       
        
    }
       
    onMouseLeave(e){
        if (this.props.resetSelection !== undefined){
            this.props.resetSelection()
        }
        
    }

    onMouseEnter(e){
        if (this.props.activateHover !== undefined){
            this.props.activateHover()
        }
    }

    shouldComponentUpdate(nextProps, nextState){
        
        if (nextProps.isHovering && this.props.hoverActive){return false}
        return true
    }

    render () {
       
        const {boundaries, margin, xTickNum, yTickNum, data, dataLabels, mainColor, drawBox, selectedItems, hoverActive} = this.props

        const leftBound = boundaries.x + margin.left 
        const rightBound = boundaries.x + boundaries.width - margin.right
        const bottomBound = boundaries.y + boundaries.height - margin.bottom + margin.top
        const topBound = boundaries.y + margin.top 

        this.yScale.range([topBound,bottomBound]);
        this.xScale.range([leftBound, rightBound]);
        //const selectionActive = Object.keys(selectedItems).length > 0
        const colorInData = "color" in this.props.plotData[0]
        const sizeInData = "size" in this.props.plotData[0]
        const xLabelOffset = Math.abs(this.props.xDomain[1] - this.props.xDomain[0]) * 0.015
        const yLabelOffset = Math.abs(this.props.yDomain[1] - this.props.yDomain[0]) * 0.015
        console.log(xLabelOffset)
        var selectedData = []
        if (selectedItems.length > 0){
            selectedData = _.filter(this.props.displayData, item => selectedItems.includes(item.idx))
        }
        
       
        return (
                    // set range for scales
                    <g onMouseMove={this.getMouseCoordinates} >  
                        <Axis 
                            boundaries = {this.props.boundaries} 
                            margin = {this.props.margin} 
                            xLabel = {this.props.xLabel} 
                            yLabel = {this.props.yLabel}
                            xDomain = {this.props.xDomain}
                            yDomain = {this.props.yDomain}
                            />

                        {this.props.plotData.map(data => {
                            return(
                            
                            <circle key={`dot-${data.idx}`}
                                cx={this.xScale(data[this.props.xLabel])} 
                                cy={this.yScale(data[this.props.yLabel])} 
                                r={sizeInData?data["size"]:3} 
                                fill={hoverActive?"#efefef":colorInData?data["color"]:"#ec925f"}
                                strokeWidth={0.7} 
                                stroke={"black"}
                                opacity = {hoverActive?0.55:0.85}
                                />)
                            }
                            )}

                        {this.props.annotIdx && this.props.annotIdx !== 'null' && this.props.annotIdx !== undefined && this.props.annotIdx.length > 0 ?
                            this.props.annotIdx.map(dataIdx => {
                                return(<Text 
                                    key = {`txt-${dataIdx}`}
                                    x = {this.xScale(this.props.annotProps[dataIdx]["xytext"][0])} 
                                    y = {this.yScale(this.props.annotProps[dataIdx]["xytext"][1])}>
                                        {this.props.annotProps[dataIdx][this.props.hoverSearchColumn]}
                                    </Text>)
                            })
                            
                            :
                            null}

                        {selectedData.map(data => {
                            const xValue = this.xScale(data[this.props.xLabel])
                            const yValue = this.yScale(data[this.props.yLabel])
                            
                            return (
                            <g key = {`hoverGroup-${data.idx}`}>
                            {/* <rect x = {xValue} y = {yValue} width = {30} height={30} enableBackground={true} fill={"white"} stroke={"black"} strokeWidth={0.2}/> */}
                            <circle
                                key = {`selectedCircle-${data.idx}`} 
                                cx = {xValue} 
                                cy = {yValue}
                                r = {sizeInData?data["size"]:3} 
                                fill={data["color"]}
                                strokeWidth={0.7} 
                                stroke={"black"}/>
                            <Text 
                               key = {`SelectedTXT-${data.idx}`}
                                x = {this.xScale(data[this.props.xLabel]+xLabelOffset)} 
                                y = {this.yScale(data[this.props.yLabel]+yLabelOffset)}>
                                    {data[this.props.hoverSearchColumn]}
                            </Text>
                            </g>)
                        })
                        }
                       
                    
                    </g> 
            
        )
    }
    static defaultProps = {
        boundaries : {
                    x:0,
                    y:0,
                    width:400,
                    height:400},
        margin : {
            top: 10,
            left: 40,
            right: 10,
            bottom: 40,
            xAxis: 0,
            yAxis: 0
            },
        plotData : [{x:2,y:7},{x:3,y:9}],
        sactterSize : 5,
        drawBox : true,
        yDomain : [5,0],
        xDomain : [2, 8],
        xTickLabels:true,
        yTickLabels:true,
        xTickNum : 5,
        yTickNum : 5,
        xTickLength : -3,
        yTickLength : -3,
        xLabel : "xLabel",
        yLabel : "yLabel",
        mainColor : "black",
        xAxisColor : undefined,
        yAxisColor : undefined,
        xTickColor : undefined,
        yTickColor : undefined,
        xTickLabelColor : undefined,
        yTickLabelColor : undefined,
        annotIdx : [],
        annotProps : {},
        selectedItems : [],
        hoverSearchColumn : "Gene names"


    }
}

export default ICScatter