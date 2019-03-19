import React, { Component } from 'react';
import InviewMonitor from 'react-inview-monitor';
import { Link } from 'react-router-dom';
import { baseURL } from '../shared/baseURL';
import { animateScroll as scroll } from 'react-scroll';

class Gallery extends Component {

    constructor(props) {
        super(props);

        this.toggleIsAtTop = this.toggleIsAtTop.bind(this);
        this.state = {
            isAtTop: true
        }
    }

    componentDidMount () {
        window.scrollTo(0, 0);
        if (this.props.homeHeaderInView === true) {
            this.props.toggleNavbarTitle(false);
            this.props.changeFirstLoadMarker(false);
        };
    }

    toggleIsAtTop (argument) {
        this.setState({isAtTop: argument});
    }

    render () {

        return(
        <div className="container animated fadeIn">
            <div className="row row-content">
                <div className="col-12">
                <InviewMonitor
                childPropsInView={{ className: "gallery-heading text-center addtopmargin" }}
                childPropsNotInView={{ className: "gallery-heading text-center addtopmargin" }}
                toggleChildPropsOnInView={true} intoViewMargin={"-10%"}
                onInView={() => this.toggleIsAtTop(true)} onNotInView={() => this.toggleIsAtTop(false)}
                repeatOnInView={true}>
                    <h1>Gallery</h1>
                </InviewMonitor>
                    
                </div>
            </div>
            <div className="row row-content">
                {
                    this.props.galleryState.gallery.map((image, index) =>
                    <InviewMonitor classNameNotInView="col-4 image-sizing add-hover" classNameInView="col-4 image-sizing add-hover" 
                    intoViewMargin='-5%' toggleChildPropsOnInView={true} childPropsInView={{className: "image-gallery-image animated fadeIn"}} 
                    childPropsNotInView={{className: "image-gallery-image vis-hidden"}} key={image.id} >
                        <div><Link to={"/img/" + index}><img className="image-gallery-image img-fluid" 
                        src={baseURL + 'images/' + image.image.src} id={index} alt={image.image.alt}/></Link></div>
                    </InviewMonitor>
                    ) 
                }
            </div>
            <div className={"scrollTopButton mouse-over-highlight animated " + (this.state.isAtTop ? " vis-hidden" : " fadeIn")} onClick={() => scroll.scrollToTop({ smooth: true, duration: 400})}>
                <h2 style={{textAlign: 'center'}}><span className="fa fa-angle-up" style={{fontSize: "20pt"}}></span></h2>
            </div>
        </div>

    );
        
    }
};


export default Gallery;