import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Header from './HeaderComponent';
import Home from './HomeComponent';
import AboutMe from './AboutMeComponent';
import * as ActionCreators from '../redux/ActionCreators';
import { Footer } from './FooterComponent';
import Gallery from './GalleryComponent';
import GallerySelected from './GallerySelectedComponent';
import Blog from './BlogComponent';
import { Loading } from './LoadingComponent'
import BlogCategory from './BlogCategoryComponent';
import Portfolio from './PortfolioComponent';
import Articles from './ArticleComponent';
import Login from './LoginComponent';
import Account from './AccountComponent';
import Result from './ResultComponent';
import Signup from './SignupComponent';
import NewPassword from './NewPasswordComponent';
import ForgotPassword from './ForgotPasswordComponent';
import SingleBlogPost from './SingleBlogPostComponent';


const mapStateToProps = state => {
    return {
        homeHeaderInView: state.ToggleNavbarTitle.homeHeaderInView,
        firstLoadMarker: state.changeFirstLoadMarker.firstLoadMarker,
        images: state.images,
        blogposts: state.blogposts,
        projects: state.projects,
        harpers_bazaar: state.harpers_bazaar,
        auth: state.auth,
        resetPassword: state.resetPassword,
        changePasswordRequest: state.changePasswordRequest,
        deleteSomethingState: state.deleteSomethingState,
        uploadSomethingState: state.uploadSomethingState,
        usersState: state.usersState,
        galleryState: state.galleryState,
        categoryState: state.categoryState
    }
}

const mapDispatchToProps = (dispatch) => ({
    toggleNavbarTitle: (value) => dispatch(ActionCreators.toggleNavbarTitle(value)),
    changeFirstLoadMarker: (value) => dispatch(ActionCreators.changeFirstLoadMarker(value)),
    fetchImages: () => dispatch(ActionCreators.fetchImages()),
    fetchBlogposts: () => dispatch(ActionCreators.fetchBlogposts()),
    fetchProjects: () => dispatch(ActionCreators.fetchProjects()),
    fetchUsers: (value) => dispatch(ActionCreators.fetchUsers(value)),
    fetchHarpersBazaar: () => dispatch(ActionCreators.fetchHarpersBazaar()),
    login: (value) => dispatch(ActionCreators.login(value)),
    logout: (value) => dispatch(ActionCreators.logout(value)),
    requestResetPassword: (value) => dispatch(ActionCreators.requestResetPassword(value)),
    changePasswordFromOutsideAccount: (value) => dispatch(ActionCreators.changePasswordFromOutsideAccount(value)),
    changePasswordFromWithinAccount: (value) => dispatch(ActionCreators.changePasswordFromWithinAccount(value)),
    checkForTokenInLocalStorage: () => dispatch(ActionCreators.checkForTokenInLocalStorage()),
    deleteAccount: (value1, value2) => dispatch(ActionCreators.deleteAccount(value1, value2)),
    createAccount: (values) => dispatch(ActionCreators.createAccount(values)),
    deleteSomething: (value1, value2, value3, value4, value5, value6) => dispatch(ActionCreators.deleteSomething(value1, value2, value3, value4, value5, value6)),
    uploadSomething: (value1, value2, value3) => dispatch(ActionCreators.uploadSomething(value1, value2, value3)),
    setMessageReadToTrue: (message, token, inbox) => dispatch(ActionCreators.setMessageReadToTrue(message, token, inbox)),
    deleteComment: (comment, blogpost, token) => dispatch(ActionCreators.deleteComment(comment, blogpost, token)),
    fetchGallery: () => dispatch(ActionCreators.fetchGallery()),
    changeGallery: (newGallery, token, imagesToDelete) => dispatch(ActionCreators.changeGallery(newGallery, token, imagesToDelete)),
    fetchCategories: () => dispatch(ActionCreators.fetchCategories()),
    changeCategories: (newCategories, token) => dispatch(ActionCreators.changeCategories(newCategories, token))
});

