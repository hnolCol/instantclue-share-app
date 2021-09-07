import React from "react";
import { H2, H3,H5 } from "@blueprintjs/core";
import { CollapsableText } from "../utils/CollapsableText";
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

export function TextInformation(props) {
    const {title,subtitle,main,isMarkdown, ...rest} = props
    var content = <div></div>
    if (isMarkdown) {
        content = <ReactMarkdown plugins = {[gfm]} children={main}/>
    }
    else {
        content = <div><H2>{title}</H2><H3>{subtitle}</H3><H5>{main}</H5></div>
    }

    return(

            <div>
                <CollapsableText title = {"Information"} content = {content} {...rest}/>
            </div>
            )
}
