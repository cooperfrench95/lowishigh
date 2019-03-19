import React, { Component } from 'react';
import { Navbar, Nav, NavbarToggler, NavItem, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';


class Header extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        }
 
        this.togglenavbar = this.togglenavbar.bind(this);
    }

    togglenavbar () {
        this.setState({isOpen: !this.state.isOpen});
    }

    render () {
        var classChangeOnScroll = ""
        if (this.props.firstLoadMarker === true) {
            classChangeOnScroll = " vis-hidden"
        }
        else if (this.props.homeHeaderInView === true && this.props.firstLoadMarker === false) {
            classChangeOnScroll = " vis-hidden";
        }
        else if (this.props.homeHeaderInView === false && this.props.firstLoadMarker === false) {
            classChangeOnScroll = " animated fadeIn";
        }
        if (this.props.auth.loggedIn) {
            var account_zone =  <NavItem>
                                    <NavLink className="nav-link navbar-btn" to="/account" onClick={this.togglenavbar}>
                                        ACCOUNT
                                    </NavLink>
                                </NavItem>
        }
        else {
            account_zone =  <NavItem>
                                <NavLink className="nav-link navbar-btn" to="/login" onClick={this.togglenavbar}>
                                    LOGIN/REGISTER
                                </NavLink>
                            </NavItem>
        }
        return(
            <React.Fragment>
                <Navbar light expand="md" className="fixed-top navbar-div ">
                    <div className="container-fluid">
                        <NavbarToggler onClick={this.togglenavbar} />
                        <Collapse isOpen={this.state.isOpen} style={{minHeight: "50px",
                                                                     WebkitBackfaceVisibility: "hidden",
                                                                     backfaceVisibility: "hidden"
                                                                     }} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link navbar-btn" to="/home" onClick={this.togglenavbar}>
                                        HOME
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link navbar-btn" to="/about" onClick={this.togglenavbar}>
                                        ABOUT ME
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link navbar-btn" to="/blog" onClick={this.togglenavbar}>
                                        BLOG
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link navbar-btn" to="/portfolio" onClick={this.togglenavbar}>
                                        PORTFOLIO
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link navbar-btn" to="/gallery" onClick={this.togglenavbar}>
                                        GALLERY
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link navbar-btn" to="/articles" onClick={this.togglenavbar}>
                                        ARTICLES
                                    </NavLink>
                                </NavItem>
                                {account_zone}
                            </Nav>
                        </Collapse>
                    </div>
                    <Nav>
                        <h1 className={"title-navbar-top" + classChangeOnScroll}>Lowishigh</h1>
                    </Nav> 
                </Navbar>      
            </React.Fragment>
        );
    }


}

export default Header;