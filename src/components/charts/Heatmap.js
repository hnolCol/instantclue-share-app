import React from "react";


import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { format } from 'd3-format';
import _ from "lodash"
import { localPoint } from '@visx/event';
import {findClosestMatch} from "../utils/Misc"
import { Colors } from "@blueprintjs/core";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
const oneDecimalFormat = format('.1f');
const initialState = {mouseOver:{row:[],
                                column:[],
                                x:[],
                                y:[],
                                count:[]},
                    legendHighlight : [],
                    rowLabels : [],
                    mouseEntered:false,

                    viewBox : "0 0 100 100"}

var globalBinHeight = 0

class Heatmap extends React.Component {

    constructor(props) {

        super(props);
        initialState.viewBox = `0 0 ${props.width} ${props.height}`
        initialState.rowLabels = props.data.rowLabels
        this.state = initialState

        this.setCoordinates = this.setCoordinates.bind(this)
        this.mouseOverSVG = this.mouseOverSVG.bind(this)
        this.handleOnWheel = this.handleOnWheel.bind(this)

        this.colorScale = scaleLinear({
            //iniate blue_red linear color scale by default
            range:this.props.colorPalette,
            domain:this.props.data.colorValues
                })
        
        this.extraColorScale = scaleLinear({
            //
            range:this.props.colorPaletteExtra,
            domain:this.props.data.extraColorValues
                        })

        const nExtraValues = this.props.data.extraValues.length
        this.extraCols = nExtraValues===0? 0: 1 + nExtraValues //+ 1 for space
        
        const extraDomain = nExtraValues===0?[]:this.props.data.extraValues.map(v => v.label)
            
        this.xExtraScale = scaleBand({
            domain: extraDomain
        })

        this.xScale = scaleBand({
                domain: this.props.data.colLabels,
                })
        
        this.yScale = scaleBand({
                    domain: this.props.data.rowLabels,
                    })
        if (this.props.data.colLabelColors !== undefined){
            this.colorGroupScale = scaleOrdinal({
                range: this.props.data.colLabelColors.colors,
                domain:this.props.data.colLabelColors.categories
            })
            
        }
      }

      mouseOverSVG(event) {
           const eventName = event.dispatchConfig.registrationName
           if (eventName === "onMouseLeave"){this.setState(initialState)}
           //else {this.setState({mouseEntered:true})}
          
      }

      setCoordinates(rowNum,columnNum,x,y,count) {
        if (this.state.mouseOver.row === rowNum &&  this.state.mouseOver.column === columnNum) {
            return
        }

        const mouseOverEvent = {row:[rowNum],
                        column:[columnNum],x:x,y:y,count:count}
        
        this.setState({mouseOver:mouseOverEvent,mouseEntered:true})
      }

      handleLegendMouseEnter (label) {
            if (label === undefined) { 
                this.setState(initialState)
            }
            else {
                const colLabels = this.props.data.colLabelColors[0].labels.includes(label) ? 

                        this.props.data.colLabelColors[0].labels 
                    : 
                        this.props.data.colLabelColors[1].labels

                const columnIdx = colLabels
                        .map((gropLabel, colNum) => gropLabel === label ? colNum : null)
                        .filter(i => i !== null)
                
                const mouseOverEvent = {row:[],
                            column:columnIdx,x:[],y:[],count:[]}
                this.setState({mouseOver:mouseOverEvent,mouseEntered:true,legendHighlight:[label]})
            }
      }


      calculateLimits(width,height) {

            const {margin} = this.props;
            const xMax = width - margin.right
            const yMax = height - margin.bottom

            return {xLimit:xMax,yLimit:yMax}
      }

      handleOnWheel(e) {
          console.log(e)
          console.log(e.deltaY)
          const domain = this.yScale.domain()
          if (domain.length > 2){
              this.setState({rowLabels:this.props.data.rowLabels.slice(0,2)})
          }
          else {
            this.setState({rowLabels:this.props.data.rowLabels})
          }

          //this.props.data.rowLabels
          //this.setState({rowLabels:})
          
          //const yOffset = e.deltaY > 0? globalBinHeight * e.deltaY: 
          
        //   this.setState({viewBox:`0 ${globalBinHeight * e.deltaY} 200 ${globalBinHeight*10}`})

      }

