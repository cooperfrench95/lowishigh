import React, { Component } from 'react';
import { baseURL } from '../shared/baseURL';
import { FormGroup, Button, Form, Label, Input, Collapse } from 'reactstrap';
import { animateScroll as scroll } from 'react-scroll';
import InviewMonitor from 'react-inview-monitor';
import Markdown from 'markdown-to-jsx';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton,
        TelegramIcon, TelegramShareButton,
        LineIcon, LineShareButton, RedditIcon, RedditShareButton, WhatsappIcon,
        WhatsappShareButton } from 'react-share';



class SingleBlogPost extends Component {

    constructor(props) {
        super(props);

        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.handleTextArea = this.handleTextArea.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.renderImageFromImages = this.renderImageFromImages.bind(this);
        this.toggleCommentForm = this.toggleCommentForm.bind(this);
        this.toggleIsAtTop = this.toggleIsAtTop.bind(this);
        this.state = {
            post: undefined,
            isOpen: false,
            isAtTop: true,
            commentCollapse: false,
            checked: false,
            comment: ''
        }
    }

    handleDeleteComment (comment) {
        // Send a redux request to delete the comment. Dispatch fetch blogposts upon success
        this.props.deleteComment(comment, this.state.post, this.props.auth.token);
    }

    toggleCommentForm () {
        this.setState({ commentCollapse: !this.state.commentCollapse })
    }

    handleTextArea (event) {
        this.setState({ comment: event.target.value });
    }

    onFormSubmit (post = this.state.post) {
        // Set up the new comment on the post
        var comment = { author: this.props.auth.username, date: new Date().toISOString(), content: this.state.comment }
        this.props.uploadSomething({ postToUpdate: post, newComment: comment, subscribeMe: this.state.checked }, 'comment', this.props.auth.token);  
    }

    toggleDropdown () {
        this.setState({isOpen: !this.state.isOpen});
    }

    handleCheckbox () {
        this.setState({ checked: !this.state.checked });
    }

    componentDidMount () {
        for (let i = 0; i < this.props.blogposts.blogposts.length; i++) {
            if (this.props.blogposts.blogposts[i]._id === this.props.match.params.id) {
                this.setState({ post: this.props.blogposts.blogposts[i] });
                break
            }
        }
        window.scrollTo(0, 0);
        if (this.props.homeHeaderInView === true) {
            this.props.toggleNavbarTitle(false);
            this.props.changeFirstLoadMarker(false);
        };
    }

    toggleIsAtTop (argument) {
        this.setState({isAtTop: argument});
    }
    

    renderImageFromImages (image, index) {
        for (let i = 0; i < this.props.images.length; i++) {
            let current_image = this.props.images[i];
            if (current_image.src === image) {
                return <img key={index} className="img-fluid blog_image" src={baseURL + 'images/' + image} alt={current_image.alt}/>
            } 
        }
    }

