import React from 'react';
import { InputGroup, InputGroupText, InputGroupAddon, FormGroup, Button, Form, FormText, Input, FormFeedback } from 'reactstrap';

export default class NewPassword extends React.Component {

    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.state = {
            new_password: '',
            confirm_new_password: '',
            token1: '',
            token2: '',
            valid_new_password: undefined,
            valid_confirm_new_password: undefined,
            valid_token1: undefined,
            valid_token2: undefined
        }
    }

    onFormSubmit (event) {
        if (this.state.valid_new_password === true && this.state.valid_confirm_new_password === true && this.state.valid_token1 === true && this.state.valid_token2 === true) {
            this.props.requestResetPassword({ new_password: this.state.new_password, token1: this.state.token1, token2: this.state.token2 });
            event.preventDefault();
            this.props.history.push('/result/newpassword');
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
            <legend>Change Password</legend>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-lock"/>
                        </InputGroupAddon>
                        <Input type="password" id="new_password" placeholder="New Password" onChange={(event) => {
                                this.setState({ new_password: event.target.value });
                                if (event.target.value.length > 19 && event.target.value.length < 61 && !event.target.value.match(/[@%{}&$]/)) { 
                                    this.setState({ valid_new_password: true })
                                }
                                else {
                                    this.setState({ valid_new_password: false })
                                }
                                }}
                                valid={this.state.valid_new_password === true} 
                                invalid={this.state.valid_new_password === false}
                                />
                        <FormFeedback valid />
                        <FormText className="passwordWarning">Should be made up of letters and numbers. 20 - 60 characters. You should also be using a password manager, try <a href="https://www.enpass.io/">Enpass.</a></FormText>
                    </InputGroup>
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-lock"/>
                        </InputGroupAddon>
                        <Input type="password" id="confirm_new_password" placeholder="Confirm New Password" onChange={(event) => {
                                this.setState({ confirm_new_password: event.target.value });
                                if (event.target.value === this.state.password && event.target.value !== '') {
                                    this.setState({ valid_confirm_new_password: true })
                                } 
                                else {
                                    this.setState({ valid_confirm_new_password: false })
                                }
                                }}
                                valid={this.state.valid_confirm_new_password === true} 
                                invalid={this.state.valid_confirm_new_password === false}
                                />
                    </InputGroup>
                    <FormFeedback valid />
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-hashtag"/>
                        </InputGroupAddon>
                        <Input type="text" id="token1" placeholder="Token 1" onChange={(event) => {
                                this.setState({ token1: event.target.value });
                                if (event.target.value.length > 40 && !event.target.value.match(/[@%{}&$]/)) {
                                    this.setState({ valid_token1: true })
                                } 
                                else {
                                    this.setState({ valid_token1: false })
                                }
                                }}
                                valid={this.state.valid_token1 === true} 
                                invalid={this.state.valid_token1 === false}
                                />
                    </InputGroup>
                    <FormFeedback valid />
                </FormGroup>
                <FormGroup>
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText style={{ fontSize: "18pt", width: "50px"}} className="fa fa-hashtag"/>
                        </InputGroupAddon>
                        <Input type="text" id="token2" placeholder="Token 2" onChange={(event) => {
                                this.setState({ token2: event.target.value });
                                if (event.target.value.length > 40 && !event.target.value.match(/[@%{}&$]/)) {
                                    this.setState({ valid_token2: true })
                                } 
                                else {
                                    this.setState({ valid_token2: false })
                                }
                                }}
                                valid={this.state.valid_token2 === true} 
                                invalid={this.state.valid_token2 === false}
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