import React from "react";
import axios from "axios"
import { H5 } from "@blueprintjs/core";


const initialState = {entries : []}

class ProjectView extends React.Component {

    constructor(props) {
        super(props);
        this.state = initialState
        this.setData = this.setData.bind(this)
        this._asyncDataFetch = this._asyncDataFetch.bind(this)
        this.removeEntry = this.removeEntry.bind(this)
    }   

    componentDidMount () {

        this._asyncDataFetch()
    } 

    _asyncDataFetch() {
        this.setState({isLoading:true})
        axios.get("/api/v1/projects/entries"
            )
            .then(response => {
                this.setData(response.data)})
    }

    setData(data) {
        console.log(data)
        this.setState({"entries":data})
    }

    removeEntry(entryID) {
        console.log(entryID)
    }

    render() {
        
        return (
            <div className="project-view">
                
                <H5 >Project Titlte</H5>
                {/* {this.state.entries.map(entryProps => {
                    return(
                        <ProjectEntry {...entryProps} removeRequest = {this.removeEntry}/>
                    )
                })} */}
                
                
            </div>
        )
          
    }

    static defaultProps = {
        authenticated : false
        }
}



export default ProjectView 
