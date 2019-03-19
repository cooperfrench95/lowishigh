import React, { Component } from 'react';
import { Trail, config } from 'react-spring';
import { Link, animateScroll as scroll, Element } from 'react-scroll';
import InviewMonitor from 'react-inview-monitor';

class Articles extends Component {

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
        // List of featured articles
        var harpers_bazaar_featured = this.props.harpers_bazaar.map((item, index) => {
            if (index < 4) {
                return(
                    <React.Fragment key={index}>
                        <h2 style={{textAlign: 'right', height: '200px'}}><a style={{ fontSize: '22pt', color: 'black'}} href={item.link}>{item.title}</a></h2>
                        <p style={{ textAlign: 'right' }}>{item.date}</p>
                        <img style={{width: "100%"}} className="img-fluid" src={item.img.src} alt={item.img.alt}/>
                    </React.Fragment>
                );
            }
            else {
                return undefined   
            }
        })

        harpers_bazaar_featured = harpers_bazaar_featured.slice(0, 4)
        
        // List of articles except featured articles
        var harpers_bazaar = this.props.harpers_bazaar.map((item, index) => {
            if (index >= 4) {
                return(
                    <div className="row row-content" key={index}>
                        <div className="col-12">
                            <img className="img-fluid" src={item.img.src} alt={item.img.alt}/>
                        </div>
                        <div className="col-12">
                            <h3><a className="all_articles_text" href={item.link}>{item.title}</a></h3>
                            <p className="all_articles_text">{item.date}</p>
                        </div>
                        
                    </div>
                );
            }
            else {
                return undefined
            }});
        // Remove the undefined elements
        harpers_bazaar = harpers_bazaar.slice(4, harpers_bazaar.length)


        return(
            <div className="container-fluid animated fadeIn">
                <div className="row row-content addtopmargin">
                    <div className="col-12">
                        <h1 className="gallery-heading text-center">Articles</h1>
                    </div>
                </div>
                <InviewMonitor onInView={() => this.toggleIsAtTop(true)} onNotInView={() => this.toggleIsAtTop(false)} repeatOnInView={true} >
                <div className="row row-content">
                
                    <Trail
                        from={{transform: 'translate3d(0, -50px, 0)', opacity: '0'}}
                        to={{transform: 'translate3d(0,0px,0)', opacity: '1' }}
                        config={config.wobbly}
                        items={harpers_bazaar_featured} keys={harpers_bazaar_featured.map((item, index) => {return index})}>
                        {item => props =>
                            <div className="col-12 col-md-6 col-lg-3 emboss articles-height mouse-over-highlight" style={props}>{item}</div>
                        }
                    </Trail>
                    
                   
                </div>
                </InviewMonitor>
                <div className="row">
                    <div className="col-12">
                        {this.state.isAtTop
                            ?   <Link to="See All " smooth={true} offset={-50} style={{borderRadius: "0%"}} className="scrollTopButton mouse-over-highlight animated fadeIn" >
                                    <h2 style={{textAlign: 'center'}}>See All <span className="fa fa-caret-down"/></h2>
                                </Link>
                            :   <div className="scrollTopButton mouse-over-highlight animated fadeIn" onClick={() => scroll.scrollToTop({ smooth: true, duration: 400})}>
                                    <h2 style={{textAlign: 'center'}}><span className="fa fa-angle-up" style={{fontSize: "20pt"}}></span></h2>
                                </div>
                        }
                    </div>
                </div>
                <Element name="See All ">
                    <div className="row">
                    {harpers_bazaar.map((article, index) => {
                        return(
                            <div className="col-6 col-md-3 mouse-over-highlight" key={index}>
                                {article}
                            </div>
                        )
                    })}
                    </div>
                    
                </Element>
            </div>
        );
    }
};

export default Articles;