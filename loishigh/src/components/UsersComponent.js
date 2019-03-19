import React from 'react';
import { Loading } from './LoadingComponent';
import { Button } from 'reactstrap';

export const Users = (props) => {

    if (props.usersState.loading === true) {
        return(
            <Loading />
        )
    }
    else if (props.usersState.users) {
        return(
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="row">
                            <h2 style={{marginTop: "40px" }}>Users</h2>
                        </div>  
                    </div>
                    <div className="col-12" style={{ border: "1px solid grey", height: "400px", overflow: "hidden", overflowY: "scroll"}}>
                        {props.usersState.users.map((user, index) => {
                            
                            var background = index % 2 === 0 ? "lightgray" : "white";

                            return(
                                <div className="row" style={{paddingTop: "16px", backgroundColor: background}} key={index}>
                                    <p className="col-6 col-md-10">{user}</p>
                                    <span style={{cursor: "pointer"}} onClick={() => props.changeView('confirm', (' delete the user "' + user + '"?'),
                                    () => props.deleteSomethingFromServer({username: user}, 'user'), true, 'users')} className="fa fa-close col-1" />
                                </div>
                            );  
                        })}
                    </div>
                </div>
            </div>
    
    )
    }
    else {
        return(
            <React.Fragment>
                <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                    <p>An error occurred. Please try again. If error persists, please contact the site administrator.</p>
                    <Button onClick={() => props.changeView('settings')} >Back</Button>
                </div>
                <div style={{height: "70vh"}}></div>
            </React.Fragment>
        );
    }

}