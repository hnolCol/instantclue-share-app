import React from "react";
import { useState } from "react";
import { SketchPicker, BlockPicker } from 'react-color'
import { Dialog, Button } from "@blueprintjs/core";



export function ColorChooserDialog(props) {
    const [color, setColor] = useState("#aabbcc");  
    const callback = (color) => {
        console.log(color)
    }
    
    return(

          <Dialog isOpen={props.isOpen} title={"Choose Color"} isCloseButtonShown={true}>
              <div style={{textAlign:"center"}}>
              <div style={{margin:"20px"}}>
               <BlockPicker color={color} onChange={setColor}/>
              </div>
              <div style={{textAlign:"right"}}>
                    
                    <Button text="Confirm" intent="primary"/>
                    <Button text="Cancel"/>
              </div>
              </div>
          </Dialog>
            )
}

