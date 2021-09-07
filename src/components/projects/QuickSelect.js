import React from "react";
import axios from "axios"
import { ItemRenderer, MultiSelect } from "@blueprintjs/select";
import { Menu, MenuItem, Intent , Tag} from "@blueprintjs/core";
import _ from "lodash"
const initialState = {
                    selectedItems : []
                    }


class QuickSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState
        this.selectItem = this.selectItem.bind(this)
        this.isItemSelected = this.isItemSelected.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.renderTag = this.renderTag.bind(this)
        this.tagRemove = this.tagRemove.bind(this)
        this.filterItems = this.filterItems.bind(this)
        this.addItem = this.addItem.bind(this)
        // this.addData = this.addData.bind(this)
        // this.deleteData = this.deleteData.bind(this)
        // this.handleSelection = this.handleSelection.bind(this)
       
    }

    addItem(item){
        var selItems = this.state.selectedItems.slice() 
        selItems = selItems.concat([item.idx])
        this.setState({selectedItems:selItems})
        this.handleSelectCallback(selItems)
    }

    handleSelectCallback(selectedItemsByUser){

        if (this.props.selectCallback !== undefined){
            var selectedItems = _.filter(this.props.items,function(item) {return selectedItemsByUser.includes(item.idx)})
            if (selectedItems !== undefined) {
                selectedItems = _.mapValues(_.keyBy(selectedItems, 'idx'), 'text')
                this.props.selectCallback(selectedItems)
            }
            
        }
    }
    renderItem(item, {modifiers, handleClick}){
        if (!modifiers.matchesPredicate) {
            return null;
        } 
        return(<MenuItem 
                active={modifiers.active} 
                icon = {this.isItemSelected(item)?"tick":item.text === "Search starts with 3 chars."?"search-text":"blank"}
                key = {item.idx} 
                text = {item.text} 
                minimal = {"true"}
                disabled = {item.text === "Search starts with 3 chars."}
                onClick={handleClick} 
                shouldDismissPopover={true}/>)
    }

    renderTag (itemIdx) {
        if (itemIdx < 0) {
            return ""
        }
        return _.filter(this.props.items,{"idx":itemIdx})[0]["text"]
        
    }

    selectItem(item){
        
        if (this.isItemSelected(item)) {
            this.removeItem(item)
        }
        else{
            this.addItem(item)
        }
    }

    isItemSelected(item){
        return this.state.selectedItems.includes(item.idx)
    }

    removeItem(item){
        var selItems = this.state.selectedItems.slice() 
        _.remove(selItems,function(x) {return x === item.idx})
        this.setState({selectedItems:selItems})
        this.handleSelectCallback(selItems)
    }

    tagRemove(tagText,index){
        var selItems = this.state.selectedItems.slice() 
        _.pullAt(selItems,[index])
        this.setState({selectedItems:selItems})
    }

    
    filterItems (searchString) { 
            
            if (searchString.length < 3) {return [{idx:-1,text:"Search starts with 3 chars."}]}
                
                const re = new RegExp(_.escapeRegExp(searchString), 'i')
                const isMatch = result => re.test(result.text)
                
                return(_.filter(this.props.items, isMatch))
        }

    render() {
        

        return (
            <div style={{paddingTop:"5px",paddingLeft:"12px",paddingRight:"12px"}} onClick = {e =>{
                e.stopPropagation();
              }}>
                <MultiSelect 
                    noResults={<MenuItem disabled={true} 
                                text="No results." icon={"search-text"}/>} 
                    initialContent = {<MenuItem disabled={true} text = {`${this.props.items.length} items to explore.`} icon={"search-text"} />}
                    selectedItems={this.state.selectedItems} 
                    onItemSelect = {this.selectItem} 
                    itemRenderer = {this.renderItem} 
                    items = {this.props.items} 
                    fill={true}
                    tagRenderer={this.renderTag}
                    popoverProps={{minimal: true, usePortal: false}}
                    resetOnSelect = {true}
                    itemListPredicate = {this.filterItems}
                    tagInputProps={{ tagProps: {intent: Intent.PRIMARY, interactive: true}, onRemove: this.tagRemove}}/>

            {/* <p>{this.state.selectedItems}</p> */}
            </div>
        )
    }

    static defaultProps = {
        items : [{"idx":0,"text":"hallo"},{"idx":1,"text":"genes"},{"idx":3,"text":"geneasds"}]
        }
}



export default QuickSelect

