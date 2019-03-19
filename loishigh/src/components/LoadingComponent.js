import React from 'react';
import { BounceLoader } from 'halogenium';


export const Loading = () => {
    return(
        <div className="container-fluid">
            <div className="row justify-content-md-center align-items-center">
                <div className="col-md-auto">
                    <div className="spinner">
                        <BounceLoader color="#7E7E7E" margin="4px" size="100px"/>
                    </div> 
                </div>
            </div>
        </div>
       
    );
};