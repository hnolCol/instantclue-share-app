import React from "react";
import { Omnibar } from "@blueprintjs/select";
import { MenuItem, Button, MenuDivider, Text, Code } from "@blueprintjs/core";
import { OmnibarItem } from "./OmnibarItem";
import axios from "axios";
import { useHistory } from "react-router";

import _ from "lodash"


const initialState = { isOpen: false, items: []};

class GeneralSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.filterItems = this.filterItems.bind(this);
    this._asyncDataFetch = this._asyncDataFetch.bind(this);

  }
  componentDidMount () {

    this._asyncDataFetch()
    } 

  _asyncDataFetch() {
        this.setState({isLoading:true})
        axios.get("/api/v1/data", {params :{ graphID : this.props.graphID}} 
            )
            .then(response => {
                //console.log(response.data)
                this.setItems(JSON.parse(response.data))})
    }

  setItems(items){
    this.setState({items:items})
  }

  renderItem(item, { handleClick, modifiers, query }) {
    if (!modifiers.matchesPredicate) {
      return null;
    }
    
    return (
        <OmnibarItem key = {item.graphID} item={item} onLinkChange = {this.props.onLinkChange} onSelect = {this.handleClose}/>
    );
  }

  filterItems(searchString) {
    
    if (searchString.length < 1) {return []}
                
    const re = new RegExp(_.escapeRegExp(searchString), 'i')
    const isMatch = result => re.test(result.title)  | re.test(result.subtitle) | re.test(result.info) | re.test(result.appID) | re.test(result.graphID) | re.test(result.DIO)
    
    return(_.filter(this.state.items, isMatch))
}

  handleClick() {
    this._asyncDataFetch()
    this.setState({ isOpen: true });
  }
  handleClose() {
    this.setState({ isOpen: false });
  }

  render() {
    return (
      <div>
        <span>
            <Button text={this.props.buttonTex} icon="search" minimal={true} intent={"primary"} onClick={this.handleClick}/>
        </span>
        <Omnibar
          isOpen={this.state.isOpen}
          noResults={<MenuItem disabled={true} text="No results." />}
          onClose={this.handleClose}
          resetOnSelect={true}
          itemRenderer={this.renderItem}
          items={this.state.items}
          itemListPredicate={this.filterItems}
          inputProps={{ placeholder: "Search.. (example: Yme1l1, DOI, AppID)" }}
          
          style={{ position: "absolute", left: "50%"}}
        />
      </div>
    );
  }
  static defaultProps = {
    buttonTex : "Search for Graph",
  }
}
export default GeneralSearch;
