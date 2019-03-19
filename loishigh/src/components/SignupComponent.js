import React from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, FormGroup, Button, Form, FormText, Input, FormFeedback } from 'reactstrap';

export default class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            username: '',
            password: '',
            confirm_password: '',
            email: '',
            recovery_email: '',
            valid_username: undefined,
            valid_password: undefined,
            valid_confirm_password: undefined,
            valid_email: undefined,
            valid_recovery_email: undefined
        }
    }

    onFormSubmit (event) {
        if (this.state.valid_password === true && this.state.valid_confirm_password === true &&
            this.state.valid_username === true && this.state.valid_email === true && this.state.valid_recovery_email === true) {
                this.props.createAccount({  username: this.state.username, 
                                            password: this.state.password, 
                                            email: this.state.email, 
                                            recovery_email: this.state.recovery_email });
                event.preventDefault();
                this.props.history.push('/result/createaccount');
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
        
    return(
        <React.Fragment>
        <div className="container">
        <div className="row justify-content-center addTopMarginForSmallScreens">
        <div className="emboss col-10 loginFloatingThing col-md-6 animated fadeIn">
            <Form onSubmit={this.onFormSubmit}>
            <legend>Register</legend>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-user"/>
                        </InputGroupAddon>
                        <Input type="username" id="username" placeholder="Username" onChange={(event) => {
                                this.setState({ username: event.target.value });
                                if (event.target.value.length > 7 && event.target.value.length < 26 && !event.target.value.match(/[@%{}&$]/)) { // Validation
                                    this.setState({ valid_username: true })
                                }
                                else {
                                    this.setState({ valid_username: false })
                                }
                                }}
                                valid={this.state.valid_username === true} 
                                invalid={this.state.valid_username === false}
                                />
                        <FormFeedback valid />
                        <FormText className="passwordWarning">The name people will refer to you as, and that you will use for logging in. 8 - 25 characters, no special characters (such as $, @, %).</FormText>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-lock"/>
                        </InputGroupAddon>
                        <Input type="password" id="password" placeholder="Password" onChange={(event) => {
                                this.setState({ password: event.target.value });
                                if (event.target.value.length > 19 && event.target.value.length < 61 && !event.target.value.match(/[@%{}&$]/)) {
                                    this.setState({ valid_password: true })
                                } 
                                else {
                                    this.setState({ valid_password: false })
                                }
                                }}
                                valid={this.state.valid_password === true} 
                                invalid={this.state.valid_password === false}
                                />
                    </InputGroup>
                    <FormText className="passwordWarning">Should consist of letters and numbers only. 20 - 60 characters. You should also be using a password manager, try <a href="https://www.enpass.io/">Enpass.</a></FormText>
                    <FormFeedback valid />
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-lock"/>
                        </InputGroupAddon>
                        <Input type="password" id="confirm_password" placeholder="Confirm Password" onChange={(event) => {
                                this.setState({ confirm_password: event.target.value });
                                if (event.target.value === this.state.password && event.target.value !== '') {
                                    this.setState({ valid_confirm_password: true })
                                } 
                                else {
                                    this.setState({ valid_confirm_password: false })
                                }
                                }}
                                valid={this.state.valid_confirm_password === true} 
                                invalid={this.state.valid_confirm_password === false}
                                />
                    </InputGroup>
                    <FormFeedback valid />
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-envelope"/>
                        </InputGroupAddon>
                        <Input type="email" id="email" placeholder="Primary Email" onChange={(event) => {
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
                    </InputGroup>
                    <FormFeedback valid />
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-envelope-o"/>
                        </InputGroupAddon>
                        <Input type="email" id="recovery_email" placeholder="Secondary Email" onChange={(event) => {
                                this.setState({ recovery_email: event.target.value });
                                if (event.target.value.length < 100 && event.target.value.match(/@/)) {
                                    this.setState({ valid_recovery_email: true })
                                } 
                                else {
                                    this.setState({ valid_recovery_email: false })
                                }
                                }}
                                valid={this.state.valid_recovery_email === true} 
                                invalid={this.state.valid_recovery_email === false}
                                />
                    </InputGroup>
                    <FormFeedback valid />
                </FormGroup>
                <Button type="submit">Submit</Button>
            </Form>
        </div>
        </div> 
        </div>
        <div style={{height: "25vh"}}></div>
       </React.Fragment>
    );
    }
};