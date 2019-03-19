import React from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, FormGroup, Button, Form, FormText, Input, FormFeedback } from 'reactstrap';
export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            username: '',
            password: '',
            valid_username: undefined,
            valid_password: undefined
        }
    }

    onFormSubmit (event) {
        if (this.state.valid_password === true && this.state.valid_username === true) {
            this.props.login({ username: this.state.username, password: this.state.password});
            event.preventDefault();
            this.props.history.push('/account');
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
            <legend>Login</legend>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-user"/>
                        </InputGroupAddon>
                        <Input type="username" id="username" placeholder="Username" onChange={(event) => {
                                this.setState({ username: event.target.value });
                                if (event.target.value.length > 7 && event.target.value.length < 26 && !event.target.value.match(/[@%{}&$]/)) {
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
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-lock"/>
                        </InputGroupAddon>
                        <Input type="password" id="password" placeholder="Password" onChange={(event) => {
                                this.setState({ password: event.target.value });
                                if (event.target.value.length > 19 && !event.target.value.match(/[@%{}&$]/)) {
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
                    <FormText className="passwordWarning">We only store a secure hash of your password. Make sure you see https:// at the start of the URL before submitting. You should also be using a password manager, try <a href="https://www.enpass.io/">Enpass.</a></FormText>
                    <FormFeedback valid />
                </FormGroup>
                <div className="row" style={{marginLeft: "6px"}}>
                    <Button className="col-auto" type="submit">Login</Button>
                    <Button className="col-auto" style={{ marginLeft: "5px" }} onClick={() => this.props.history.push('/register')}>Register</Button>
                    <span className="col-auto forgotPassword" onClick={() => this.props.history.push('/forgotpassword')}>Forgot Password</span>
                </div>
            </Form>
        </div>
        </div> 
        </div>
        <div style={{height: "25vh"}}></div>
       </React.Fragment>
    );
    }
};