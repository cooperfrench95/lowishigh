import React from 'react';
import { Button } from 'reactstrap';
import { Loading } from './LoadingComponent';

export default class Result extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            desiredResult: this.props.match.params.id
        }
    }

    componentDidMount () {
        this.setState({
            desiredResult: this.props.match.params.id
        })
    }

    render () {

        const renderThisIfErrorOccurs = <React.Fragment>
                                            <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                                                <p>An error occurred. Please try again. If this error persists, please contact the site administrator.</p>
                                                <Button onClick={this.props.history.goBack} >Back</Button>
                                            </div>
                                            <div style={{height: "70vh"}}></div>
                                        </React.Fragment>;

        const loadingSpinner = <React.Fragment>
                                    <Loading />
                                    <div style={{height: "70vh"}}></div>
                                </React.Fragment>;

    switch (this.state.desiredResult) {
        case'changepassword':
            if (this.props.changePasswordRequest.loading) {
                return loadingSpinner
            }
            else if (this.props.changePasswordRequest.emails_sent) {
                return(
                    <React.Fragment>
                        <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                            <p>Your request to initiate a password change process was successful. Check your primary email and recovery email and follow the instructions. The request will time out in 5 minutes.</p>
                            <Button onClick={() => this.props.history.push('/newpassword')}>Continue</Button>
                        </div>
                        <div style={{height: "70vh"}}></div>
                    </React.Fragment>
                );
            }
            else {
                return renderThisIfErrorOccurs
            }
        case 'logout':
            if (this.props.auth.logoutLoading) {
                return loadingSpinner
            }
            else if (!this.props.auth.loggedIn) {
                return(
                    <React.Fragment>
                        <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                            <p>You successfully logged out.</p>
                            <Button onClick={() => this.props.history.push('/home')} >Home</Button>
                        </div>
                        <div style={{height: "70vh"}}></div>
                    </React.Fragment>
                );
            }
            else {
                return renderThisIfErrorOccurs
            }
        case 'deleteaccount':
            if (this.props.deleteAccount.loading) {
                return loadingSpinner
            }
            else if (this.props.deleteAccount.success) {
                return(
                    <React.Fragment>
                        <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                            <p>You successfully deleted your account.</p>
                            <Button onClick={() => this.props.history.push('/home')} >Home</Button>
                        </div>
                        <div style={{height: "70vh"}}></div>
                    </React.Fragment>
                );
            }
            else {
                return renderThisIfErrorOccurs
            }
        case 'createaccount':
            if (this.props.createAccount.loading) {
                return loadingSpinner
            }
            else if (this.props.createAccount.success) {
                return(
                    <React.Fragment>
                        <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                            <p>You successfully created your account.</p>
                            <Button onClick={() => this.props.history.push('/login')} >Login</Button>
                        </div>
                        <div style={{height: "70vh"}}></div>
                    </React.Fragment>
                );
            }
            else {
                return renderThisIfErrorOccurs
            }
        case 'newpassword':
            if (this.props.resetPassword.loading) {
                return loadingSpinner
            }
            else if (this.props.resetPassword.success) {
                return(
                    <React.Fragment>
                        <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                            <p>Your request to change your password was successful. You may now log in using your new password.</p>
                            <Button onClick={() => this.props.history.push('/newpassword')}>Continue</Button>
                        </div>
                        <div style={{height: "70vh"}}></div>
                    </React.Fragment>
                );
            }
            else {
                return renderThisIfErrorOccurs
            }
        case 'deleteproject':
        case 'deleteimage':
        case 'deleteblogpost':
            if (this.props.deleteSomethingState.loading) {
                return loadingSpinner
            }
            else if (this.props.deleteSomethingState.success) {
                return(
                    <React.Fragment>
                        <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                            <p>Your request to delete the {this.state.desiredResult.substring(6)} was successful. </p>
                            <Button onClick={() => this.props.history.push('/account')}>Back</Button>
                        </div>
                        <div style={{height: "70vh"}}></div>
                    </React.Fragment>
                );
            }
            else {
                return renderThisIfErrorOccurs
            }
        case 'uploadproject':
        case 'uploadimages':
        case 'uploadblogpost':
            if (this.props.uploadSomethingState.loading) {
                return loadingSpinner
            }
            else if (this.props.uploadSomethingState.success) {
                return(
                    <React.Fragment>
                        <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                            <p>Your request to upload the {this.state.desiredResult.substring(6)} was successful. </p>
                            <Button onClick={() => this.props.history.push('/account')}>Back</Button>
                        </div>
                        <div style={{height: "70vh"}}></div>
                    </React.Fragment>
                );
            }
            else {
                return renderThisIfErrorOccurs
            }
        default:
            return renderThisIfErrorOccurs
        }
    }
};