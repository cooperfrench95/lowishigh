import React from 'react';
import { FormGroup, Button, Form, InputGroup, InputGroupAddon, Modal, ModalBody, ModalHeader, ModalFooter,
         FormFeedback, FormText, Col, Row, Input, Label, InputGroupButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';
import { baseURL } from '../shared/baseURL';
import MyEditor from './PellEditorComponent';


export default class PostEditor extends React.Component {

    constructor(props) {
        super(props);

        this.toggleModal2 = this.toggleModal2.bind(this);
        this.handleTextEditorChange = this.handleTextEditorChange.bind(this);
        this.toggleDropDown = this.toggleDropDown.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.fileValidator = this.fileValidator.bind(this);
        this.fileInput = React.createRef();
        this.blogpostCategoryRef = React.createRef();
        this.state = {
            project: {
                description: undefined,
                title: undefined, 
                season: undefined, 
                year: undefined, 
                youtube_link: undefined, 
                valid_description: undefined,
                valid_title: undefined,
                valid_season: undefined,
                valid_year: undefined,
                valid_youtube_link: undefined
            },
            blogpost: {
                title: undefined,
                title_photo: undefined,
                categories: [],
                content: undefined,
                valid_title: undefined,
                valid_title_photo: undefined,
                valid_categories: undefined,
                valid_content: undefined,
                unedited: undefined
            },
            image: {
                files: [],
                valid_files: undefined
            },
            isOpen: false,
            dropdownIsOpen: false,
            selectedImage: undefined,
            selectedImages: [],
            current_text: '',
            selectedGalleryImages: this.props.galleryState.gallery
        };
    }

    componentDidMount () {
        if (this.props.object) {
            switch(this.props.thingToEdit) {
                case 'project':
                    this.setState({ ...this.state, project: { ...this.state.project,
                        description: this.props.object.data.description.join('\n'),
                        title: this.props.object.data.title,
                        season: this.props.object.data.time.split(', ')[0],
                        year: this.props.object.data.time.split(', ')[1],
                        youtube_link: 'https://www.youtube.com/watch?v=' + this.props.object.data.youtube_link,
                        valid_description: true,
                        valid_title: true,
                        valid_season: true,
                        valid_year: true,
                        valid_youtube_link: true
                    }});
                    break
                case 'post':
                    this.setState({ ...this.state, blogpost: { ...this.state.blogpost,
                        title: this.props.object.data.title,
                        title_photo: undefined,
                        categories: this.props.object.data.categories,
                        content: this.props.object.data.content.filter((e) => e.type !== 'img'),
                        valid_title: true,
                        valid_title_photo: true,
                        valid_categories: true,
                        valid_content: true,
                        unedited: true                               
                        }, selectedImage: this.props.images.images.filter(e => e.src === this.props.object.data.title_photo)[0],
                        // eslint-disable-next-line array-callback-return
                        current_text:   this.props.object.data.content.map((content, index) => {
                                            if (content.content) {
                                                return "<div><p>" + content.content + "</p></div>"
                                            }
                                        }).join(''),
                        selectedImages: this.props.object.data.content.filter((e) => e.type === 'img').map((img) => {
                            return this.props.images.images.filter(i => i.src === img.image)[0]
                        })
                    });
                    break
                default:
                    break
            }
        }
    }

    async handleTextEditorChange (html) {
        var htmlArray = [...new DOMParser().parseFromString(html, 'text/html').body.children].map((item, index) => {
            return item.innerHTML;
        });
        if (html.length > 0 && html.length < 10000) {
            this.setState({...this.state, blogpost: {...this.state.blogpost, valid_content: true, content: htmlArray, unedited: false }, current_text: html });
        }
        else {
            this.setState({...this.state, blogpost: {...this.state.blogpost, valid_content: false, content: htmlArray, unedited: false }, current_text: html });
        }
    }

    async fileValidator (event) {
        event.preventDefault();
        var filesArray = []
        for (let i = 0; i < this.fileInput.current.files.length; i++) {
            if (this.fileInput.current.files[i].name.match(/\.(jpg|jpeg|png)$/) && this.fileInput.current.files[i].size <= 20000000) {
                await this.setState({ image: { valid_files: true }});
                filesArray.push({ file: this.fileInput.current.files[i], name: this.fileInput.current.files[i].name });
            }
            else {
                await this.setState({ image: { valid_files: false }})
                break
            }
        }
        console.log(filesArray);
        if (this.state.image.valid_files === true) {
            await this.setState({ image: { ...this.state.image, files: filesArray }});
        }
    }

    toggleModal () {
        this.setState({isOpen: !this.state.isOpen });
    }

    toggleModal2 () {
        this.setState({isOpen2: !this.state.isOpen2 });
    }

    toggleDropDown () {
        this.setState({ dropdownIsOpen: !this.state.dropdownIsOpen});
    }

    onFormSubmit (event, type) {
        event.preventDefault();
        switch (type) {
            case 'images': 
                if (this.state.image.valid_files === true) {
                    this.props.uploadSomething(this.state.image.files, 'images', this.props.auth.token);
                }
                this.props.history.push('/result/upload' + type);
                break
            case 'project': 
                if (this.state.project.valid_youtube_link === true &&
                    this.state.project.valid_description === true &&
                    this.state.project.valid_title === true &&
                    this.state.project.valid_season === true &&
                    this.state.project.valid_year === true) {

                        // Turn the form data into the proper object structure for the project schema 
                        var projectData = { data: {}};
                        projectData.data.description = this.state.project.description.trim().split('\n').filter((value) => value !== "");
                        projectData.data.time = this.state.project.season + ', ' + this.state.project.year;
                        projectData.data.title = this.state.project.title;
                        projectData.data.youtube_link = this.state.project.youtube_link.slice(-11);
                        console.log(projectData);
                        
                        // call the redux action with the 'project' type
                        this.props.uploadSomething(projectData, type, this.props.auth.token);
                    }
                this.props.history.push('/result/upload' + type);
                break
            case 'blogpost': 
                
                if (this.state.blogpost.valid_title === true &&
                    this.state.blogpost.categories.length !== 0 &&
                    this.state.blogpost.valid_content === true
                    ) {
                        // Turn the form data into the proper object structure for the blogpost schema
                        var draftBlogpost = { data: {} };
                        draftBlogpost.data.title = this.state.blogpost.title;
                        if (this.props.object && this.props.object.data.title_photo) {
                            draftBlogpost.data.title_photo = this.props.object.data.title_photo;
                        }
                        else if (this.state.blogpost.title_photo) {
                            draftBlogpost.data.title_photo = this.state.selectedImage.src;
                        }
                        draftBlogpost.data.categories = this.state.blogpost.categories;
                        draftBlogpost.data.content = this.state.blogpost.content.map((item, index) => {
                            if (this.props.object && this.state.blogpost.unedited) {
                                item = { type: item.type, content: item.content }
                                return item;
                            }
                            else {
                                item = { type: "pell", content: item };
                                return item;
                            }
                        });
                        var imagesConverted = this.state.selectedImages.map((img, index) => {
                            img = { type: "img", image: img.src }
                            return img;
                        })
                        draftBlogpost.data.content = draftBlogpost.data.content.concat(imagesConverted);
                        draftBlogpost.name = this.state.blogpost.title
                        if (this.props.object) {
                            draftBlogpost.data.comments = this.props.object.data.comments;
                        }
                        else {
                            draftBlogpost.data.comments = [];
                        }
                        if (!this.props.object) {
                            let date = new Date();
                            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            draftBlogpost.data.date =  months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
                        }
                        else {
                            draftBlogpost.data.date = this.props.object.data.date
                        }

                        // call the changeview action, passing in the appropriate props
                        this.props.changeView('posteditor preview', draftBlogpost);
                        // TODO: also call a redux action to save drafts
                }
                break
            default:
                throw new Error('That type does not exist');
        }
    }

    render() {
        switch (this.props.thingToEdit) {
            case 'image':
                return (
                        <Form onSubmit={(event) => this.onFormSubmit(event, 'images')}>
                            <div style={{paddingBottom: "20px"}}>
                                <h2 style={{fontSize: '24pt'}}>Upload Images</h2>
                            </div>
                                <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                    <Label style={{ fontSize: "18pt", width: "50px"}} className="fa fa-cloud-upload"/>
                                    <Input multiple type="file" id="image_file" innerRef={this.fileInput} onInput={this.fileValidator}
                                        valid={this.state.image.valid_files === true} 
                                        invalid={this.state.image.valid_files === false}
                                        />
                                    <FormFeedback>Acceptable image formats: .jpeg, .jpg, .png. Filenames cannot contain special characters.</FormFeedback>
                                    <FormFeedback valid>Your files are good to go!</FormFeedback>
                                </FormGroup>
                            <Button className="editorButton" type="submit">Upload</Button>
                        </Form>
                );
            case 'project':
                return(
                    <Form onSubmit={(event) => this.onFormSubmit(event, 'project')}>
                        <div style={{paddingBottom: "20px"}}>
                            <h2 style={{fontSize: '24pt'}}>{this.props.object ? 'Edit' : 'New'} Project</h2>
                        </div>
                            <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                <h3 style={{marginBottom: "10px"}}>Title</h3>
                                <Input defaultValue={this.state.project.title} type="text" id="title" placeholder="Title" onChange={(event) => {
                                        if (event.target.value.length > 0 && 
                                            event.target.value.length < 100) {
                                                this.setState({ ...this.state, project: { ...this.state.project, valid_title: true, title: event.target.value }});
                                        }
                                        else {
                                            this.setState({ ...this.state, project: { ...this.state.project, valid_title: false, title: event.target.value }});
                                        }
                                        }}
                                        valid={this.state.project.valid_title === true} 
                                        invalid={this.state.project.valid_title === false}
                                        />
                                <FormFeedback valid />
                                <FormFeedback>{"Please enter a title. Limit: 100 characters."}</FormFeedback>
                            </FormGroup>
                            <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                <h3 style={{marginBottom: "10px"}} >Youtube Link</h3>
                                <Input defaultValue={this.state.project.youtube_link} type="url" id="youtube_link" placeholder="https://www.youtube.com/watch?v=6rPVYhBW6Fc" onChange={(event) => {
                                        if (event.target.value.length > 3 && 
                                            event.target.value.length < 50 &&
                                            event.target.value.match(/https:\/\/www.youtube.com\//)) {
                                                this.setState({ ...this.state, project: { ...this.state.project, valid_youtube_link: true, youtube_link: event.target.value }});
                                        }
                                        else {
                                            this.setState({ ...this.state, project: { ...this.state.project, valid_youtube_link: false, youtube_link: event.target.value }});
                                        }
                                        }}
                                        valid={this.state.project.valid_youtube_link === true} 
                                        invalid={this.state.project.valid_youtube_link === false}
                                        />
                                <FormFeedback valid />
                                <FormFeedback>{"Please make sure your link is a youtube link in the format: https://www.youtube.com/watch?v=videoID (no channel/playlist ID or anything else)"}</FormFeedback>
                            </FormGroup>
                            <Row form>
                                <Col md={6}>
                                    <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                        <h3 style={{marginBottom: "10px"}}>Season</h3>
                                        <Input value={this.state.project.season} type="select" id="season" onChange={(event) => {
                                                if (event.target.value !== undefined) {
                                                    this.setState({ ...this.state, project: { ...this.state.project, season: event.target.value, valid_season: true }});
                                                } 
                                                else {
                                                    this.setState({ ...this.state, project: { ...this.state.project, season: event.target.value, valid_season: false }});
                                                }
                                                }}
                                                valid={this.state.project.valid_season === true} 
                                                invalid={this.state.project.valid_season === false}
                                                >
                                            <option value="Summer">Summer</option>
                                            <option value="Autumn">Autumn</option>
                                            <option value="Winter">Winter</option>
                                            <option value="Spring">Spring</option>
                                        </Input>
                                    
                                        <FormFeedback valid />
                                        <FormFeedback>{"Please select a season."}</FormFeedback>

                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                        <h3 style={{marginBottom: "10px"}}>Year</h3>
                                        <Input value={this.state.project.year} type="select" id="year" onChange={(event) => {
                                                if (event.target.value !== undefined) {
                                                    this.setState({ ...this.state, project: { ...this.state.project, year: event.target.value, valid_year: true }});
                                                } 
                                                else {
                                                    this.setState({ ...this.state, project: { ...this.state.project, year: event.target.value, valid_year: false }});
                                                }
                                                }}
                                                valid={this.state.project.valid_year === true} 
                                                invalid={this.state.project.valid_year === false}
                                                >
                                            <option value="2024">2024</option>
                                            <option value="2023/24">2023/24</option>
                                            <option value="2023">2023</option>
                                            <option value="2022/23">2022/23</option>
                                            <option value="2022">2022</option>
                                            <option value="2021/22">2021/22</option>
                                            <option value="2021">2021</option>
                                            <option value="2020/21">2020/21</option>
                                            <option value="2020">2020</option>
                                            <option value="2019/20">2019/20</option>
                                            <option value="2019">2019</option>
                                            <option value="2018/19">2018/19</option>
                                            <option value="2018">2018</option>
                                            <option value="2017/18">2017/18</option>
                                            <option value="2017">2017</option>
                                        </Input>
                                        <FormFeedback valid />
                                        <FormFeedback>{"Please select a year."}</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>
                            
                            <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                    <h3 style={{marginBottom: "10px"}}>Description</h3>
                                    <Input value={this.state.project.description} type="textarea" rows={10} id="description" placeholder="Description (e.g. cast, crew)" onChange={(event) => {
                                            if (event.target.value.length < 1000 && event.target.value.length > 0) {
                                                this.setState({ ...this.state, project: { ...this.state.project, valid_description: true, description: event.target.value }});
                                            } 
                                            else {
                                                this.setState({ ...this.state, project: { ...this.state.project, valid_description: false, description: event.target.value }});
                                            }
                                            }}
                                            valid={this.state.project.valid_description === true} 
                                            invalid={this.state.project.valid_description === false}
                                            />
                                <FormFeedback valid />
                                <FormFeedback>{"Max. 1000 characters."}</FormFeedback>
                            </FormGroup>
                        <Button className="editorButton" type="submit">Submit</Button>
                    </Form>
                );
            case 'post':
                // Generate the list of existing categories for the category button dropdown
                var category_list = [];
                this.props.blogposts.blogposts.map((post) => {
                    for (let i = 0; i < post.data.categories.length; i++) {
                        if (!category_list.includes(post.data.categories[i])) {
                            category_list.push(post.data.categories[i])
                        }
                    }
                    return null
                })
                const existing_categories = category_list.map((category, index) => {
                    return(
                        <DropdownItem style={{cursor: "pointer"}} key={index} onClick={() => {
                            this.blogpostCategoryRef.current.value = category;
                            if (!this.state.blogpost.categories.includes(category)) {
                                this.setState({...this.state, blogpost: {...this.state.blogpost, valid_categories: true}})
                            }
                            else {
                                this.setState({...this.state, blogpost: {...this.state.blogpost, valid_categories: false}})
                            }
                        }
                        }>{category}</DropdownItem>
                    );
                });   
                const renderSelectedImages = this.state.selectedImages.length === 0 || !this.state.selectedImages ? <span>No images selected</span>
                                                                                                                  : this.state.selectedImages.map((img, index) => { 
                                                                                                                        return  <div key={index} className="imageListDiv col-3" style={{margin: "2px"}}>
                                                                                                                                    <img className="imageListImage" src={baseURL + 'images/' + img.src} alt={img.alt} />
                                                                                                                                </div>
                                                                                                                    });                                      
                return(
                                <Form onSubmit={(event) => this.onFormSubmit(event, 'blogpost')}>
                                    <div style={{marginBottom: "20px", paddingBottom: "20px"}}>
                                        <h2 style={{fontSize: '24pt'}}>{this.props.object ? 'Edit' : 'New'} Blogpost</h2>
                                        <FormText>If you want to include images in your post, please upload them first via the 'images' tab under '<span className="fa fa-pencil"/>Posts'.</FormText>
                                    </div>
                                        <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                            <h3 style={{marginBottom: "10px"}}>Title</h3>
                                            <Input defaultValue={this.state.blogpost.title} type="text" id="post_title" placeholder="Title" onChange={(event) => {
                                                    if (event.target.value.length > 0 && 
                                                        event.target.value.length < 100) {
                                                            this.setState({ ...this.state, blogpost: { ...this.state.blogpost, valid_title: true, title: event.target.value }});
                                                    }
                                                    else {
                                                        this.setState({ ...this.state, blogpost: { ...this.state.blogpost, valid_title: false, title: event.target.value }});
                                                    }
                                                    }}
                                                    valid={this.state.blogpost.valid_title === true} 
                                                    invalid={this.state.blogpost.valid_title === false}
                                                    />
                                            <FormFeedback valid />
                                            <FormFeedback>{"Please enter a title. Limit: 100 characters."}</FormFeedback>
                                        </FormGroup>
                                        <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                                <div style={{justifyContent: "space-between", display: "flex"}}>
                                                    <span style={{marginBottom: "0px", marginTop: "3px", fontSize: "14pt", color: "#353535", fontFamily: "Playfair Display, serif", letterSpacing: "-0.03em", fontWeight: "1000"}} >Title Photo </span>
                                                    <Button className="editorButton ml-auto" id="title_photo" onClick={this.toggleModal}>Select </Button>
                                                </div>
                                                {this.state.selectedImage !== undefined ?   <div className="imageListRowFlex" style={{marginTop: "10px", marginBottom: "20px", overflowX: "visible", height: "60vh"}}>
                                                                                                <div className="imageListDivFlex" style={{width: "100%", height: "100%"}}>
                                                                                                    <img className="imageListImageFlex" style={{height: "100%", width: "100%", overflow: "hidden"}}
                                                                                                src={baseURL + 'images/' + this.state.selectedImage.src} alt={this.state.selectedImage.alt} />
                                                                                                </div>
                                                                                            </div> 
                                                                                        :   <div></div>
                                                }
                                            <Modal className="myPhotoModal" isOpen={this.state.isOpen} toggle={this.toggleModal}>
                                                <ModalHeader>
                                                    Select Title Photo
                                                </ModalHeader>
                                                <ModalBody>
                                                    <div className="col-12" style={{ border: "1px solid grey", height: "70vh", overflow: "hidden", overflowY: "scroll"}}>
                                                        <div className="row">
                                                            {this.props.images.images.map((img, index) => {
                                                                return(
                                                                    <div onClick={() => {
                                                                        this.setState({ selectedImage: img });
                                                                    }} className="imageListDiv col-3" style={this.state.selectedImage === img ? {border: "4px solid blue"} : {}} key={index}>
                                                                        <img className="imageListImage" 
                                                                                src={baseURL + 'images/' + img.src} alt={img.alt} />
                                                                    </div>
                                                                );  
                                                            })}
                                                        </div>
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button onClick={() => this.toggleModal()} color="primary" className="editorButton mr-auto">Done</Button>
                                                </ModalFooter>
                                            </Modal>
                                        </FormGroup>
                                        <Row form>
                                            <Col xs={12}>
                                                <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                                    <h3 style={{marginBottom: "10px"}}>Add Categories</h3>
                                                    <InputGroup>
                                                    <InputGroupButtonDropdown addonType="prepend" isOpen={this.state.dropdownIsOpen} toggle={this.toggleDropDown}>
                                                        <DropdownToggle caret className="fontSizeAdjust">
                                                            {"Select "}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            {existing_categories}
                                                        </DropdownMenu>
                                                    </InputGroupButtonDropdown>
                                                    
                                                    <Input type="text" id="categories" placeholder="..or add new" innerRef={this.blogpostCategoryRef} onChange={(event) => {
                                                            if (event.target.value !== undefined && 
                                                                event.target.value.length < 15 &&
                                                                !this.state.blogpost.categories.includes(event.target.value)) {
                                                                this.setState({ ...this.state, blogpost: { ...this.state.blogpost, valid_categories: true }});
                                                            } 
                                                            else {
                                                                this.setState({ ...this.state, blogpost: { ...this.state.blogpost, valid_categories: false }});
                                                            }
                                                            }}
                                                            valid={this.state.blogpost.valid_categories === true} 
                                                            invalid={this.state.blogpost.valid_categories === false}
                                                            >
                                                    </Input>
                                                    
                                                    <InputGroupAddon addonType="append">
                                                        <Button className="editorButton" onClick={async () => {
                                                            if (this.state.blogpost.valid_categories) {
                                                                console.log(this.blogpostCategoryRef.current.value)
                                                                await this.setState({...this.state, blogpost: {...this.state.blogpost, 
                                                                    categories: [...this.state.blogpost.categories, 
                                                                    this.blogpostCategoryRef.current.value]}});
                                                                // Clear the value from the ref 
                                                                this.blogpostCategoryRef.current.value = '';
                                                            }
                                                            // Reset valid_categories
                                                            this.setState({ ...this.state, blogpost: {...this.state.blogpost, valid_categories: undefined}});
                                                        }}>
                                                            <span className="fa fa-plus-square"/>
                                                        </Button>
                                                    </InputGroupAddon>
                                                    <FormFeedback valid />
                                                    <FormFeedback>{"Categories can only be added once. Character limit: 15."}</FormFeedback>
                                                    </InputGroup>
                                                <Row style={{paddingTop: "20px"}}>
                                                    {this.state.blogpost.categories.map((category, index) => {
                                                        return(
                                                            <div className="col-12 col-md showSelectedCategories" key={index}>
                                                                <div className="showSelectedCategoriesInner">
                                                                    <span style={{cursor: "default"}}>{category + ' '} 
                                                                    
                                                                        <span style={{cursor: "pointer"}} onClick={() => {
                                                                            let newCategories = this.state.blogpost.categories.filter(i => i !== category);
                                                                            this.setState({ ...this.state, blogpost: { ...this.state.blogpost, categories: newCategories }});
                                                                        }} className="fa fa-close"/>

                                                                    </span>
                                                                    
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </Row>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite"> {/** Add: text(options for italic, bold)/image -> edit and press plus sign -> added into draggable area */}
                                                <h3 style={{marginBottom: "10px"}}>Add Content</h3>
                                                
                                                <MyEditor valid={this.state.blogpost.valid_content}
                                                defaultContent={this.state.current_text}
                                                onChange={this.handleTextEditorChange} actions={['bold', 'italic', 'link', 'heading1', 'heading2', 'olist', 'ulist']}>
                                                </MyEditor>
                                                {/** Create the react-beautiful-dnd thing. Divide this.current_text into divs using a html parser, and use Markdown to preview them
                                                    then you're fucking golden cunt */}
                                            <div className="invalid-feedback" style={{display: this.state.blogpost.valid_content === true || this.state.blogpost.valid_content === undefined ? "none" : "block" }}>{"There is also a character limit, but if you've actually gone over it, I'm impressed. Add the text in pieces to get around it"}</div>
                                        </FormGroup>
                                        <FormGroup style={{border: "1px solid grey", padding: "10px"}} className="backgroundColorFloralWhite">
                                            <Row form className="align-items-center justify-content-center" style={{flexWrap: "nowrap"}}>
                                                    <h3 style={{marginBottom: "0px"}} className="col-auto text-center">Add Photos</h3>
                                                    <Button id="add_photo" className="editorButton order-first col-3 col-md-2" onClick={this.toggleModal2}><span className="fa fa-plus-square"/></Button>
                                                    <Button id="delete_photos" onClick={() => this.setState({ selectedImages: [] })} className="order-last col-3 editorButton col-md-2">Clear</Button>
                                            </Row>
                                            <Row form style={{justifyContent: "center", margin: "10px"}}>
                                                {renderSelectedImages}
                                            </Row>   
                                            <Modal isOpen={this.state.isOpen2} toggle={this.toggleModal2}>
                                                <ModalHeader>
                                                    Select Images
                                                </ModalHeader>
                                                <ModalBody>
                                                    <div className="col-12" style={{ border: "1px solid grey", height: "70vh", overflow: "hidden", overflowY: "scroll"}}>
                                                        <div className="row">
                                                            {this.props.images.images.map((img, index) => {
                                                                return(
                                                                    <div onClick={() => {
                                                                            let withoutImg = this.state.selectedImages.slice(0);
                                                                            withoutImg.splice(this.state.selectedImages.indexOf(img), 1);
                                                                            this.setState({ selectedImages: this.state.selectedImages.includes(img) ? withoutImg : [...this.state.selectedImages, img] });
                                                                        }} 
                                                                        className="imageListDiv col-3" 
                                                                        style={this.state.selectedImages.includes(img) ? {border: "4px solid blue"} : {}} 
                                                                        key={index}
                                                                    >
                                                                        <img className="imageListImage"  src={baseURL + 'images/' + img.src} alt={img.alt} />
                                                                    </div>
                                                                );  
                                                            })}
                                                        </div>
                                                    </div>
                                                </ModalBody>
                                                <ModalFooter>
                                                    <Button onClick={() => this.toggleModal2()} color="primary" className="mr-auto">Done</Button>
                                                </ModalFooter>
                                            </Modal>
                                        </FormGroup>
                                    <Button className="editorButton" type="submit">Next</Button>
                                </Form>
                );
            default:
                return(
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>Error</h2>
                            </div>
                        </div>
                    </div>
                );
    }
    }
}