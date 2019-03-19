import React, { Component } from 'react';
import { baseURL } from '../shared/baseURL';
import { Trail } from 'react-spring';
import { Link } from 'react-router-dom';


class Blog extends Component {

    componentDidMount () {
        window.scrollTo(0, 0);
        this.props.toggleNavbarTitle(false);        
        if (this.props.homeHeaderInView === true) {
            this.props.changeFirstLoadMarker(false);
        };
    }

    // Function that will pick unique images for each category if none have been assigned, otherwise use the pre-assigned images.
    getCategoryImages() {
        
        // Get a list of all categories
        var categorySet = new Set();
        this.props.blogposts.map((post, index) => {
            for (let i = 0; i < post.data.categories.length; i++) {
                categorySet.add(post.data.categories[i])
            }
            return post
        });
        var categories = Array.from(categorySet);

        // Remove the categories that have already been assigned images
        if (this.props.categoryState.categories.length !== 0) {
            var categoriesThatAlreadyHaveCustomImages = this.props.categoryState.categories.map((category) => category.category);
            var imagesThatAreAlreadySetToCategories = this.props.categoryState.categories.map((category) => category.image.src);
            categories = categories.filter(i => !categoriesThatAlreadyHaveCustomImages.includes(i))
        }

        else {
            categoriesThatAlreadyHaveCustomImages = [];
            imagesThatAreAlreadySetToCategories = [];
        }

        // Get a list of available images for each category
        var available_images = categories.map((category) => {
            var images = [];
            this.props.blogposts.map((post, index) => {
                if (post.data.categories.includes(category)) {
                    if (post.data.title_photo && !imagesThatAreAlreadySetToCategories.includes(post.data.title_photo)) {
                        images.push(post.data.title_photo);
                    }
                    for (let i = 0; i < post.data.content.length; i++) {
                        if (post.data.content[i].type === 'img' && !imagesThatAreAlreadySetToCategories.includes(post.data.content[i].image)) {
                            images.push(post.data.content[i].image)
                        }
                    }
                }
                return post
            });
            var newCategory = {};
            newCategory.images = images;
            newCategory.category = category;
            return newCategory
        });

        // Sort the list by length
        available_images.sort((a, b) => a.images.length - b.images.length);
        console.log(available_images);

        // Iterate over the list, assigning images to each category.
        var mapImagesToCategories = available_images.map((item, index) => {
            let newItem = {};
            newItem.id = index;
            newItem.category = item.category;
            for (let i = 0; i < item.images.length; i++) {
                if (!imagesThatAreAlreadySetToCategories.includes(item.images[i])) {
                    newItem.image = item.images[i];
                    imagesThatAreAlreadySetToCategories.push(item.images[i]);
                    break
                }
            }
            return newItem
        });
        
        // Add any preset images
        if (this.props.categoryState.categories.length !== 0) {
            for (let i = 0; i < this.props.categoryState.categories.length; i++) {
                mapImagesToCategories.push({ category: this.props.categoryState.categories[i].category, image: this.props.categoryState.categories[i].image.src});
            }
        }

        return mapImagesToCategories
    }

    render () {

        const mapImagesToCategories = this.getCategoryImages();
        console.log(mapImagesToCategories);

        return(
            <div className="container-fluid animated fadeIn">
                <div className="row row-content">
                    <div className="col-12">
                        <h1 className="gallery-heading text-center addtopmargin">Categories</h1>
                    </div>
                </div>
                <div className="row">
                    <Trail items={
                        mapImagesToCategories.map(item => {
                            for (let i = 0; i < this.props.images.length; i++) {
                                if (this.props.images[i].src === item.image) {
                                    var current_image = this.props.images[i]
                                    break
                                }
                            }
                            let backgroundImageForDiv = "url(" + baseURL + 'images/' + current_image['src'] + ")";
                            return(
                                <React.Fragment key={item.key}>
                                    <Link to={"/blog/categories/" + item.category}>
                                    <div className="row justify-content-center">
                                        <div style={{backgroundImage: backgroundImageForDiv,
                                        backgroundSize: 'cover', marginTop: '25px'}} 
                                        className="rounded-corners"/>
                                    </div>
                                    <div className="row justify-content-center">
                                        <h2 style={{marginBottom: '25px'}} className="text-center addtopmargin makeSmallerForPhones">{item.category}</h2>
                                    </div>
                                    </Link>
                                </React.Fragment>
                            );
                        })}
                        keys={item => item.key} 
                        from={{transform: 'translate3d(-100px, 0, 0)', opacity: '0'}}
                        to={{transform: 'translate3d(0px,0,0)', opacity: '1' }}
                        config={{tension: 200, friction: 10, clamp: true}}
                    >{item => props =>
                        <div className="col-4 col-md-3 mouse-over-highlight" style={props}>{item}</div>
                      }
                    </Trail>
                </div>
                <div style={{height: "5vh"}}></div>
            </div>
        );
    }
}


export default Blog;