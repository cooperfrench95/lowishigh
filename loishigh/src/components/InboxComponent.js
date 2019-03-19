import React from 'react';
import Collapsible from 'react-collapsible';

export default class Inbox extends React.Component {

    constructor(props) {
        super(props);

        this.handleReadMessage = this.handleReadMessage.bind(this);
    }

    handleReadMessage (message) {
        this.props.setMessageReadToTrue(message, this.props.auth.token, this.props.auth.inbox);
    }

    render () { 
    
        if (this.props.auth.inbox.length === 0) {
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <h2 style={{marginTop: "40px" }}>Inbox</h2>
                            </div>  
                        </div>
                        <div className="col-12" style={{ border: "1px solid grey", height: "400px", overflow: "hidden", overflowY: "scroll"}}>
                            <div className="row" style={{paddingTop: "16px", backgroundColor: "floralwhite"}}>
                                <p className="col-6 col-md-10">There are no messages in your inbox.</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="row">
                                <h2 style={{marginTop: "40px" }}>Inbox</h2>
                            </div>  
                        </div>
                        <div className="col-12" style={{ border: "1px solid grey", height: "400px", overflow: "hidden", overflowY: "scroll"}}>
                            {this.props.auth.inbox.map((message, index) => {
                                
                                var background = index % 2 === 0 ? "#D3D7CF" : "white";

                                return(
                                    <div style={{backgroundColor: background}} className="row" key={index}>
                                        <Collapsible 
                                            onOpen={(message) => this.handleReadMessage(message)}
                                            transitionTime={200}
                                            triggerStyle={{fontWeight: message.read === false ? "bold" : "normal"}}
                                            trigger={'New Comment - ' + message.date.slice(0, message.date.indexOf('T'))} 
                                            >
                                            <p><strong>Author: </strong>{message.author}</p>
                                            <p><strong>Post: </strong>{message.post}</p>
                                            <p><strong>Message: </strong></p>
                                            <p>{message.content}</p>
                                        </Collapsible>
                                        
                                        
                                    </div>
                                );  
                            })}
                        </div>
                    </div>
                </div>
            );    
        }
    }
}