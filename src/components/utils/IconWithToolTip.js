import React from "react";
import {Button, Tooltip, Text, Icon} from "@blueprintjs/core"

class IconWithToolTip extends React.Component {
    constructor(props) {
        super(props);
        this.callback = this.callback.bind(this)
        this.prevProp = this.prevProp.bind(this)
      }    
    callback (event) {

        if (this.props.callback !== undefined) {
            this.props.callback(this.props.callBackParams)
        }
    }

    prevProp(event) {
        if (this.props.stopPropagation) {
            event.stopPropagation()
        }
    }

    render() {

        const {text,callback,icon,tooltipDelay, callBackParams, stopPropagation, ...rest } = this.props       
        
        return(
            <Tooltip hoverOpenDelay={tooltipDelay} 
                content={
                    <div className = {"tooltip"}>
                        <Text>
                            {this.props.text}
                        </Text>
                    </div>
                }>
                            <Button {...rest }  
                                onClick={this.callback} 
                                onMouseDown = {this.prevProp} 
                                icon={<Icon icon={icon} iconSize={12}/>}/>
            </Tooltip>
            
                
     
                
            )
    }
    static defaultProps = {
        fill:true,
        icon:'',
        text:"This is a tooltip",
        tooltipDelay:500,
        minimal:true,
        alignText:"left",
        small:false,
        intent:"none",
        callBackParams:{},
        callback:undefined,
        stopPropagation:true
    }
}
export default IconWithToolTip