    render () {

        if (this.state.post === undefined) {
            return(
                <React.Fragment>
                    <div style={{position: "fixed", top: "35vh", left: "50%", transform: "translate(-50%, -50%)"}} className="emboss col-8 col-md-6 animated fadeIn">
                        <p>Error: Post not found.</p>
                        <Button onClick={() => this.props.history.push('/blog')} >See other posts</Button>
                    </div>
                    <div style={{height: "70vh"}}></div>
                </React.Fragment>
            );
        }
        
        if (this.state.post.data.title_photo !== undefined) {
            var title_photo = this.renderImageFromImages(this.state.post.data.title_photo);
        }
        var blog_content = this.state.post.data.content.map((element, index) => {
            switch (element.type) {
                case 'p':
                    return(
                        <p key={index}>{element.content}</p>
                    );
                case 'pell':
                    return(
                        <p><Markdown key={index}>{element.content}</Markdown></p>
                    );
                case 'img':
                    return(
                        this.renderImageFromImages(element.image, index)
                    );
                case 'em':
                    return(
                        <p key={index}><em>{element.content}</em></p>
                    );
                case 'strong':
                    return(
                        <p key={index}><strong>{element.content}</strong></p>
                    )
                default:
                    return null
                }
            }
        );
        if (this.state.post.data.comments[0] !== undefined && this.props.auth.admin === false) {
            var comments = <React.Fragment><h2>Comments</h2><div>{this.state.post.data.comments.map((comment, index) => {
                if (comment.author === this.props.auth.username) {
                    return(
                        <React.Fragment key={index}>
                            <p style={{display: "flex", justifyContent: "space-between"}}>
                                <em>{comment.author + ', ' + comment.date.slice(0, comment.date.indexOf('T')) + ":"}</em>
                                <span className="fa fa-close order-last" style={{cursor: "pointer"}} onClick={(event) => {event.preventDefault(); this.handleDeleteComment(comment)}}/>
                            </p>
                            <p>{comment.content}</p>
                        </React.Fragment>  
                    );
                }
                else {
                    return(
                        <React.Fragment key={index}>
                            <p><em>{comment.author + ', ' + comment.date.slice(0, comment.date.indexOf('T')) + ":"}</em></p>
                            <p>{comment.content}</p>
                        </React.Fragment>  
                    );
                }
                    
                })
        } <div style={{borderBottom: "2px solid black", marginTop: "20px", marginBottom: "20px"}}></div></div></React.Fragment>
        }
        else if (this.state.post.data.comments[0] !== undefined && this.props.auth.admin === true) {
            comments = <React.Fragment><h2>Comments</h2><div>{this.state.post.data.comments.map((comment, index) => {
                return(
                    <React.Fragment key={index}>
                        <p style={{display: "flex", justifyContent: "space-between"}}>
                            <em>{comment.author + ', ' + comment.date.slice(0, comment.date.indexOf('T')) + ":"}</em>
                            <span className="fa fa-close order-last" style={{cursor: "pointer"}} onClick={(event) => {event.preventDefault(); this.handleDeleteComment(comment)}}/>
                        </p>
                        <p>{comment.content}</p>
                    </React.Fragment>  
                );    
                })
        } <div style={{borderBottom: "2px solid black", marginTop: "20px", marginBottom: "20px"}}></div></div></React.Fragment>
        }
        else {
            comments = <div></div> 
        }

        if (this.props.auth.loggedIn) {
            var commentForm = <div className="col-12">
                                <Button style={{marginBottom: "20px"}} onClick={() => this.toggleCommentForm()} >Leave a Comment</Button>
                                    <Collapse style={{marginTop: "20px"}} isOpen={this.state.commentCollapse}>
                                        <Form>
                                            <FormGroup>
                                                <Label for={"message"}>Message</Label>
                                                <Input value={this.state.comment} onChange={(event) => this.handleTextArea(event)} type="textarea" rows={10} name={"message"} placeholder="Max. 1000 characters" maxLength="1000" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label check>
                                                    <input type="checkbox" checked={this.state.checked} onChange={() => this.handleCheckbox()} />{' '}
                                                    Send updates to this thread to my inbox
                                                </Label>
                                            </FormGroup>
                                            <FormGroup>
                                                <Button color="primary" onClick={(event) => {
                                                    event.preventDefault();
                                                    if (this.props.auth.loggedIn) {
                                                        this.onFormSubmit();
                                                        this.toggleCommentForm();
                                                    }
                                                    else {
                                                        alert('You must be logged in to comment.');
                                                    }
                                                }}>Submit</Button> 
                                            </FormGroup>
                                        </Form>
                                    </Collapse>
                            </div>
        }
        else {
            commentForm = <div></div>
        }
        return(
            <div className="container-fluid animated fadeIn">
                <div className="row justify-content-center">
                <div className="col-12 col-md-9">
                    <div className="container">
                            <React.Fragment>
                            <div className="row row-content blogpost emboss">
                                <div className="col-12">
                                    <InviewMonitor
                                        childPropsInView={{ className: "lowishigh text-center" }}
                                        childPropsNotInView={{ className: "lowishigh text-center" }}
                                        toggleChildPropsOnInView={true} intoViewMargin={"-10%"}
                                        onInView={() => this.toggleIsAtTop(true)} onNotInView={() => this.toggleIsAtTop(false)}
                                        repeatOnInView={true}>
                                            <h2 className="adjust-for-nav" style={{textAlign: "center", fontSize: '30pt'}}>{this.state.post.data.title}</h2>
                                    </InviewMonitor> 
                                </div>
                                <div className="col-12">
                                    <h3 style={{textAlign: "center"}}>{this.state.post.data.date + " by " + this.state.post.data.author}</h3>
                                </div>
                                <div className="col-12">
                                    {title_photo}
                                </div>
                                <div className="col-12">
                                    {blog_content}
                                    <div style={{borderBottom: "2px solid black", marginTop: "20px", marginBottom: "20px"}}></div>
                                </div>
                                <div className="col-12">
                                    <div style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                                        <FacebookShareButton hashtag={"#lowishigh"} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + this.state.post._id} >
                                            <FacebookIcon size={25} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton title={this.state.post.data.title} via={"Lowishigh"} hashtags={[...this.state.post.data.categories.map(i => "#" + i), "#lowishigh"]} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + this.state.post._id} >
                                            <TwitterIcon size={25} round />
                                        </TwitterShareButton>
                                        <TelegramShareButton title={this.state.post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + this.state.post._id} >
                                            <TelegramIcon size={25} round />
                                        </TelegramShareButton>
                                        <LineShareButton title={this.state.post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + this.state.post._id} >
                                            <LineIcon size={25} round />
                                        </LineShareButton>
                                        <RedditShareButton title={this.state.post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + this.state.post._id} >
                                            <RedditIcon size={25} round />
                                        </RedditShareButton>
                                        <WhatsappShareButton title={this.state.post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + this.state.post._id} >
                                            <WhatsappIcon size={25} round />
                                        </WhatsappShareButton>
                                        <div className="directLinkButton socialButtonsBlogpostBottom" onClick={() => alert("Here's a direct link to the article: " + baseURL + 'singlepost/' + this.state.post._id)}>
                                            <span style={{position: "absolute", fontSize: "12pt", transform: "translate(33%, 33%)"}} className="fa fa-share-alt" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div style={{borderBottom: "2px solid black", marginTop: "20px", marginBottom: "20px"}}></div>
                                    {comments}
                                </div>
                                {commentForm}
                            </div>
                            </React.Fragment>
            </div>
            </div>
            </div>
            <div className={"scrollTopButton mouse-over-highlight animated " + (this.state.isAtTop ? " vis-hidden" : " fadeIn")} onClick={() => scroll.scrollToTop({ smooth: true, duration: 400 })}>
                <h2 style={{textAlign: 'center'}}><span className="fa fa-angle-up" style={{fontSize: "20pt", zIndex: "5"}}></span></h2>
            </div>
        </div>
        );
    }
}

export default SingleBlogPost;