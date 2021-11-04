import React from "react";
import {Select} from "@blueprintjs/select"
import {MenuItem, Button, Icon} from "@blueprintjs/core"
import _ from "lodash";

class Combobox extends React.Component {  
    
    constructor(props) {

        super(props);
        if (this.props.staticItems) {
            this.state = {description : props.description,selected:props.defaultItem}
        }
        else {
            this.state = {description : props.description,items:props.items,selected:props.defaultItem}
        }
        
        this.handleItemSelect = this.handleItemSelect.bind(this)
        this.createNewItemFromQuery = this.createNewItemFromQuery.bind(this)
        this.filterItems  = this.filterItems.bind(this)
        this.addItem = this.addItem.bind(this)
        this.renderCreateNewItem = this.renderCreateNewItem.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.prevProp = this.prevProp.bind(this)
       
      }

    renderCreateNewItem(query,active,handleClick) {
        
        return (
        <MenuItem
            icon = {"add"}
            text = {`Create "${query}"`}
            shouldDismissPopover={false}
            active = {active}
            onClick = {this.addItem}> 
        </MenuItem>
        )
    }

    addItem(e) {
        let newSelection = this.state.items.slice();
        newSelection.push({"text":this.state.newItem,"label":"Custom"})
        this.setState({items:newSelection})
    }

    createNewItemFromQuery (itemName) {
        this.setState({newItem:itemName})
       
    }


    renderItem  (item, { handleClick, modifiers, query }) {
        
        if (!modifiers.matchesPredicate) {
            return null;
        } 
        return (
            <MenuItem 
                text={item.text} 
                key = {`${item.text}`}
                active={modifiers.active}
                label={item.label} 
                minimal = {"true"}
                onClick={handleClick} 
                onMouseDown = {this.prevProp}               
                icon={item.icon === undefined ? this.state.selected === item.text ? "tick" : "blank" : item.icon}
                style={{fontSize:"10px",overflowY:"hidden"}}
               >
            </MenuItem>
        )
    }

    filterItems (searchString) { 

        if (this.props.minCharForFilter !== undefined && searchString.length < this.props.minCharForFilter) {return []}
        const re = new RegExp(_.escapeRegExp(searchString), 'i')
        const isMatch = result => ((re.test(result.text) || 
                        re.test(result.label))) 
        if (this.props.staticItems) {
            return(_.filter(this.props.items,isMatch))
        }
        else {
            return(_.filter(this.state.items, isMatch))
        }
    }
    
    handleItemSelect (item,e) {
        this.setState({selected:item.text})
        if (this.props.callback !== undefined){
            this.props.callback(this.props.itemName,item.text)
        }
        
    }

    prevProp(event) {
        if (this.props.stopPropagation) {
            event.stopPropagation()
        }
    }

    render() {
        const {items,
                description,
                itemName,
                createNewItem,
                filterable, 
                callback, 
                staticItems, 
                adjustText, 
                stopPropagation, 
                rightIcon, 
                defaultItem,
                initialContent,
                minCharForFilter, ...rest} = this.props
        return(
            <Select 
                resetOnSelect = {false}
                items = {staticItems ? items : this.state.items}
                resetOnClose = {true}
                popoverProps={{minimal:true}}
                itemRenderer = {this.renderItem}
                onItemSelect = {this.handleItemSelect}
                itemListPredicate = {this.filterItems}
                filterable = {filterable}
                initialContent = {initialContent}
                noResults={<MenuItem disabled={true} text="No results." />}
                createNewItemFromQuery={createNewItem ? this.createNewItemFromQuery : undefined}
                createNewItemRenderer={createNewItem ? this.renderCreateNewItem : null}
                >
                <Button text={adjustText ? this.state.selected === undefined ? description : this.state.selected : description} 
                    onMouseDown = {this.prevProp} 
                    rightIcon = {<Icon icon={rightIcon} iconSize={12}/>} 
                    {...rest}/>
            </Select>
            )
    }
    static defaultProps = {
        staticItems : false,
        items : [{text:"text2",label:"label"},{text:"text1",label:"label2"}],
        description : "Choose Experiment Type",
        itemName : "expType",
        defaultItem : undefined,
        createNewItem : true,
        filterable : true,
        fill : true,
        rightIcon : "chevron-down",
        minimal : false,
        adjustText : true,
        stopPropagation : true,
        initialContent : undefined,
        minCharForFilter : 0
    }
}
export default Combobox