class Main extends Component {

    constructor(props) {
        super(props);

        this.props.fetchBlogposts();
        this.props.fetchImages();
        this.props.fetchProjects();
        this.props.fetchHarpersBazaar();
        this.props.fetchGallery();
        this.props.fetchCategories();
    }

    componentDidMount () {
        this.props.checkForTokenInLocalStorage();
    }
    

    render() {
        if (this.props.images.isLoading || this.props.blogposts.isLoading || this.props.projects.isLoading || this.props.harpers_bazaar.isLoading
            || this.props.galleryState.isLoading || this.props.categoryState.isLoading) {
            return (
                <Loading />
            );
        }
        else if (this.props.images.errorMessage) {
            return (
                <div><h1>{this.props.images.errorMessage}</h1></div>
            );
        }
        else if (this.props.projects.errorMessage) {
            return (
                <div><h1>{this.props.projects.errorMessage}</h1></div>
            );
        }
        else if (this.props.blogposts.errorMessage) {
            return (
                <div><h1>{this.props.blogposts.errorMessage}</h1></div>
            );
        }
        else if (this.props.harpers_bazaar.errorMessage) {
            return (
                <div><h1>{this.props.harpers_bazaar.errorMessage}</h1></div>
            );
        }
        else if (this.props.galleryState.errorMessage) {
            return (
                <div><h1>{this.props.galleryState.errorMessage}</h1></div>
            );
        }
        else if (this.props.categoryState.errorMessage) {
            return (
                <div><h1>{this.props.categoryState.errorMessage}</h1></div>
            );
        }
        else {

            var mappedImages = this.props.images.images.map((image, index) => {image.id = index; return image})
        
            return(
                <div className="global-background">
                    <Header {...this.props} history={this.props.history} homeHeaderInView={this.props.homeHeaderInView} 
                            firstLoadMarker={this.props.firstLoadMarker}
                            breadcrumb={this.props.breadcrumb} />
                    <Switch >
                        <Route exact path="/home" render={() => <Home {...this.props} images={mappedImages}/>}/>
                        <Route exact path="/about" render={() => <AboutMe {...this.props}/>}/>
                        <Route exact path="/gallery" render={() => <Gallery {...this.props} images={mappedImages}/>}/>
                        <Route exact path="/img/:id" render={(props) => <GallerySelected {...this.props} match={props.match}/>}/>
                        <Route exact path="/blog" render={() => <Blog {...this.props} images={mappedImages} blogposts={this.props.blogposts.blogposts} />}/>
                        <Route exact path="/blog/categories/:id" render={(props) => <BlogCategory {...this.props} match={props.match} images={mappedImages} blogposts={this.props.blogposts.blogposts}/>}/>
                        <Route exact path="/singlepost/:id" render={(props) => <SingleBlogPost {...this.props} match={props.match} images={mappedImages}/>}/>
                        <Route exact path="/portfolio" render={() => <Portfolio {...this.props} projects={this.props.projects.projects}/>}/>
                        <Route exact path="/articles" render={() => <Articles {...this.props} harpers_bazaar={this.props.harpers_bazaar.harpers_bazaar}/>}/>
                        <Route exact path="/login" render={() => <Login {...this.props}/>}/>
                        <Route exact path="/account" render={() => <Account {...this.props} />}/>
                        <Route exact path="/register" render={() => <Signup {...this.props}/>}/>
                        <Route exact path="/result/:id" render={(props) => <Result {...this.props} match={props.match} />}/>
                        <Route exact path="/newpassword" render={() => <NewPassword {...this.props}/>}/>
                        <Route exact path="/forgotpassword" render={() => <ForgotPassword {...this.props}/>}/>
                        <Redirect to="/home" />
                    </Switch>

                    <Footer breadcrumb={this.props.breadcrumb} />
                </div>
        );
        }
    }

}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

