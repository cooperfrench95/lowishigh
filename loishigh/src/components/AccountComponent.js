import React from 'react';
import { Button } from 'reactstrap';
import { Loading } from './LoadingComponent';
import PostsTabs from './PostsTabsComponent';
import PostEditor from './PostEditorComponent';
import DragAndDrop from './DropzoneComponent';
import { Users } from './UsersComponent';
import Inbox from './InboxComponent';

export default class Account extends React.Component {

    constructor(props) {
        super(props);

        this.deleteSomethingFromServer = this.deleteSomethingFromServer.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.logOut = this.logOut.bind(this);
        this.changeView = this.changeView.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.state = {
            currentView: <div className="row">
                            <div style={{ marginBottom: "30px", paddingBottom:"30px", borderBottom: "2px solid black" }} className="col-12">
                                <h2 style={{textAlign: "center"}}>{this.props.auth.username}</h2>
                            </div>
                            <div className="col-12">
                                <Button onClick={() => this.changeView('confirm', 'request a password change?', this.changePassword)} block className="settingsButtonsNormal" >Change Password</Button>
                            </div>
                            <div className="col-12">
                                <Button onClick={() => this.changeView('confirm', 'log out?', this.logOut)} block className="settingsButtonsNormal">Logout</Button>
                            </div>
                            <div style={{marginTop: "30px", paddingTop: "30px", borderTop: "2px solid black" }} className="col-12">
                                <Button onClick={() => this.changeView('confirm', 'delete your account? This will permanently delete all your account data. This action cannot be undone.', this.deleteAccount, true)} block className="settingsButtonsDanger" color="danger">Delete Account</Button> 
                            </div>
                        </div>,
            windowWidth: undefined
        };
    }

    changePassword (event) {
        this.props.changePasswordFromWithinAccount(this.props.auth.token);
        event.preventDefault();
        this.props.history.push('/result/changepassword');
    }

    logOut (event) {
        this.props.logout(this.props.auth.token);
        event.preventDefault();
        this.props.history.push('/result/logout');
    }

    deleteAccount (event) {
        this.props.deleteAccount({ username: this.props.auth.username });
        event.preventDefault();
        this.props.history.push('/result/deleteaccount');
    }

    deleteSomethingFromServer (value, type) {
        if (type === 'image') {
            this.props.deleteSomething(value, type, this.props.auth.token, this.props.blogposts.blogposts, this.props.galleryState.gallery, this.props.categoryState.categories);
        }
        else {
            this.props.deleteSomething(value, type, this.props.auth.token);
        }
        this.props.history.push('/result/delete' + type);
    }

    changeView (desiredView, context = undefined, yesOnClick = undefined, yesDanger = false, from = undefined, deleteContext = undefined) {
        switch (desiredView) {
            case 'settings':
                let view =  <div className="row">
                            <div style={{ marginBottom: "30px", paddingBottom:"30px", borderBottom: "2px solid black" }} className="col-12">
                                <h2 style={{textAlign: "center"}}>{this.props.auth.username}</h2>
                            </div>
                            <div className="col-12">
                                <Button onClick={() => this.changeView('confirm', 'request a password change?', this.changePassword)} block className="settingsButtonsNormal" >Change Password</Button>
                            </div>
                            <div className="col-12">
                                <Button onClick={() => this.changeView('confirm', 'log out?', this.logOut)} block className="settingsButtonsNormal">Logout</Button>
                            </div>
                            <div style={{marginTop: "30px", paddingTop: "30px", borderTop: "2px solid black" }} className="col-12">
                                <Button onClick={() => this.changeView('confirm', 'delete your account? This will permanently delete all your account data. This action cannot be undone.', this.deleteAccount, true)} block className="settingsButtonsDanger" color="danger">Delete Account</Button> 
                            </div>
                        </div>;
                this.setState({
                    currentView: view 
                });
                break
            case 'posts':
                view =  <PostsTabs {...this.props} changeView={this.changeView} deleteSomethingFromServer={this.deleteSomethingFromServer} />
                this.setState({
                    currentView: view 
                });
                break
            case 'users':
                view = <Users {...this.props} changeView={this.changeView} />;
                this.setState({
                    currentView: view 
                });
                break
            case 'inbox':
                view = <Inbox {...this.props} />;
                this.setState({
                    currentView: view 
                });
                break
            case 'confirm':
                view =  <div className="row justify-content-center animated fadeIn">
                            <div style={{ marginBottom: "30px", paddingBottom:"30px", borderBottom: "2px solid black" }} className="col-12">
                                <legend style={{textAlign: "center"}}>Confirm</legend>
                            </div>
                            <div className="col-12">
                                <p style={{marginBottom: "50px"}} className="text-center">{"Are you sure you want " + context}</p>
                            </div>
                            <div className="col-6 col-md-3">
                                <Button block onClick={yesOnClick} className={yesDanger === false ? "settingsButtonsNormal" : "settingsButtonsDanger"}>Yes</Button>
                            </div>
                            <div className="col-6 col-md-3">
                                <Button block onClick={() => this.changeView(from === undefined ? 'settings' : from)} className="settingsButtonsNormal">No</Button>
                            </div>
                        </div>;
                this.setState({
                    currentView: view
                });
                break
            case 'posteditor':
                view =  yesOnClick === undefined ? <PostEditor {...this.props} thingToEdit={context} changeView={this.changeView} />
                                                 : <PostEditor {...this.props} thingToEdit={context} changeView={this.changeView} object={yesOnClick} />;
                this.setState({
                    currentView: view 
                });
                break
            case 'posteditor preview':
                view = <DragAndDrop draft={context} {...this.props} changeView={this.changeView} />
                this.setState({
                    currentView: view 
                });
                break
            default:
                throw new Error('No case for that value')
        }
    }

