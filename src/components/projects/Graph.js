import React from "react";
import axios from "axios"
import ICScatter from "../charts/Scatter"
import QuickSelect from "./QuickSelect"
import {DataTable} from "./DataTable"
import GridLayout from 'react-grid-layout';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import { TextInformation } from "./TextInformation";
import _  from "lodash";
import {findClosestMatch} from "../utils/Misc"
import {ICHoverPoints} from "../charts/utils/HoverPoints"
import {H5} from "@blueprintjs/core"

const initialState = {
                    isLoading:true,
                    success:false,
                    plotData:undefined,
                    props:undefined,
                    searchData:undefined,
                    selectedItems : [],
                    hoverActive: false,
                    hoverData : [],
                    isHovering : false,
                    searchColumnName : undefined,
                    isMarkdown : false
                        }


class GraphBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState
        this.setData = this.setData.bind(this)
        // this.addData = this.addData.bind(this)
        // this.deleteData = this.deleteData.bind(this)
        // this.handleSelection = this.handleSelection.bind(this)
        this._asyncDataFetch = this._asyncDataFetch.bind(this)
        this.onItemSelection = this.onItemSelection.bind(this)
        this.onTableSelection = this.onTableSelection.bind(this)
        this.onHover = this.onHover.bind(this)
        this.resetSelection = this.resetSelection.bind(this)
        this.activateHover = this.activateHover.bind(this)
        this.onTableKeyDown = this.onTableKeyDown.bind(this)
        // this.cancelDataAddition = this.cancelDataAddition.bind(this)
    }

    componentDidMount () {

        this._asyncDataFetch()
    } 

    _asyncDataFetch() {
        this.setState({isLoading:true})
        axios.get("/api/v1/graph", {params :{ url : this.props.url}} 
            )
            .then(response => {
                this.setData(response.data)})
    }
  
    setData(data) {
       
        if (data["plotData"] !== undefined && data["props"] !== undefined){
           
            this.setState(
                {
                    isLoading:false,
                    success:data["success"],
                    plotData:JSON.parse(data["plotData"]),
                    graphProps: data["props"],
                    searchData : JSON.parse(data["searchData"]),
                    searchColumnName : data["props"]["searchColumnName"],
                    isMarkdown: data["props"]["info-is-markdown"] !== 0,
                    
                }
                )
            }
    }

    onHover(pointCoords) {
            //console.log(pointCoords)
            this.setState({hoverData:pointCoords,isHovering:true})
       
    }

    resetSelection(){
        this.setState({hoverData:[],hoverActive:false,isHovering:false})
    }

    activateHover(){
        this.setState({hoverActive:true})
    }

    onItemSelection(selectedItems){
            
            this.setState({selectedItems:selectedItems})
        }

    onTableSelection(tableIndex){
        console.log(tableIndex)
        if (tableIndex.length === 0) return
        if (tableIndex !== undefined && tableIndex[0].rows !== undefined && this.state.plotData !== undefined && this.state.plotData.length > 0){
            const  minIdx  = tableIndex[0].rows[0]
            const maxIdx = tableIndex[0].rows[1]
            var selectedItemsInTable = []
            if (minIdx===maxIdx){
                selectedItemsInTable = selectedItemsInTable.concat([this.state.plotData[minIdx]])
                }
            else {
                
                selectedItemsInTable = selectedItemsInTable.concat(this.state.plotData.slice(minIdx,maxIdx+1))
            }
            
            var selectedItems =  _.mapValues(_.keyBy(selectedItemsInTable, 'idx'), this.state.searchColumnName)
            
            this.setState({selectedItems:selectedItems})
        }
    }


    onTableKeyDown(e){
        console.log(e.key)
        if (e.key === "ArrowDown") {
            console.log("down")
        }
        else if (e.key === "ArrowUp"){
            console.log("up")
        }
    }
    

    render() {
        
        const layout = {lg:[
            {i: 'text', x: 0, y: 0, w: 1, h: 1,},
            {i: 'scatter', x: 1, y: 0, w: 1, h: 1,},
            {i: 'b', x: 2, y: 0, w: 1, h: 1},
            {i: 'c', x: 0, y: 1, w: 3, h: 2, static:true}
          ],md:
          [
            {i: 'text', x: 0, y: 0, w: 1, h: 1,},
            {i: 'scatter', x: 1, y: 0, w: 1, h: 1,},
            {i: 'b', x: 2, y: 0, w: 1, h: 1},
            {i: 'c', x: 0, y: 1, w: 3, h: 2, static:true}
          ],
        }

        

        return (
            
            this.state.isLoading?null:
            <div style={{paddingTop:"35px",paddingLeft:"10px",paddingRight:"25px"}}>
            <ResponsiveGridLayout className="layout" layouts = {layout} rowHeight={400} width={1200}
                breakpoints={{lg: 1200, md: 996}} cols = {{lg:3,md:3}}>

    
                            <div key={'text'} style={{textAlign:"left"}}>
                                        <TextInformation 
                                                title = {this.state.graphProps.title} 
                                                subtitle ={this.state.graphProps.subtitle} 
                                                main = {this.state.graphProps.info}
                                                isMarkdown = {this.state.isMarkdown}/>
                            </div>
                            <div key = {"scatter"}>
                                    <svg width={400} height={400} onMouseEnter = {this.activateHover} onMouseLeave = {this.resetSelection}>
                                        
                                        <ICScatter 
                                            plotData={this.state.plotData} 
                                            xLabel={this.state.graphProps.xLabel}
                                            yLabel = {this.state.graphProps.yLabel}
                                            xDomain = {this.state.graphProps.domains.xDomain}
                                            yDomain = {this.state.graphProps.domains.yDomain}
                                            annotIdx = {this.state.graphProps.annotIdx}
                                            annotProps = {this.state.graphProps.annotProps}
                                            selectedItems = {this.state.selectedItems}
                                            onHover = {this.onHover}
                                            isHovering = {this.state.isHovering}
                                            hoverActive = {this.state.hoverActive}
                                            hoverColumnName = {this.state.graphProps.hoverColumnName}
                                            /> 

                                            <ICHoverPoints 
                                                hoverData = {this.state.hoverData}
                                                hoverColor = {this.state.graphProps.hoverColor}
                                            />
                                        
                                    </svg>
                                    
                                </div>
                
                
                
                            <div key={'b'}>
                            <QuickSelect items = {this.state.searchData} selectCallback = {this.onItemSelection}/>
                            </div>

                            <div key={'c'}>
                            <H5>Data Table</H5>
                            <div style={{height:"90%",overflow:"scroll",display:"flex"}}>
                            <DataTable 
                                numRows = {this.state.plotData===undefined?1:this.state.plotData.length}
                                columnNames = {this.state.plotData===undefined?[""]:Object.keys(this.state.plotData[0])}
                                data = {this.state.plotData}
                                loading = {this.state.loading}
                                onKeyDown = {this.onTableKeyDown}
                                onSelection = {this.onTableSelection}/>
                            </div>
                            </div>
            </ResponsiveGridLayout>
            </div>
        )
    }

    static defaultProps = {
        url : "testThis"
        }
}



export default GraphBase