      render() {
        //initial ParentSize
        const mainColor = this.props.darkMode?Colors.LIGHT_GRAY1:Colors.BLACK
        const {margin, rectStyleProps, width, height} = this.props
               
        //calculateMargins
        const plotHeight = height // legend
        
        const limits = this.calculateLimits(width,plotHeight)
        
        const marginTop = margin.top + 60
        const binWidth = (limits.xLimit-margin.left) / (this.props.data.nCols + this.extraCols)
        // console.log(this.props.data.colLabelColors)
        
        const numColLabels = Object.keys(this.props.data.colLabelColors).length===0?0:this.props.data.colLabelColors.n.length
        const binHeight =  this.props.fixedBinHeight?
                    this.props.binHeight:
                    (limits.yLimit - marginTop) / (this.state.rowLabels.length + numColLabels)
       
 
        

        this.yScale.domain(this.state.rowLabels)
        console.log(this.state.rowLabels)
        this.xScale.range([margin.left, limits.xLimit - this.extraCols*binWidth]);
        this.yScale.range([marginTop + binHeight * numColLabels,
                            limits.yLimit]);
        this.xExtraScale.range(
                [limits.xLimit-(this.extraCols-1)*binWidth,
                limits.xLimit])

        
        
        return (
        //define svg
        
        width!==0?
                    <svg width={width} height={height} viewBox = {this.state.viewBox}>
                    <Group onWheel={this.handleOnWheel}>
                        
                    {this.props.data.values.map((v,nRow) => {
                        var y = this.yScale(this.props.data.rowLabels[nRow])
                        if (y===undefined) return null
                        return v.map((value,nCol) => {
                            var x = this.xScale(this.props.data.colLabels[nCol])
                            
                            var fill = value !== null?this.colorScale(value):"#eeeeee"

                            return (
                                
                                <rect 
                                    key = {`mainH${nRow}${nCol}`}
                                    x = {x}//{0+binWidth*nCol+margin.left} 
                                    y={y} 
                                    width={binWidth} 
                                    height={binHeight} 
                                    fill={fill}
                                    fillOpacity={this.state.mouseEntered?
                                                    (this.state.mouseOver.row.includes(nRow)) 
                                                    || (this.state.mouseOver.column.includes(nCol))?1:0.2:1}
                                    {...rectStyleProps}
                                    // onMouseEnter={event => {
                                    //     this.setCoordinates(nRow,nCol,x,y,value)
                                    // }}
                                />
                            )
                        })
                    
                    })}
                    {/* {this.props.data.extraValues.map((v,nColExtra) => {
                        var columnName = v.label
                        var x = this.xExtraScale(columnName)
                        return v.data.map((value,nRow) => {
                            var y = this.yScale(this.props.data.rowLabels[nRow])
                            var fill = this.extraColorScale(value)
                            return (
                                <rect x={x} y={y} 
                                    key = {`extraH${nRow}${nColExtra}`}
                                    width={binWidth} 
                                    height={binHeight}
                                    fillOpacity={this.state.mouseEntered?
                                            this.state.mouseOver.row.includes(nRow)?1:0.2:1}
                                    fill={fill} 
                                    {...rectStyleProps}
                                    onMouseEnter={event => {
                                        this.setCoordinates(nRow,null,x,y,value)
                                    }
                                }/>
                            )

                        })
                    })
                    
                    } */}

                        {this.props.data.extraValues.map((v,nColExtra) => {
                        var columnName = v.label
                        var x = this.xExtraScale(columnName)
                        var nRow = this.state.mouseOver.row.length > 0 ? this.state.mouseOver.row[0] : null
                        if (this.state.mouseEntered && nRow !== null) {
                            var y = this.yScale(this.props.data.rowLabels[nRow])
                        }
                        else {var y =  null}

                        return <text key = {`xV${nColExtra}`} 
                            x={x+binWidth + binWidth/4} 
                            y={y+binHeight/2}
                            fontSize = {8}
                            fill = {mainColor}
                            dominantBaseline="central" 
                            textAnchor={"start"}>
                                {y!==null?v.data[nRow]:""}
                            </text>
                    
                        }
                    )}

                    {//add column labels
                    this.props.data.colLabelColors === undefined ||  Object.keys(this.props.data.colLabelColors).length===0? 
                    
                    this.props.data.colLabels.map((columnName, nColLab) => {
                        var x = this.xScale(columnName)+binWidth/2
                        var y = margin.top - 5 
                        
                        return(<text 
                                key = {`colLabel${columnName}+${nColLab}`}
                                x={x} 
                                y={y} 
                                fill = {this.state.mouseEntered?"red":"blue"}
                                fontWeight = {this.state.mouseEntered?
                                    this.state.mouseOver.column.includes(nColLab)?"bold":"normal":"normal"} 
                                transform={`rotate(-45 ${x} ${y})`}
                                {...this.props.columnLabelProps}>
                                    {columnName}
                                </text>)
                        })
                    :
                        this.props.data.colLabelColors.n.map(nGroup => {
                            var y = marginTop - binHeight * (nGroup - 1) - binHeight/2
                            return(
                            this.props.data.colLabels.map((columnName, nColLab) => {
                                var x = this.xScale(columnName)
                            
                                return (
                                    <rect key = {`colLabel${columnName}+${nColLab}+${nGroup}`} 
                                        x = {x} 
                                        y= {y} 
                                        fill={
                                            this.colorGroupScale(this.props.data.colLabelColors[nGroup].labels[nColLab]) 
                                        } 
                                        width={binWidth} 
                                        height={binHeight}
                                        fillOpacity={this.state.mouseEntered?
                                            this.state.mouseOver.column.includes(nColLab)?1:0.2:1}
                                        {...rectStyleProps}
                                        />
                            )
                        }))
                    })
                    }

                    {//add row labels
                    this.props.data.rowLabels.map((rowName,nRowLab) => {
                        var y = this.yScale(rowName)+binHeight/2
                        var x = margin.left-5
                       
                        return(<text 
                                key = {`rowLabel${rowName}+${nRowLab}`}
                                x={x} 
                                y={y} 
                                fontWeight = {this.state.mouseEntered?
                                            this.state.mouseOver.row.includes(nRowLab)?"bold":"normal":"normal"} 
                                fill = {mainColor}
                                {...this.props.rowLabelProps}>
                                    {rowName}
                                </text>)
                        })}

                    {/* {//add extra column labels
                    this.props.data.extraValues.map((v,nColExtra) => {
                        var columnName = v.label
                        var x = this.xExtraScale(columnName)
                        var y = margin.top - 5 
                        return(<text 
                                key = {`extraColLabel${columnName}`}
                                x={x} 
                                y={y} 
                                fill = {mainColor}
                                transform={`rotate(-45 ${x} ${y})`}
                                {...this.props.columnLabelProps}>
                                    {columnName}
                                </text>)
                        })}
                     */}
                    

                    </Group>
                    </svg>

                    :<svg></svg>
                    )
                    }

