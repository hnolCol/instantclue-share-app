import React from "react";

import { scaleLinear} from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';


class Axis extends React.Component {
    constructor(props) {
        super(props);
       
        const {yDomain, xDomain} = this.props

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

       

    componentWillUpdate(nextProps, nextState){
        
        const {yDomain, xDomain} = this.props
        if (yDomain[0] !== nextProps.yDomain[0] || yDomain[1] !== nextProps.yDomain[1]) {
            this.yScale.domain(nextProps.yDomain)
        }
        if (xDomain[0] !== nextProps.xDomain[0] || xDomain[1] !== nextProps.xDomain[1]) {
            this.yScale.domain(nextProps.xDomain)
        }
    }


    render () {
       
        const {boundaries, margin, xTickNum, yTickNum, data, dataLabels, mainColor, drawBox} = this.props

        const leftBound = boundaries.x + margin.left 
        const rightBound = boundaries.x + boundaries.width - margin.right
        const bottomBound = boundaries.y + boundaries.height - margin.bottom + margin.top
        const topBound = boundaries.y + margin.top 

        this.yScale.range([topBound,bottomBound]);
        this.xScale.range([leftBound, rightBound]);
       
        return (
                    // set range for scales
                    <g>  
                    {drawBox ? <rect x = {leftBound} y = {topBound} width = {rightBound - leftBound} height = {bottomBound - topBound} fill = {"transparent"} stroke = {"black"}/>:null}       
                    <AxisLeft
                            left={leftBound-margin.yAxis}
                            bottom={bottomBound}
                            scale={this.yScale}
                            numTicks={yTickNum}
                            label={this.props.yLabel}
                            tickLength = {this.props.yTickLength}
                            labelOffset = {16}
                            labelProps={{
                                fill: mainColor,
                                textAnchor: 'middle',
                                fontSize: 11,
                                fontFamily: 'Arial',
                                dx : `${this.props.yTickLength>0?-(this.props.yTickLength-2):this.props.yTickLength-2.5}px`,
                            }}
                            stroke={this.props.yAxisColor===undefined?mainColor:this.props.yAxisColor}
                            tickStroke={this.props.yTickColor ===undefined? mainColor: this.props.yTickColor}
                            tickLabelProps={(value, index) => ({
                                display : this.props.yTickLabels?"flex":"none",
                                fill: this.props.yTickLabelColor===undefined?mainColor:this.props.yTickLabelColor,
                                textAnchor: 'end',
                                fontSize: 10,
                                fontFamily: 'Arial',
                                dominantBaseline:'middle',
                                formattedValue : Math.abs(value)>10000 || Math.abs(value) < 1e-5?value.toExponential():value,
                                dx : `${this.props.yTickLength>0?-(this.props.yTickLength-2):this.props.yTickLength-2.5}px`,                    
                            })}
                            tickComponent={({ formattedValue, ...tickProps }) => (
                                <text {...tickProps}>{formattedValue}</text>
                            )}
                            />

                    <AxisBottom
                        top={bottomBound+margin.xAxis}
                        left={0}
                        scale={this.xScale}
                        numTicks={xTickNum}
                        label={this.props.xLabel}
                        tickLength = {this.props.xTickLength}
                        labelOffset={4}
                        labelProps={{
                            fill: mainColor,
                            textAnchor: 'middle',
                            fontSize: 11,
                            fontFamily: 'Arial',
                            dy : `${this.props.xTickLength>0?-(this.props.xTickLength-2):Math.abs(this.props.xTickLength)}px`

                        }}
                        stroke={this.props.xAxisColor===undefined?mainColor:this.props.xAxisColor}
                        tickStroke={this.props.xTickColor ===undefined? mainColor: this.props.xTickColor}
                        tickLabelProps={(value, index) => ({
                            display : this.props.xTickLabels?"flex":"none",
                            fill: this.props.xTickLabelColor===undefined?mainColor:this.props.xTickLabelColor,
                            textAnchor: 'middle',
                            fontSize: 10,
                            fontFamily: 'Arial',
                            dy : `${this.props.xTickLength>0?-(this.props.xTickLength-2):Math.abs(this.props.xTickLength)}px`
                        })}
                        tickComponent={({ formattedValue, ...tickProps }) => (
                            <text {...tickProps}>{formattedValue}</text>
                        )}
                        />      
                    
                    
                        </g> 
            
        )
    }
    static defaultProps = {
        boundaries : {
                    x:0,
                    y:0,
                    width:200,
                    height:200},
        margin : {
            top: 5,
            left: 25,
            right: 5,
            bottom: 5,
            xAxis: 0,
            yAxis: 0
            },

        drawBox : true,
        yDomain : [10,0],
        xDomain : [-0.03, 6],
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

    }
}

export default Axis