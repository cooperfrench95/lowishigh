import React, { Component } from 'react';
import { baseURL } from '../shared/baseURL';
import { NavLink } from 'react-router-dom';
import { Modal } from 'reactstrap';


class AboutMe extends Component {

    constructor (props) {
        super (props)

        this.toggleNavModal = this.toggleNavModal.bind(this);
        this.state = {
            isOpen: false
        }
    }
    
    toggleNavModal () {
        this.setState({isOpen: !this.state.isOpen});
    }

    componentDidMount () {
        window.scrollTo(0, 0);
        this.props.toggleNavbarTitle(false);       
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
                <div className="container animated fadeIn" >
                    <div className="row row-content align-items-center justify-content-center addtopmargin" >
                        <div className="col-12">
                            <h1 className="gallery-heading text-center addtopmargin">About Me</h1>
                        </div>
                        <div className="col-8 col-md-6 order-last homepageText">
                            <h2>My background</h2>
                            <p>Born and raised in Taipei. Constantly traveling since I was five. I chose literature as my major because I still had hope in humanity. I studied translation in Barcelona because I believe communication between different cultures and colors is important. For now I'm ready to start my adventure as a film school student in Germany.</p>
                            <h2>My Skills</h2>
                            <p>I speak several languages including fluent Mandarin and English, intermediate level of Spanish and Taiwanese, and a beginner level of German. I write scripts and recipes. And I have good fashion sense shifting between Normcore and Retro. Furthermore, I take good photos.<br />Most importantly, I make awesome food!</p>
                        </div>
                        <div className="col-auto">
                            <img style={{maxWidth: "60vw", maxHeight: "50vh", marginTop: "50px"}} className="img-fluid" src={baseURL + 'images/graffiti-photo.jpg'} alt='me standing in front of a wall covered in graffiti'/>
                        </div>
                    </div>
                    <div className="row row-content">
                        
                        <div onClick={this.toggleNavModal} className="col-12 col-md-6 emboss mouse-over-highlight" style={{cursor: "pointer", position: "relative", left: "50%", transform: "translate(-50%)"}}>
                            <h2 className="getStarted text-center">See more <span className="fa fa-angle-double-right"/></h2>
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


export default AboutMe;