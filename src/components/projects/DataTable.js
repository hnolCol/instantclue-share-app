import React from "react";
import { Column, Table, Cell, TableLoadingOption, RegionCardinality, SelectionModes, Regions} from "@blueprintjs/table";

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
                <Table 
                    numRows={numRows} 
                    loadingOptions ={loading ? [TableLoadingOption.CELLS,TableLoadingOption.COLUMN_HEADERS,TableLoadingOption.ROW_HEADERS] : []}
                    enableMultipleSelection = {true}
                    onSelection = {onSelection}
                    selectedRegionTransform = {selectedRegionTransform}
                    >
                        {columnNames.map((colName,index) => {
                            return (<Column key = {`${index}`} name = {colName} cellRenderer = {cellRenderer}/>)
                        })}
                </Table>
                
            </div>
            )
    }