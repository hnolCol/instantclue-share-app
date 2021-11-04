import React from "react";
import { Callout, H3,} from "@blueprintjs/core";
import { InstantClueIcon } from "./utils/SVGs";

export function WelcomeScreen(props) {
        return (
            <div className="welcome-screen">
                <div className={"logo-container"}>
                    <div  style={{width:"100px"}}>
                        <InstantClueIcon />
                    </div>
                </div>
                <div>

                </div>
                
                <H3 >Welcome to the InstantClue web app</H3>
                <p> If you have never heard about InstantClue; it is a software that helps you to create beautiful and highly customizable charts from high dimensional data.
                    It was created with omics sciences in mind, but can in general be used for any kind of data. Please visit the <a href = {"http://www.instantclue.uni-koeln.de"}>Instant Clue Webpage</a> for more information, or go directly to the <a href={"https://github.com/hnolCol/instantclue/releases"}>GitHub Release Page</a> to download the executables for Mac and Windows.</p>
                <p>The web application allows you to share graphs from the InstantClue standalone software, which communicates with an InstantClue Application Programming Interface (API). Below we summarize our idea about the web application.</p>
                <div style={{paddingTop:"25px",paddingBottom:"25px",textAlign:"center"}}>
                <img src="/app-overview.png" alt="app_overview_instant_clue" width={"40%"}/>
                </div>
                <Callout title = {"Share graphs within your lab/community"}>
                The first usage example/idea is to share between your lab members or within your community. Once you created a chart in the 
                standalone software InstantClue, you can upload the chart to the web application. You can define how long should be available 
                and if you want to, you can secure your data with a password. 
                </Callout>
                <p></p>

                <Callout title = {"Bring your static pdf paper graph to life!"}>
                We defined  the main purpose of the web app in creating short-links (urls) that should be added to a figure caption in papers. Hence, the reader can simply click on the link and explore the data.
                Using InstantClue and the associated web application everyone can bring the static pdf charts to life. 
                </Callout>               
                
            </div>
        )          
    }


