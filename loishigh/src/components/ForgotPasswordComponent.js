import React from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, FormGroup, FormText, Button, Form, Input, FormFeedback } from 'reactstrap';

export default class ForgotPassword extends React.Component {

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            email: '',
            valid_email: undefined,
            checkYourEmail: false
        }
    }

    onFormSubmit (event) {
        if (this.state.valid_email === true) {
            this.props.changePasswordFromOutsideAccount({ email: this.state.email });
            event.preventDefault();
            this.setState({ checkYourEmail: true });
        }
        event.preventDefault();
    }

    componentDidMount () {
        window.scrollTo(0, 0);
        if (this.props.homeHeaderInView === true) {
            this.props.toggleNavbarTitle(false);
            this.props.changeFirstLoadMarker(false);
        };
    }
    
    render () {
        if (this.state.checkYourEmail === false) {
            return(
                <React.Fragment>
                <div className="container">
                <div className="row justify-content-center addTopMarginForSmallScreens">
                <div className="emboss col-10 loginFloatingThing col-md-6 animated fadeIn">
                    <Form onSubmit={this.onFormSubmit}>
                    <legend>Forgot Password</legend>
                    <FormText>Please enter the primary email address associated with your account. We will send you instructions on resetting your password.</FormText>
                    <br />
                        <FormGroup>
                            <InputGroup>
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-envelope"/>
                                </InputGroupAddon>
                                <Input type="email" id="email" placeholder="Email" onChange={(event) => {
                                        this.setState({ email: event.target.value });
                                        if (event.target.value.length < 100 && event.target.value.match(/@/)) {
                                            this.setState({ valid_email: true })
                                        }
                                        else {
                                            this.setState({ valid_email: false })
                                        }
                                        }}
                                        valid={this.state.valid_email === true} 
                                        invalid={this.state.valid_email === false}
                                        />
                                <FormFeedback valid />
                            </InputGroup>
                        </FormGroup>
                        <Button className="col-auto" type="submit">Submit</Button>
                    </Form>
                </div>
                </div> 
                </div>
                <div style={{height: "25vh"}}></div>
            </React.Fragment>

            );
        }
        else {
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
    
    }
};