


import React from "react";
import { Popover2 } from "@blueprintjs/popover2";
import { Button } from "@blueprintjs/core";

export function TooltipButton(props) {
    const {content, popoverProps, buttonProps} = props
    return(

            <div>
                <Popover2 
                    content={
                        content}
                        {...popoverProps}
                    >

                    <Button {...buttonProps}/>
            </Popover2>
            </div>
            )
}
