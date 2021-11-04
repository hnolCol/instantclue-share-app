import React from "react";
import { useState } from "react";
import { Column, Table, Cell, TableLoadingOption, RegionCardinality, SelectionModes, Regions, Table2, ColumnHeaderCell, RowHeaderCell, } from "@blueprintjs/table";
import {Checkbox, MenuItem, Menu, Button,Icon, IconSize} from "@blueprintjs/core"

import { SketchPicker, BlockPicker, ChromePicker } from 'react-color'
import _ from "lodash"
function selectedRegionTransform(e) {

    return {
        rows: e.rows
    }
}


export function DataTable(props) {
    const {numRows, columnNames, data, loading, onSelection, onKeyDown} = props
    const cellRenderer = (rowIndex,columnIndex) => {
        if (data === undefined){
            return <Cell> </Cell>
        }
        else{
            return <Cell>{data[rowIndex][columnNames[columnIndex]]}</Cell>
        }
        
    }
    // const [isOpen, setIsOpen] = useState(false);
    // const toggleState = () => setIsOpen(!isOpen);
    return(

            <div onKeyDown = {onKeyDown}> 
                <Table2
                    numRows={numRows} 
                    loadingOptions ={loading ? [TableLoadingOption.CELLS,TableLoadingOption.COLUMN_HEADERS,TableLoadingOption.ROW_HEADERS] : []}
                    enableMultipleSelection = {true}
                    onSelection = {onSelection}
                    selectedRegionTransform = {selectedRegionTransform}
                    >
                        {columnNames.map((colName,index) => {
                            return (<Column key = {`${index}`} name = {colName} cellRenderer = {cellRenderer}/>)
                        })}
                </Table2>
                
            </div>
            )
    }



function ColorPicker(props) {
    const {reportColorBack, initialColor} = props
    const [color, setColor] = useState(initialColor);  

    const changeAndReportColor = (color) => {
        setColor(color)
        reportColorBack(color)

    }
    return(
        <ChromePicker color={color} onChange={changeAndReportColor} disableAlpha={true}/>
    )
}


export function SelectableDataTable(props) {

    // const columnNames = //["","Abc","cd"]
    // const data = props.data//[{"Abc":1,"cd":2},{"Abc":1,"cd":2}]
    const {numRows, columnNames, data, loading, onSelection, onKeyDown, showSelectionInTable, selectedItems, adjustColorInData, showOnlySelection, filterIdx} = props

    const [rowIdx,setRowIdx] = useState(undefined)
    const [rowNumber, setRowNumber] = useState(undefined)
    if (columnNames[0] !== "Select"){

        columnNames.unshift("Color")
        columnNames.unshift("Select")
    }
    var displayData = []
    if (showOnlySelection){

        if (filterIdx.length !==0){
            const selectedFilterIdx = _.filter(selectedItems,item => filterIdx.includes(item))
            displayData = _.filter(data.slice(), item => selectedFilterIdx.includes(item.idx))
        }
        else {

            displayData = _.filter(data.slice(), item => selectedItems.includes(item.idx))
        }
    }
    else if (filterIdx.length !==0){
        displayData = _.filter(data.slice(), item => filterIdx.includes(item.idx))
    }
    else {
        displayData = data.slice()
    }
    
    const onColorChange = (c) => {
       
        adjustColorInData(c,rowIdx)
    }

    const contextMenuRender = () => {
        
        return(
            <ColorPicker reportColorBack = {onColorChange} initialColor = {data[rowNumber]["color"]}/>
        )
    }
    

    const onRowSelection = (selection) => {
        
        if (selection.length===0) {return}
        
        if (selection[0].cols !== undefined && selection[0].rows !== undefined){
            const rowIndex = selection[0].rows[0]
            if (selection[0].cols[0] === 0)
                {
                    
                    onSelection(displayData[rowIndex]["idx"])
                
                }
            
            setRowIdx(displayData[rowIndex]["idx"])
            setRowNumber(rowIndex)
            }
        }
            
    

            // onClick = {() => onSelection(data[rowIndex]["idx"])}
            


            // if (selection[0]["rows"][0] !== rowIdx)
            //     {
            //         setRowIdx(selection[0]["rows"][0])
            // }
            // }
    const rowHeaderRenderer = (rowIndex) => {
        
        return <RowHeaderCell name={displayData[rowIndex]["idx"]}/>
    }
    const columnRenderer = (columnIndex) => {
        
        return <ColumnHeaderCell name = {columnNames[columnIndex]}/>

    } 
    const cellRenderer = (rowIndex,columnIndex) => {
        
        if (displayData === undefined){
            return <Cell> </Cell>
        }
        else if (columnIndex === 0) {
            
            return <Cell><Checkbox indeterminate={false} checked = {selectedItems.includes(displayData[rowIndex]["idx"])} /></Cell>
        }
        else if (columnIndex === 1){
            
            return selectedItems.includes(displayData[rowIndex]["idx"])?
                <Cell style={{backgroundColor:displayData[rowIndex]["color"]}}>
                    
                            {displayData[rowIndex]["color"]}
                       
                    </Cell>
                :
                <Cell></Cell>
        }
        else{
            return <Cell>{displayData[rowIndex][columnNames[columnIndex]]}</Cell>
        }}

        return (
        
        <Table2
           numRows = {numRows}
           enableMultipleSelection = {false}
           rowHeaderCellRenderer = {rowHeaderRenderer}
           forceRerenderOnSelectionChange={true}
            onSelection = {onRowSelection}
            selectionModes = {SelectionModes.ALL}
            defaultRowHeight = {25}
           bodyContextMenuRenderer={contextMenuRender}
           > 
           
           {columnNames.map((colName,index) => {
                            return (<Column key = {`${index}`} name = {colName} cellRenderer = {cellRenderer} columnHeaderCellRenderer={columnRenderer}/>)
                        })}
        
        </Table2>
        )
    }