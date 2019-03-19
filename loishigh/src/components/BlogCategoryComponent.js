import React, { Component } from 'react';
import { baseURL } from '../shared/baseURL';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Button, Form, Label, Input, Collapse } from 'reactstrap';
import { Link, animateScroll as scroll, Element } from 'react-scroll';
import InviewMonitor from 'react-inview-monitor';
import Markdown from 'markdown-to-jsx';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton,
        TelegramIcon, TelegramShareButton,
        LineIcon, LineShareButton, RedditIcon, RedditShareButton, WhatsappIcon,
        WhatsappShareButton } from 'react-share';



class BlogCategory extends Component {

    constructor(props) {
        super(props);

        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.handleTextArea = this.handleTextArea.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.renderImageFromImages = this.renderImageFromImages.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.toggleCommentForm = this.toggleCommentForm.bind(this);
        this.toggleIsAtTop = this.toggleIsAtTop.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            isOpen: false,
            isAtTop: true,
            floatingButtonsHidden: false,
            timer: undefined,
            commentCollapse: undefined,
            checked: false,
            comment: { comment: '', index: undefined }
        }
    }

    handleDeleteComment (post, comment) {
        // Send a redux request to delete the comment. Dispatch fetch blogposts upon success
        this.props.deleteComment(comment, post, this.props.auth.token);
    }

    toggleCommentForm (postsToRender, actionableIndex) {
        if (this.state.commentCollapse === undefined) {
            this.setState({commentCollapse: postsToRender.map((post, index) => {
                if (index === actionableIndex) {
                    return true
                }
                else {
                    return false
                }
            })})
        }
        else {
            this.setState({commentCollapse: postsToRender.map((post, index) => {
                if (index === actionableIndex) {
                    return !this.state.commentCollapse[actionableIndex]
                }
                else {
                    return false
                }
            })
        })
        }
    }

    handleTextArea (event, index) {
        this.setState({ comment: { comment: event.target.value, index: index }});
    }

    onFormSubmit (post, index) {
        // Set up the new comment on the post
        if (index === this.state.comment.index) {
            var comment = { author: this.props.auth.username, date: new Date().toISOString(), content: this.state.comment.comment }
            this.props.uploadSomething({ postToUpdate: post, newComment: comment, subscribeMe: this.state.checked }, 'comment', this.props.auth.token);  
        }
    }

    toggleDropdown () {
        this.setState({isOpen: !this.state.isOpen});
    }

    handleCheckbox () {
        this.setState({ checked: !this.state.checked });
    }

    handleScroll (event, mouseHover = false) {
        if (mouseHover === false) {
            this.setState({floatingButtonsHidden: false});
            clearTimeout(this.state.timer);
            this.setState({timer: setTimeout(() => {
                if (this.state.floatingButtonsHidden === false) {
                    this.setState({floatingButtonsHidden: true})
                }
            }, 2000)
            });
        }
        else {
            event.preventDefault();
            clearTimeout(this.state.timer);
            this.setState({ floatingButtonsHidden: false });
        }
    }


    componentWillUnmount () {
        this.setState({ timer: undefined })
    }

    componentDidMount () {
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.handleScroll);
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

        var buttonsHidden = this.state.floatingButtonsHidden ? " animated fadeOut" : " animated fadeIn";

        // Create a list of posts to render, sort them chronologically
        const category = this.props.match.params.id;
        const postsToRender = [];
        for (let num = 0; num < this.props.blogposts.length; num++) {
            var current_post = this.props.blogposts[num];
            for (let i = 0; i < current_post.data.categories.length; i++) {
                let current_category = current_post.data.categories[i];
                if (current_category === category && !postsToRender.includes(current_post)) {
                    postsToRender.push(current_post)
                    break                  
                }
            }
        }
        
        postsToRender.sort((a, b) => {
            a = new Date(a.data.date);
            b = new Date(b.data.date);
            return b - a
        })

        // Create a list of links to the posts
        const links = []
        for (let i = 0; i < postsToRender.length; i++) {
            let current_post = postsToRender[i]
            // create a ref for the item, then that ref needs to be passed to the item
            links.push(<Link key={i} to={current_post.data.title} smooth={true} isDynamic={true} duration={400} offset={-150}>
            <DropdownItem className="mouse-over-highlight" style={{ cursor: 'pointer', width: '300px'}}>
                        
                        <span style={{whiteSpace: 'normal'}}>
                            {current_post.data.title}
                        </span>
                        
                        </DropdownItem></Link>)
        }

        return(
            <div className="container-fluid animated fadeIn">
                <div className="row justify-content-center">
                <div className="col-12 col-md-9">
                    <div className="container">
                    {
                        postsToRender.map((post, index) => {
                            
                            if (post.data.title_photo !== undefined) {
                                var title_photo = this.renderImageFromImages(post.data.title_photo);
                            }
                            var blog_content = post.data.content.map((element, index) => {
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
                            if (post.data.comments[0] !== undefined && this.props.auth.admin === false) {
                                var comments = <React.Fragment><h2>Comments</h2><div>{post.data.comments.map((comment, index) => {
                                    if (comment.author === this.props.auth.username) {
                                        return(
                                            <React.Fragment key={index}>
                                                <p style={{display: "flex", justifyContent: "space-between"}}>
                                                    <em>{comment.author + ', ' + comment.date.slice(0, comment.date.indexOf('T')) + ":"}</em>
                                                    <span className="fa fa-close order-last" style={{cursor: "pointer"}} onClick={(event) => {event.preventDefault(); this.handleDeleteComment(post, comment)}}/>
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
                            else if (post.data.comments[0] !== undefined && this.props.auth.admin === true) {
                                comments = <React.Fragment><h2>Comments</h2><div>{post.data.comments.map((comment, index) => {
                                    return(
                                        <React.Fragment key={index}>
                                            <p style={{display: "flex", justifyContent: "space-between"}}>
                                                <em>{comment.author + ', ' + comment.date.slice(0, comment.date.indexOf('T')) + ":"}</em>
                                                <span className="fa fa-close order-last" style={{cursor: "pointer"}} onClick={(event) => {event.preventDefault(); this.handleDeleteComment(post, comment)}}/>
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
                                                    <Button style={{marginBottom: "20px"}} onClick={() => this.toggleCommentForm(postsToRender, index)} >Leave a Comment</Button>
                                                        <Collapse style={{marginTop: "20px"}} isOpen={this.state.commentCollapse ? this.state.commentCollapse[index] : false}>
                                                            <Form>
                                                                <FormGroup>
                                                                    <Label for={"message" + index}>Message</Label>
                                                                    <Input value={this.state.comment.comment} onChange={(event) => this.handleTextArea(event, index)} type="textarea" rows={10} name={"message" + index} placeholder="Max. 1000 characters" maxLength="1000" />
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
                                                                            this.onFormSubmit(post, index);
                                                                            this.toggleCommentForm(postsToRender, index);
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
                                <React.Fragment key={index}>
                                <div className="row row-content blogpost emboss">
                                    
                                    <div className="col-12">
                                        {(index === 0) 
                                        ?   <InviewMonitor
                                                childPropsInView={{ className: "lowishigh text-center" }}
                                                childPropsNotInView={{ className: "lowishigh text-center" }}
                                                toggleChildPropsOnInView={true} intoViewMargin={"-10%"}
                                                onInView={() => this.toggleIsAtTop(true)} onNotInView={() => this.toggleIsAtTop(false)}
                                                repeatOnInView={true}>
                                                    <Element name={post.data.title}>
                                                        <h2 className="adjust-for-nav" style={{textAlign: "center", fontSize: '30pt'}}>{post.data.title}</h2>
                                                    </Element>
                                            </InviewMonitor> 
                                        :   <Element name={post.data.title}>
                                                <h2 className="adjust-for-nav" style={{textAlign: "center", fontSize: '30pt'}}>{post.data.title}</h2>
                                            </Element>}
                                    </div>
                                    
                                    <div className="col-12">
                                        <h3 style={{textAlign: "center"}}>{post.data.date + " by " + post.data.author}</h3>
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
                                            <FacebookShareButton hashtag={"#lowishigh"} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + post._id} >
                                                <FacebookIcon size={25} round />
                                            </FacebookShareButton>
                                            <TwitterShareButton title={post.data.title} via={"Lowishigh"} hashtags={[...post.data.categories.map(i => "#" + i), "#lowishigh"]} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + post._id} >
                                                <TwitterIcon size={25} round />
                                            </TwitterShareButton>
                                            <TelegramShareButton title={post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + post._id} >
                                                <TelegramIcon size={25} round />
                                            </TelegramShareButton>
                                            <LineShareButton title={post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + post._id} >
                                                <LineIcon size={25} round />
                                            </LineShareButton>
                                            <RedditShareButton title={post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + post._id} >
                                                <RedditIcon size={25} round />
                                            </RedditShareButton>
                                            <WhatsappShareButton title={post.data.title} className="socialButtonsBlogpostBottom" url={baseURL + 'singlepost/' + post._id} >
                                                <WhatsappIcon size={25} round />
                                            </WhatsappShareButton>
                                            <div className="directLinkButton socialButtonsBlogpostBottom" onClick={() => prompt("Here's a direct link to the article: ", baseURL + 'singlepost/' + post._id)}>
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
                            )
                        })
                    }
                </div>
                </div>
                </div>
                <div className={"scrollTopButton mouse-over-highlight animated " + (this.state.isAtTop ? " vis-hidden" : " fadeIn")} onClick={() => scroll.scrollToTop({ smooth: true, duration: 400 })}>
                    <h2 style={{textAlign: 'center'}}><span className="fa fa-angle-up" style={{fontSize: "20pt", zIndex: "5"}}></span></h2>
                </div>
                    
                <span onClick={() => this.props.history.goBack()} onMouseEnter={(event) => this.handleScroll(event, true)} onMouseLeave={this.handleScroll} className={"fa fa-angle-left mouse-over-highlight backButton" + buttonsHidden} style={{fontSize: "20pt"}}></span>
                
                <ButtonDropdown isOpen={this.state.isOpen} onMouseEnter={(event) => this.handleScroll(event, true)} onMouseLeave={this.handleScroll} toggle={this.toggleDropdown} className={"blogButtonDropdown" + buttonsHidden}>
                    <DropdownToggle caret className="postsDropdownButtonInner">
                        Posts
                    </DropdownToggle>
                    <DropdownMenu onMouseEnter={(event) => this.handleScroll(event, true)} onMouseLeave={this.handleScroll}>
                        {links}
                    </DropdownMenu>
                </ButtonDropdown>
            </div>
        );
    }
}

export default BlogCategory;