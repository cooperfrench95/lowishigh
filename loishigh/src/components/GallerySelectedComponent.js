import React, { Component } from 'react';
import { baseURL } from '../shared/baseURL';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

class GallerySelected extends Component {


    componentDidMount() {
        window.scrollTo(0, 0)
        if (this.props.firstLoadMarker === true) {
            this.props.changeFirstLoadMarker(false);
            this.props.toggleNavbarTitle(false);
        }
      }
    

    render () {
        const id = Number(this.props.match.params.id); 
        const image = this.props.galleryState.gallery.filter((i) => i['id'] === id)[0]; 
        const left_link = (id >= 1 ? (id - 1).toString() : (this.props.galleryState.gallery.length - 1).toString());
        const right_link = (id < (this.props.galleryState.gallery.length - 1) ? (id + 1).toString() : ((0).toString()));

        return(
            <React.Fragment>
            <div className="container-fluid animated fadeIn">
                <div className="col-12">
                    <div className="row align-items-center">
                        <div className="col-6 col-md-3 order-2 order-md-1">
                            <div className="row-content row addtopmargin">
                                <div className="ml-auto">
                                    <Link to={left_link}><Button outline color="secondary"><span className="fa fa-angle-left"/></Button></Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 order-1 order-md-2">
                            <div className="modalImageContainer">
                                <div className="row-content addtopmargin">
                                    <img src={baseURL + 'images/' + image.image['src']} alt={image.image['alt']} className="fullsize-gallery-image img-fluid"/>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 col-md-3 order-3">
                            <div className="row-content addtopmargin">
                                <div className="ml-auto">
                                    <Link to={right_link}><Button outline color="secondary"><span className="fa fa-angle-right"/></Button></Link>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            </React.Fragment>
        );
    }
}


export default GallerySelected;

