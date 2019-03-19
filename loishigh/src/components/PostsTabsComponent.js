import React from 'react';
import { Button, Input, TabContent, TabPane, Nav, NavItem, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { baseURL } from '../shared/baseURL';

export default class PostsTabs extends React.Component {

    constructor(props) {
        super(props);

        this.toggleModal = this.toggleModal.bind(this);
        this.handleGallerySelectedChange = this.handleGallerySelectedChange.bind(this);
        this.changeTabs = this.changeTabs.bind(this);
        this.state = {
            activeTab: 'posts',
            isOpen: false,
            isCategoryModalOpen: false,
            selectedGalleryImages: this.props.galleryState.gallery.map(i => i.image),
            galleryStateCopy: this.props.galleryState.gallery.map(i => i.image),
            galleryImagesForDeletion: [],
            selectedCategoryImages: this.props.categoryState.categories,
            selectedCategory: '',
            selectedImage: undefined
        }
    }

    changeTabs (tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
    }

    toggleModal () {
        this.setState({ isOpen: !this.state.isOpen })
    }

    toggleCategoryModal () {
        this.setState({ isCategoryModalOpen: !this.state.isCategoryModalOpen })
    }

    handleCategoryImagesSelectedChange () {
        if (this.state.selectedCategoryImages !== this.props.categoryState.categories) {
            this.props.changeCategories(this.state.selectedCategoryImages, this.props.auth.token)
        }
    }

    async handleGallerySelectedChange () {
        if (this.state.selectedGalleryImages !== this.state.galleryStateCopy) {
            for (let i = 0; i < this.state.galleryStateCopy.length; i ++) {
                // Check if the images in the old gallery are all still in the new gallery, and IF NOT, add them to the deletion list
                if (this.state.selectedGalleryImages.indexOf(this.state.galleryStateCopy[i]) === -1) {
                    await this.setState({ galleryImagesForDeletion: [...this.state.galleryImagesForDeletion, this.state.galleryStateCopy[i]]})
                }
            }
            this.props.changeGallery(this.state.selectedGalleryImages, this.props.auth.token, this.state.galleryImagesForDeletion);
        }
    }

    render() {

        // I know, this isn't the best way to sort by date, 
        // but the dates are strings and they're not ISO formatted so this is the ugly solution for now.
        const postsToRender = this.props.blogposts.blogposts.sort((a, b) => {
            a = new Date(a.data.date);
            b = new Date(b.data.date);
            return b - a
        })

        var categories = new Set();
        this.props.blogposts.blogposts.map((post) => {
            for (let i = 0; i < post.data.categories.length; i++) {
                categories.add(post.data.categories[i])
            }
            return post                      
        })
        categories = Array.from(categories);
        categories = categories.map((category, index) => {
            return <option key={index} value={category}>{category}</option>
        })

        return(
            <div>
                <Nav>
                    <NavItem>
                        <button className={"my-nav-tabs" + (this.state.activeTab === 'posts' ? " active" : "")} onClick={() => this.changeTabs('posts')}>
                            POSTS
                        </button>
                    </NavItem>
                    <NavItem>
                        <button className={"my-nav-tabs" + (this.state.activeTab === 'images' ? " active" : "")} onClick={() => this.changeTabs('images')}>
                            IMAGES
                        </button>
                    </NavItem>
                    <NavItem>
                        <button className={"my-nav-tabs" + (this.state.activeTab === 'projects' ? " active" : "")} onClick={() => this.changeTabs('projects')}>
                            PROJECTS
                        </button>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="posts" className="my-tab-pane">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <h2 style={{marginTop: "40px" }}>Posts</h2>
                                    </div>  
                                </div>
                                <div className="col-12" style={{ border: "1px solid grey", height: "400px", overflow: "hidden", overflowY: "scroll"}}>
                                    {postsToRender.map((post, index) => {
                                        
                                        var background = index % 2 === 0 ? "#D3D7CF" : "white";

                                        return(
                                            <div className="row" style={{paddingTop: "16px", backgroundColor: background}} key={index}>
                                                <p className="col-6 col-md-10">{post.data.title} -  <span style={{fontSize: "8pt"}}>{post.data.date}</span></p>
                                                <span style={{cursor: "pointer"}} onClick={() => this.props.changeView('posteditor', 'post', post)} className="fa fa-pencil col-1" />
                                                <span style={{cursor: "pointer"}} onClick={() => this.props.changeView('confirm', (' delete the post "' + post.data.title + '"?'),
                                                                                            () => this.props.deleteSomethingFromServer(post, 'blogpost'), true, 'posts')} className="fa fa-close col-1" />
                                            </div>
                                        );  
                                    })}
                                </div>
                                <div className="col-12">
                                    <div className="row" style={{display: "flex", justifyContent: "space-between"}}>
                                        <Button style={{marginTop: "15px", paddingLeft: "15px"}} onClick={() => this.props.changeView('posteditor', 'post')}>New Post</Button>
                                        <Button style={{marginTop: "15px", paddingLeft: "15px"}} onClick={() => this.toggleCategoryModal()}>Choose Category Images</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="images" className="my-tab-pane">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <h2 style={{marginTop: "40px" }}>Images</h2>
                                    </div>  
                                </div>
                                <div className="col-12" style={{ border: "1px solid grey", height: "60vh", overflow: "hidden", overflowY: "scroll"}}>
                                    <div className="row">
                                        {this.props.images.images.map((img, index) => {
                                            return(
                                                <div className="imageListDiv col-5 col-md-3" style={{height: "30vh"}} key={index}>
                                                    <img className="imageListImage" src={baseURL + 'images/' + img.src} alt={img.alt} />
                                                    <span className="imageListCloseButton fa fa-close" onClick={() => this.props.changeView('confirm', (' delete the image "' + img.src + '"?'),
                                                                                                                () => this.props.deleteSomethingFromServer(img, 'image'), true, 'posts')}/>
                                                </div>
                                            );  
                                        })}
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="row" style={{display: "flex", justifyContent: "space-between"}}>
                                        <Button style={{marginTop: "15px", paddingLeft: "15px"}} onClick={() => this.props.changeView('posteditor', 'image')}>Upload new image</Button>
                                        <Button style={{marginTop: "15px", paddingLeft: "15px"}} onClick={() => this.toggleModal()}>Edit Gallery</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tabId="projects" className="my-tab-pane">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <h2 style={{marginTop: "40px" }}>Projects</h2>
                                    </div>  
                                </div>
                                <div className="col-12" style={{ border: "1px solid grey", height: "400px", overflow: "hidden", overflowY: "scroll"}}>
                                    {this.props.projects.projects.map((project, index) => {
                                        
                                        var background = index % 2 === 0 ? "#D3D7CF" : "white";

                                        return(
                                            <div className="row" style={{paddingTop: "16px", backgroundColor: background}} key={index}>
                                                <p className="col-6 col-md-10">{project.data.title} -  <span style={{fontSize: "8pt"}}>{project.data.time}</span></p>
                                                <span style={{cursor: "pointer"}} onClick={() => this.props.changeView('posteditor', 'project', project)} className="fa fa-pencil col-1" />
                                                <span style={{cursor: "pointer"}} onClick={() => this.props.changeView('confirm', (' delete the project "' + project.data.title + '"?'),
                                                                                            () => this.props.deleteSomethingFromServer(project, 'project'), true, 'posts')} className="fa fa-close col-1" />
                                            </div>
                                        );  
                                    })}
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <Button style={{marginTop: "15px", paddingLeft: "15px"}} onClick={() => this.props.changeView('posteditor', 'project')}>New Project</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPane>
                </TabContent>
                <Modal isOpen={this.state.isOpen} toggle={() => this.toggleModal()}>
                    <ModalHeader>
                        Select Gallery Images
                    </ModalHeader>
                    <ModalBody>
                        <p className="col-12">Double-click to delete existing</p>
                        <div className="col-12" style={{ border: "1px solid grey", height: "70vh", overflow: "hidden", overflowY: "scroll"}}>
                            <div className="row">
                                {this.props.images.images.map((img, index) => {
                                    if (img.hasOwnProperty('id')) {
                                        delete img.id;
                                    }
                                    return(
                                        <div onClick={() => {
                                                console.log('img: ', img);
                                                var withoutImg = this.state.selectedGalleryImages.filter((i) => i.src !== img.src);
                                                console.log('withoutImg: ', withoutImg);
                                                this.setState({ selectedGalleryImages: this.state.selectedGalleryImages.indexOf(img) !== -1 ? withoutImg : [...this.state.selectedGalleryImages, img] });
                                            }} 
                                            className="imageListDiv col-3" 
                                            style={this.state.selectedGalleryImages.filter((i) => i !== undefined ? i.src === img.src : false).length !== 0 ? {border: "4px solid blue"} : {}} 
                                            key={index}
                                        >
                                            <img className="imageListImage"  src={baseURL + 'images/' + img.src} alt={img.alt} />
                                        </div>
                                    );  
                                })}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter style={{display: "flex", justifyContent: "space-between"}}>
                        <Button onClick={() => {this.toggleModal(); this.handleGallerySelectedChange()}} color="primary" className="mr-auto">Save</Button>
                        <Button onClick={() => this.toggleModal()} className="order-last">Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.isCategoryModalOpen} toggle={() => this.toggleCategoryModal()}>
                    <ModalHeader>
                        Select Category Images
                    </ModalHeader>
                    <ModalBody>
                        <label htmlFor="selectCategory">Select Category</label>
                        <Input type="select" value={this.state.selectedCategory} onChange={async (event) => {
                            await this.setState({ selectedCategory: event.target.value, selectedImage: undefined });
                            this.state.selectedCategoryImages.map((category) => {
                                if (category.category === this.state.selectedCategory) {
                                    this.setState({ selectedImage: category.image });
                                }
                                return category
                            });
                        }} >
                            <option selected={true} >Select...</option>
                            {categories}
                        </Input>
                        <div className="col-12 addtopmargin" style={{ border: "1px solid grey", height: "60vh", overflow: "hidden", overflowY: "scroll"}}>
                            <div className="row">
                                {this.props.images.images.map((img, index) => {
                                    
                                    return(
                                        <div onClick={async () => {
                                                await this.setState({ selectedImage: img });
                                                var newCategoriesState = this.state.selectedCategoryImages.map((category) => {
                                                    if (category.category === this.state.selectedCategory) {
                                                        category.image = this.state.selectedImage
                                                    }
                                                    return category
                                                })
                                                var changed = false;
                                                for (let i = 0; i < this.state.selectedCategoryImages.length; i++) {
                                                    if (newCategoriesState[i].category === this.state.selectedCategory) {
                                                        changed = true;
                                                        break
                                                    }
                                                }
                                                if (!changed) {
                                                    this.setState({ selectedCategoryImages: [...this.state.selectedCategoryImages, 
                                                        { category: this.state.selectedCategory, image: this.state.selectedImage} ] })
                                                }
                                                else {
                                                    this.setState({ selectedCategoryImages: newCategoriesState })
                                                }
                                            }}
                                            className="imageListDiv col-3" 
                                            style={this.state.selectedImage === img ? {border: "4px solid blue"} : {}} 
                                            key={index}
                                        >
                                            <img className="imageListImage"  src={baseURL + 'images/' + img.src} alt={img.alt} />
                                        </div>
                                    );
                                    
                                })}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter style={{display: "flex", justifyContent: "space-between"}}>
                        <Button onClick={() => {this.toggleCategoryModal(); this.handleCategoryImagesSelectedChange()}} color="primary" className="mr-auto">Save</Button>
                        <Button onClick={() => this.toggleCategoryModal()} className="order-last">Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}