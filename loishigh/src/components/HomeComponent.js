import React, { Component } from 'react';
import InviewMonitor from 'react-inview-monitor';
import { baseURL } from '../shared/baseURL';
import { NavLink } from 'react-router-dom';
import { Modal } from 'reactstrap';


class Home extends Component {

    constructor (props) {
        super (props)

        this.changeNavbarTitle = this.changeNavbarTitle.bind(this);
        this.toggleNavModal = this.toggleNavModal.bind(this);
        this.state = {
            isOpen: false
        }
    }
    
    toggleNavModal () {
        this.setState({isOpen: !this.state.isOpen});
    }

    changeNavbarTitle (argument) {
        this.props.toggleNavbarTitle(argument);

    }

    componentDidMount () {
        window.scrollTo(0, 0);      
        if (this.props.firstLoadMarker === true) {
            this.props.changeFirstLoadMarker(false);
        }
    }
    
    render() {

        const externalModalCloseBtn = <button className="close" style={{ position: 'absolute', top: '40px', right: '40px', zIndex: 100000 }} onClick={() => this.toggleNavModal()}>
            <span className="fa fa-close" style={{fontSize: '20pt', color: "black"}}></span>
        </button>;  

        return (
            
            <React.Fragment>
                        
                                <div className="page-header container">
                                    <InviewMonitor 
                                    onInView={() => this.changeNavbarTitle(true)} 
                                    onNotInView={() => this.changeNavbarTitle(false)}
                                    repeatOnInView={true} intoViewMargin='0%'>
                                        <div style={{display: "none"}}></div>
                                     </InviewMonitor> {/*Need to make the div below here fade in/out on inview */}
                                        <div className="homepage-about animated fadeIn">
                                            <div className="col-12">
                                            <InviewMonitor classNameInView=" animated fadeIn" classNameNotInView=" vis-hidden"
                                            toggleClassNameOnInView={true} intoViewMargin='20%'>
                                                <h1 className="text-center gallery-heading">Lowishigh</h1>
                                            </InviewMonitor>
                                            </div>
                                            <div className="col-12">
                                            <InviewMonitor classNameInView=" animated fadeIn delay-1s" classNameNotInView=" vis-hidden"
                                            toggleClassNameOnInView={true} intoViewMargin='20%'>
                                                <p className="text-center col-12 secondary-title">Based in Taipei. Made with love and passion.</p>
                                            </InviewMonitor>
                                            </div>
                                        </div>
                                </div>

                <div className="container animated fadeIn delay-2s" >
                    <div className="row align-items-center justify-content-center addtopmargin" >
                        <div className="col-8 col-md-6 order-last homepageText">
                            <h2>About This Blog</h2>
                            <p>Welcome to my personal blog. As you can see, "I do bits and bits of everything", so this is going to be the style of the blog. I'd write about things I am doing, places that I've been to, people that I meet on my journey, and any issue that I care about.</p>
                            <p>I'm constantly on to some art projects. So you may as well skip the posts and go straight to the portfolio and gallery.</p>
                            <p>I'm open to any form of collaboration and I look forward to comments and advice!</p>
                        </div>
                        <div className="col-auto">
                            <img style={{borderRadius: "50%", maxWidth: "40vw", maxHeight: "40vh"}} className="img-fluid" src={baseURL + 'images/home-photo.jpg'} alt={'me in an art gallery'}/>
                        </div>
                    </div>
                    <div className="row row-content">
                        
                        <div onClick={this.toggleNavModal} className="col-12 col-md-6 emboss mouse-over-highlight" style={{cursor: "pointer", position: "relative", left: "50%", transform: "translate(-50%)"}}>
                            <h2 className="getStarted text-center">Get started <span className="fa fa-angle-double-right"/></h2>
                        </div>
                            <Modal className="animated fadeIn" fade={false} style={{marginTop: "20vh", alignContent: "center"}} backdrop="static" isOpen={this.state.isOpen} toggle={this.toggleNavModal} external={externalModalCloseBtn}>
                                <NavLink to="/blog">
                                    <h2  className="home-bottom-links">BLOG</h2>
                                </NavLink>
                                <NavLink to="/portfolio">
                                    <h2 className="home-bottom-links">PORTFOLIO</h2>
                                </NavLink>
                                <NavLink to="/gallery">
                                    <h2 className="home-bottom-links">GALLERY</h2>
                                </NavLink>
                                <NavLink to="/articles">
                                    <h2 className="home-bottom-links">ARTICLES</h2>
                                </NavLink>
                            </Modal>
                    </div>
                </div>
            </React.Fragment>

        );
    }

} 


export default Home;