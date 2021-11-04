

import React from 'react';
import {useState} from 'react';
import { useHistory } from 'react-router';
import { MenuDivider, Text} from '@blueprintjs/core';

export function OmnibarItem(props) {
    const {graphID, setGraphID} = useState("")
    const item = props.item
    const text = `${item.title}`;
    const onSelect = props.onSelect
    // setGraphID(item["graphID"])
    const history = useHistory()

    const sendGraphID =function(e) {
    
        onSelect()
        history.push(`/s/${item["graphID"]}`)

    }

    return(
        <div key={item["graphID"]} onClick={sendGraphID}>
        <div className={"omnibar-search-item"} >

        <div style={{margin:"3px"}}>
        <div style={{float:"left",color:"#286FA4"}}>
        <p>{text}</p>
        </div>
        <div style={{float:"right",paddingRight:"3px",paddingTop:"4px",color:"#737373"}}>
            <p>{item["subtitle"]}</p>
        </div>
        </div>
        {/* //active={modifiers.active}
        disabled={modifiers.disabled}
        label={item[this.props.labelKw]}
        key={item["graphID"]}
        onClick={handleClick}
        text={text} 
        onMouseOver = {(e) => (e.stopPropagation())}
        /> */}
        <div style={{fontSize:"10px",marginTop:"3px",marginLeft:"10px",paddingBottom:"20px",clear: "both"}}>
            <Text ellipsize={true}>{item["info"]}</Text>
        </div>

        </div>

        <MenuDivider/>

    </div>)
}