    componentDidMount () {
        window.scrollTo(0, 0);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        if (this.props.homeHeaderInView === true) {
            this.props.toggleNavbarTitle(false);
            this.props.changeFirstLoadMarker(false);
        };
        if (this.props.auth.admin === true) {
            this.props.fetchUsers(this.props.auth.token);
        }
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth });
    }
    
    render () {

        var settingsLink = this.state.windowWidth > 576 ? <p><span className="fa fa-cog"/> Settings</p> : <span className="fa fa-cog"/>;
        var postsLink = this.state.windowWidth > 576 ? <p><span className="fa fa-pencil"/> Posts</p> : <span className="fa fa-pencil"/>;
        var usersLink = this.state.windowWidth > 576 ? <p><span className="fa fa-users"/> Users</p> : <span className="fa fa-users"/>;
        var inboxLink = this.state.windowWidth > 576 ? <p><span className="fa fa-envelope"/> Inbox</p> : <span className="fa fa-envelope"/>;

        if (this.props.auth.loginLoading === true || this.props.auth.logoutLoading === true) {
            return(
                <React.Fragment>
                    <Loading />
                    <div style={{height: "70vh"}}></div>
                </React.Fragment>
            );
        }
        else if (this.props.auth.loggedIn && this.props.auth.admin) {
            return(
                <React.Fragment>
                    <div className="container">
                        <div className="row" style={{marginTop: "100px"}}>
                            <div className="col-12 col-md-3 order-first">
                                <div className="emboss">
                                    <div className="row">
                                        <div className="col-3 col-md-12 account-links-side mouse-over-highlight" onClick={() => this.changeView('settings')}>{settingsLink}</div>
                                        <div className="col-3 col-md-12 account-links-side mouse-over-highlight" onClick={() => this.changeView('posts')}>{postsLink}</div>
                                        <div className="col-3 col-md-12 account-links-side mouse-over-highlight" onClick={() => this.changeView('users')}>{usersLink}</div>
                                        <div className="col-3 col-md-12 account-links-side mouse-over-highlight" onClick={() => this.changeView('inbox')}>{inboxLink}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-9">
                                <div className="emboss">
                                    {this.state.currentView}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: "30vh"}}></div>
                </React.Fragment>
            );
        }
        else if (this.props.auth.loggedIn && !this.props.auth.admin) {
            return(
                <React.Fragment>
                    <div className="container">
                        <div className="row" style={{marginTop: "100px"}}>
                            <div className="col-3">
                                <div className="emboss">
                                    <div className="account-links-side mouse-over-highlight" onClick={() => this.changeView('settings')}>{settingsLink}</div>
                                    <div className="account-links-side mouse-over-highlight" onClick={() => this.changeView('inbox')}>{inboxLink}</div>
                                </div>
                            </div>
                            <div className="col-9">
                                <div className="emboss">
                                    {this.state.currentView}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{height: "30vh"}}></div>
                </React.Fragment>
            );
        }
        else if (!this.props.auth.loggedIn) {
            window.scrollTo(0, 0);
            return(
                <React.Fragment>
                    <div style={{position: "fixed", top: "43vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                        <p>You are not logged in. Your session may have expired, or, if you just tried to log in, you may have entered an incorrect email or password.</p>
                        <Button block className="settingsButtonsNormal" onClick={() => this.props.history.push('/login')} >Login</Button>
                        <Button block className="settingsButtonsNormal" onClick={() => this.props.history.push('/home')} >Home</Button>
                    </div>
                    <div style={{height: "70vh"}}></div>
                </React.Fragment>
            );
        }
        else if (this.props.auth.errorMessage) {
            return(
                <React.Fragment>
                    <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                        <p>An error occurred. Please try again. If this error persists, please contact the site administrator.</p>
                        <Button onClick={this.props.history.goBack} >Back</Button>
                    </div>
                    <div style={{height: "70vh"}}></div>
                </React.Fragment>
            );
        }
    }
};