      static defaultProps = {

        data : {nRows:4,
                nCols:3,
                rowLabels: ["Gene 1","Gene 2","Gene 3","Gene 4"],
                colLabels: ["Gene1 1","Gene1 2","Gene1 5"],
                colorValues:[-1,0.75,0.25,0,0.25,0.75,1], //must contain as many values as colorPalette
                    
                extraColorValues:[-1,-0.66,-0.33,0,0.33,0.6,1],
                extraValues: [{label:"Extra 1",data:[0.1,0.3,-1,-0.2]},
                              {label:"Extra 2",data:[0.1,0.3,-1,-0.2]}], //data must be of length: nRows
                values:
                    [[-2,0.5,0.5],[-0.2,0.4,0.6],[0.2,0.1,0.8],[0.2,0.4,0.5]],
                colLabelColors : {
                                n:[0,1],
                                categories : ["Cat1","Cat2"],
                                colors : ["blue","orange"],
                                0:{labels:["Cat1","Cat2","Cat1"]},
                                1:{labels:["Cat2","Cat2","Cat1"]}
                            }
                },
        colorPalette:["#2166ac",  //default is Blue low Red hight
                        "#67a9cf",
                        "#d1e5f0",
                        "#f7f7f7",
                        "#fddbc7",
                        "#ef8a62",
                        "#b2182b"],
        colorPaletteExtra:["#3288bd", //reverse spectral
                            "#99d594",
                            "#e6f598",
                            "#ffffbf",
                            "#fee08b",
                            "#fc8d59",
                            "#d53e4f"],

        rectStyleProps : {strokeWidth:0.4, stroke:"black"},

        columnLabelProps : {textAnchor: 'start',
                            fontSize: 9,
                            fontFamily: 'Arial'},

        rowLabelProps : {textAnchor: 'end',
                        fontSize: 9,
                        fontFamily: 'Arial',
                        dominantBaseline: "middle"},
                        
        margin : {
                top: 2,
                left: 80,
                right: 30,
                bottom: 5
                },
        darkMode: false,
        fixedBinHeight: false,
        fixedBinWidth: false,
        binHeight: 30,
      }

}

export default Heatmap
