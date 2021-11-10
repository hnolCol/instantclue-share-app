import React from "react";
import axios from "axios"
import ICScatter from "../charts/Scatter"
import ICHeatmap from "../charts/Heatmap"
import QuickSelect from "./QuickSelect"
import {DataTable, SelectableDataTable} from "./DataTable"
import Combobox from "../utils/Comboxbox"
// import GridLayout from 'react-grid-layout';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
import RGL, { WidthProvider } from "react-grid-layout";
import { TextInformation } from "./TextInformation";
import _  from "lodash";
// import {findClosestMatch} from "../utils/Misc"
import {ICHoverPoints} from "../charts/utils/HoverPoints"
import {Code, H5, Text, NavbarGroup, NavbarDivider, Button, Alignment, InputGroup, Icon, H4, MenuItem, Menu, H2, Drawer, ControlGroup} from "@blueprintjs/core"
import { ParentSize } from '@visx/responsive';
import { Mailto, openURL } from "../utils/Misc";
import { Popover2 } from "@blueprintjs/popover2";
import CsvDownload from "react-json-to-csv"
import { TooltipButton } from "../utils/TooltipButton";


const ReactGridLayout = WidthProvider(RGL);
const initialState = {
                    isLoading:true,
                    success:false,
                    plotData:undefined,
                    props:undefined,
                    searchData:undefined,
                    selectedItems : [],
                    displayData : [],
                    hoverActive: false,
                    hoverData : [],
                    isHovering : false,
                    searchColumnName : undefined,
                    isMarkdown : false,
                    msg : "",
                    plotType: "scatter",
                    showOnlySelection : false,
                    tableFilterIdx : [],
                    drawerOpen : false,
                    searchColumns : []
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
        this.showSelectionInTable = this.showSelectionInTable.bind(this)
        this.colorAdjustment = this.colorAdjustment.bind(this)
        this.onSearchStringChange = this.onSearchStringChange.bind(this)
        this.getTableNumRows = this.getTableNumRows.bind(this)
        this.removeTableSelection = this.removeTableSelection.bind(this)
        this.setSearchColumn = this.setSearchColumn.bind(this)
        this.toggleDrawer = this.toggleDrawer.bind(this)
        // this.cancelDataAddition = this.cancelDataAddition.bind(this)
    }

    componentDidMount () {

        this._asyncDataFetch()
    } 

    _asyncDataFetch() {
        this.setState({isLoading:true})
        axios.get("/api/v1/graph", {params :{ graphID : this.props.graphID}} 
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
                    displayData: JSON.parse(data["plotData"]),
                    graphProps: data["props"],
                    searchData : JSON.parse(data["searchData"]),
                    searchColumnName : data["props"]["searchColumnName"][0],
                    searchColumns : data["props"]["searchColumnName"],
                    isMarkdown: data["props"]["info-is-markdown"] !== 0,
                    
                }
                )
            }
        else {
            this.setState({
                isLoading:false,
                success:data["success"],
                msg : data["msg"]
            })
        }
    }

    toggleDrawer(){
        this.setState(prevState => ({
            drawerOpen: !prevState.drawerOpen
          }));
    }

    colorAdjustment(color,idx){
        if (color.hex !== undefined){

            const objIndex = this.state.displayData.findIndex(obj => obj.idx === idx)
            const displayData = this.state.displayData.slice()
            if (displayData[objIndex]!== undefined && displayData[objIndex].color !== undefined){
                displayData[objIndex].color = color.hex
                this.setState({displayData:displayData})
            }
            
        }
        
        //objIndex = myArray.findIndex((obj => obj.id == 1));
    }

    onHover(pointCoords) {
            //console.log(pointCoords)
            this.setState({hoverData:pointCoords,isHovering:true})
       
    }

    onSearchStringChange (e) {
        const newSearchString = e.target.value
        const searchName = this.state.searchColumnName
        if (newSearchString.length > 1 && Object.keys(this.state.displayData[0]).includes(searchName)){
            
         
            const searchMatches = _.filter(this.state.displayData, function(o) {return o[searchName].includes(newSearchString)})
            const idxMatches = searchMatches.map(({ idx }) => idx)
            // this.setState({displayData:searchMatches})
            this.setState({tableFilterIdx:idxMatches})
        }
        else if (newSearchString.length === 0){
            // rest + this.setState({displayData:this.state.plotData.slice()})
            
            this.setState({tableFilterIdx:[]})
        }
        
        
        // this.setState({showOnlySelection:false,displayData:newDisplayData})
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

        //this.setState({selectedItems:[tableIndex]})
        const selectedItems = this.state.selectedItems.slice()
        var updatedItemList = []
        if (selectedItems.includes(tableIndex)) {
            updatedItemList = selectedItems.filter(item => item !== tableIndex)
            this.setState({selectedItems:updatedItemList})
        }
        else {
        
            selectedItems.push(tableIndex)
            this.setState({selectedItems:selectedItems})
        }
    }

    removeTableSelection(){
        this.setState({selectedItems:[],showOnlySelection:false,filterIdx:[]})
    }


    onTableKeyDown(e){
        //console.log(e.key)
        if (e.key === "ArrowDown") {
            console.log("down")
        }
        else if (e.key === "ArrowUp"){
            console.log("up")
        }
    }


    showSelectionInTable(){
        this.setState(prevState => ({
            showOnlySelection: !prevState.showOnlySelection
          }));
        
    }

    setSearchColumn (searchColumnName) {
        //console.log(searchColumnName)
        this.setState({searchColumnName:searchColumnName})
    }


    getTableNumRows() {
        if (this.state.displayData === undefined) return 0

        if (this.state.tableFilterIdx.length === 0 && this.state.showOnlySelection === false) return this.state.displayData.length

        if (this.state.tableFilterIdx.length === 0 && this.state.showOnlySelection) return this.state.selectedItems.length

        if (this.state.tableFilterIdx.length !== 0 && this.state.showOnlySelection) return _.filter(this.state.selectedItems,item => this.state.tableFilterIdx.includes(item)).length

        if (this.state.tableFilterIdx.length !== 0 && this.state.showOnlySelection === false) return this.state.tableFilterIdx.length
        
        return 0
        
    }

    render() {
        
        const layout = {lg:[
            {i: 'graph', x: 0, y: 0, w: 3, h: 2},
            // {i: 'qs', x: 0, y: 0, w: 1, h: 1, static:true},
            {i: 'c', x: 3, y: 0, w: 3, h: 2}
          ],md:
          [
            {i: 'graph', x: 0, y: 0, w: 3, h: 2},
            // {i: 'qs', x: 0, y: 0, w: 1, h: 1, static:true},
            {i: 'c', x: 3, y: 0, w: 3, h: 2}
          ],
        }

        

        return (
            
            this.state.isLoading?null:
            
            <div style={{paddingTop:"35px",paddingLeft:"10px",paddingRight:"25px"}}>
  

                {this.state.success === false? 
                    
                <div style={{textAlign:"center",clear:"both"}}>
                    <Text>There was an unexpected error. The server returned the following message</Text>
                    <Code>{this.state.msg}</Code>
                </div>: 
                <div>
                <Drawer isOpen={this.state.drawerOpen} onClose={this.toggleDrawer} title={`Graph Details (${this.state.graphProps.title})`}> 
                <p>Contact Information</p>
                <p>{this.state.graphProps.contact}</p>
                <TextInformation 
                                                title = {this.state.graphProps.title} 
                                                subtitle ={this.state.graphProps.subtitle} 
                                                main = {this.state.graphProps.info}
                                                isMarkdown = {this.state.isMarkdown}/>
                </Drawer>
                <div style={{position:"absolute",top:"0px",zIndex:200,height:"50px",width:"50%"}}>
                        <div style={{position:"absolute",top:"50%",transform: "translateY(-50%)", fontFamily:"Helvetica Neue",fontSize:"20px",fontWeight:"300"}}>
                         <p><span style={{color:"#286FA4"}}>{this.state.graphProps.title}</span> ({this.state.graphProps.subtitle})</p>
                         <div>
                         {this.state.graphProps.contact !== undefined && this.state.graphProps.contact !== ""?
                            <Mailto 
                                email = {this.state.graphProps["contact"]} 
                                body={""} 
                                subject={`InstantClueShare: Question about graph : ${this.state.graphProps.title} (${this.state.graphProps.graphID})`}>
                                        <Button minimal={true} icon="envelope" intent="primary" />
                            </Mailto>: <Button minimal={true} icon="envelope" disabled={true}/>}
                         <Button icon={"info-sign"} minimal={true} intent={"success"} onClick={this.toggleDrawer}/>
                         
                         
                        
                         </div>
                        </div>
                       
                </div>
                <ReactGridLayout className="layout" layout = {layout.md} rowHeight={400} cols = {6} isDraggable = {false} isResizable={false}
                           >
                        
                        <div key={'c'} style = {{border:"solid 0.5px darkgrey","borderRadius":"6px"}}>
                                <div style={{height:"100%"}}>
                                    <div style={{paddingTop:"5px",paddingRight:"3px", paddingLeft:"3px"}}>
                                        <ControlGroup>
                                       
                                        <InputGroup
                                            style={{marginTop:"2px"}}
                                            leftElement={<Icon icon="search" />}
                                            placeholder={`Search ${this.state.searchColumnName}`}
                                            fill={true}
                                            onChange = {this.onSearchStringChange}
                                        />
                                        <TooltipButton 
                                                    content = {
                                                            this.state.searchColumns.length > 0?
                                                            <div style={{padding:"5px"}}>
                                                            <Menu>
                                                                {this.state.searchColumns.map((item,index) => {
                                                                return <MenuItem key = {index} text={item} onClick = {() => {this.setSearchColumn(item)}} intent = {item === this.state.searchColumnName?"primary":"none"} icon = {item === this.state.searchColumnName?"tick":"none"}/>})}
                                                            </Menu></div>:null
                                                    }
                                                    popoverProps = {{placement:"auto",interactionKind:"click"}}
                                                    buttonProps = {{icon:"caret-right"}} />
                                        <TooltipButton 
                                                    content = {
                                                            <Menu> 
                                                            <p>If activated, only selected features will be shown.</p>
                                                            </Menu>
                                                    }
                                                    popoverProps = {{placement:"top",interactionKind:"hover",hoverOpenDelay:120}}
                                                    buttonProps = {{icon:this.state.showOnlySelection?"filter-remove":"filter",onClick:this.showSelectionInTable,intent:this.state.showOnlySelection?"primary":"none"}} />

                                    <TooltipButton 
                                                    content = {
                                                            <Menu>
                                                            <p>Remove selection.</p>
                                                            </Menu>
                                                    }
                                                    popoverProps = {{placement:"top",interactionKind:"hover",hoverOpenDelay:120}}
                                                    buttonProps = {{icon:"remove",onClick:this.removeTableSelection,intent:"danger"}} />

                                        <CsvDownload className={"bp3-button"} data = {this.state.plotData} filename={`PlotData(${this.props.graphID} - ${this.state.graphProps.title}).csv`}>
                                             <Icon icon={"download"}/>
                                        </CsvDownload>
                                        </ControlGroup>
                                    </div>

                                    <div style={{marginTop:"5px",minHeight:"90%",maxHeight:"90%",overflow:"scroll"}}>
                                        <SelectableDataTable 
                                            numRows = {this.getTableNumRows()}
                                            columnNames = {this.state.displayData===undefined?[""]:Object.keys(this.state.displayData[0])}
                                            data = {this.state.displayData}
                                            onSelection = {this.onTableSelection} 
                                            selectedItems = {this.state.selectedItems}
                                            adjustColorInData = {this.colorAdjustment}
                                            showOnlySelection = {this.state.showOnlySelection}
                                            filterIdx = {this.state.tableFilterIdx}
                                            />
                                    </div>
                                
                                </div>
                            </div>
    
                            
                            <div key = {"graph"} style = {{border:"solid 0.5px darkgrey","borderRadius":"6px"}}> 
                            <ParentSize >
                                    {({ width, height }) => {
                                        if (width > 0 && height > 0){
                                            
                                            return (
                                            
                                                this.state.plotType === "scatter"?
                                                 <svg width={width} height={height} onMouseEnter = {this.activateHover} onMouseLeave = {this.resetSelection}>
                                            
                                            
                                                    <g style = {{cursor:"pointer"}}>
                                                    <ICScatter 
                                                        boundaries = {{x:0,
                                                                        y:0,
                                                                        width:width,
                                                                        height:height}}            
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
                                                        displayData = {this.state.displayData}
                                                        hoverSearchColumn = {this.state.searchColumnName}
                                                        /> 

                                                        <ICHoverPoints 
                                                            hoverData = {this.state.hoverData}
                                                            hoverColor = {this.state.graphProps.hoverColor}
                                                        />
                                                        </g>
                                                        </svg>: //no scatter

                                                  
                                                   
                                                        <ICHeatmap 
                                                            data = {this.state.graphProps["data"]}
                                                            colorPalette = {this.state.graphProps["colorPalette"]}
                                                            width = {width}
                                                            height = {height}/>
                                                    )
                                        }
                                        else
                                        {
                                            return <svg></svg>
                                        }
                                    
                                    }}
                                </ParentSize>
                                    
                                </div>
                
                
                
                            

                            
                            
            </ReactGridLayout>
            </div>
            }
            </div>
           
        )
    }

    static defaultProps = {
        url : "testThis"
        }
}



export default GraphBase

