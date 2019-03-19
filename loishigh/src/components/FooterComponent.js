import React from 'react';

export const Footer = (props) => {

    return(
        <div className="footer">
            <div className="container">
                <div className="row justify-content-center row-content">
                <div className="row">
                    <div className="col-4">
                        <a className="btn btn-social-icon btn-facebook add-margins-footer-buttons" href="http://www.facebook.com/lowishigh"><i className="fa fa-facebook"></i></a>
                    </div>
                    <div className="col-4">
                        <a className="btn btn-social-icon btn-instagram add-margins-footer-buttons" href="http://www.instagram.com/lowishigh"><i className="fa fa-instagram"></i></a>
                    </div>
                    <div className="col-4">
                        <a className="btn btn-social-icon btn-google add-margins-footer-buttons" href="mailto:loisxin41@gmail.com"><i className="fa fa-envelope-square"></i></a>
                    </div>
                </div>
                </div>
                <div className="justify-content-center row footer-message">
                    <p className="margin-50-bottom">Copyright © 2018 Lowishigh. Built by Cooper French.</p>
                </div>
            </div>
        </div>
    );
};