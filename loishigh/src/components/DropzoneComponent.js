import React from 'react';
import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';
import { baseURL } from '../shared/baseURL';
import Markdown from 'markdown-to-jsx';
import { Form, Button, FormText } from 'reactstrap';

export default class DragAndDrop extends React.Component {

    constructor(props) {
        super(props)

        this.setValid = this.setValid.bind(this);
        this.renderImageFromImages = this.renderImageFromImages.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.alterImageList = this.alterImageList.bind(this);
        this.alterTextList = this.alterTextList.bind(this);
        this.ImageListToTextList = this.ImageListToTextList.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.state = {
            imagesList: this.props.draft.data.content.filter(i => i.type === 'img'),
            textList: this.props.draft.data.content.filter(i => i.type !== 'img'),
            valid: false
        }
    }

    alterImageList (result) {
        var stateCopy = this.state.imagesList.slice(0); // Get a copy of the state
        stateCopy.splice(result.source.index, 1);
        stateCopy.splice(result.destination.index, 0, this.state.imagesList.splice(result.source.index, 1)[0])
        return stateCopy;
    }

    alterTextList (result) {
        var stateCopy = this.state.textList.slice(0); // Get a copy of the state
        stateCopy.splice(result.source.index, 1);
        stateCopy.splice(result.destination.index, 0, this.state.textList.splice(result.source.index, 1)[0])
        return stateCopy;
    }

    ImageListToTextList (result) {
        var stateCopy = this.state.imagesList.slice(0);
        var imageToMove = stateCopy.splice(result.source.index, 1)[0];
        stateCopy = this.state.textList.slice(0);
        stateCopy.splice(result.destination.index, 0, imageToMove);
        return stateCopy;
    }

    TextListToImageList (result) {
        var stateCopy = this.state.textList.slice(0);
        var imageToMove = stateCopy.splice(result.source.index, 1)[0];
        stateCopy = this.state.imagesList.slice(0);
        stateCopy.splice(result.destination.index, 0, imageToMove);
        return stateCopy;
    }


    setValid () {
        this.setState({ valid: true });
        return
    }

    async onDragEnd (result) {
        if (!result.destination) {
            return;
        }
        else if (result.destination.droppableId === result.source.droppableId && result.destination.index === result.source.index) {
            return;
        }
        else if (result.destination.droppableId === result.source.droppableId && result.destination.index !== result.source.index) {
            if (result.source.droppableId === 'imageDroppable') {
                var newState = this.alterImageList(result);
                await this.setState({ imagesList: newState });
            }
            else if (result.source.droppableId === 'textDroppable') {
                newState = this.alterTextList(result);
                await this.setState({ textList: newState });
            }
        }
        else if (result.source.droppableId === 'imageDroppable' && result.destination.droppableId === 'textDroppable') {
            // Image moved into text list
            var newTextState = this.ImageListToTextList(result);
            var newImagesState = this.state.imagesList.slice(0);
            newImagesState.splice(result.source.index, 1);
            await this.setState({ textList: newTextState, imagesList: newImagesState })
        }
        else if (result.source.droppableId === 'textDroppable' && result.destination.droppableId === 'imageDroppable') {
            // Image moved back into image list
            newImagesState = this.TextListToImageList(result);
            newTextState = this.state.textList.slice(0);
            newTextState.splice(result.source.index, 1);
            await this.setState({ textList: newTextState, imagesList: newImagesState })
        }
        if (this.state.textList.length === this.props.draft.data.content.length) {
            this.setValid();
        }
    }

    renderImageFromImages (image, index) {
        for (let i = 0; i < this.props.images.images.length; i++) {
            let current_image = this.props.images.images[i];
            if (current_image.src === image) {
                return <img key={index} className="img-fluid blog_image" src={baseURL + 'images/' + image} alt={current_image.alt}/>
            } 
        }
    }

    componentDidMount () {
        window.scrollTo(0, 0);
    }

    resetState () {
        this.setState({
            imagesList: this.props.draft.data.content.filter(i => i.type === 'img'),
            textList: this.props.draft.data.content.filter(i => i.type !== 'img'),
            valid: false
        })
    }

    onFormSubmit (event) {
        event.preventDefault();
        if (this.state.valid === true) {
           
            // Send out redux form, redirect to results component
            var blogpostToSave = { ...this.props.draft };
            blogpostToSave.data.content = this.state.textList;
            this.props.uploadSomething(blogpostToSave, 'blogpost', this.props.auth.token);
            this.props.history.push('/result/uploadblogpost');
        }
    }
    // Check for replies on react-beautiful-dnd post. Add title, formatting, clean up especially on mobile.
    render() {
        if (this.props.draft.data.title_photo !== undefined) {
            var title_photo = this.renderImageFromImages(this.props.draft.data.title_photo);
        }
        if (this.props.draft.data.comments.length !== 0) {
            var comments = <React.Fragment><h2>Comments</h2><div>{this.props.draft.data.comments.map((comment, index) => {
                return(
                    <React.Fragment key={index}>
                        <p><em>{comment.author + ', ' + comment.date.slice(0, 9) + ":"}</em></p>
                        <p>{comment.content}</p>
                    </React.Fragment>  
                );    
                })
        } <div style={{borderBottom: "2px solid black", marginTop: "20px", marginBottom: "20px"}}></div></div></React.Fragment>
        }
        else {
            comments = <div></div> 
        }

        return(
            // Change the sizing
            <DragDropContext onDragEnd={this.onDragEnd}>
            <Form onSubmit={(event) => this.onFormSubmit(event)}>
                <div style={{marginBottom: "20px", paddingBottom: "20px"}}>
                    <h2 style={{fontSize: '24pt'}}>Preview</h2>
                    <FormText>Rearrange the images in your new post.</FormText>
                </div>
                <div className="row">
                        <div className="col-3 emboss backgroundColorFloralWhite previewWindow" style={{height: "60vh", overflow: "scroll", padding: "5px"}}>
                            <Droppable droppableId={'imageDroppable'}>
                                {(provided, snapshot) => {
                                    return(
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                        >   
                                            {this.state.imagesList.map((item, index) => {

                                                    return(
                                                        <Draggable draggableId={(index + 10000).toString()} index={index} key={index + 20000}>
                                                        {(provided, snapshot) => {
                                                            provided.draggableProps.style = {   backgroundColor: "white", 
                                                                                                border: snapshot.isDragging ? "1px solid blue" : "1px solid lightgrey",
                                                                                                height: "10vh",
                                                                                                borderRadius: "10px",
                                                                                                padding: "10px",
                                                                                                ...provided.draggableProps.style};
                                                            return  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                                        <img className="img-fluid" style={{ height: "100%", position: "relative", left: "50%", transform: "translate(-50%)"}} src={baseURL + 'images/' + item.image} alt={item.image.slice(0, -4)}></img>
                                                                    </div>
                                                        }
                                                        }
                                                        </Draggable>
                                                    );
                                                }
                                            )
                                            
                                            }
                                        
                                            {provided.placeholder}

                                        </div>
                                    );
                                }}
                            </Droppable> 
                            </div>
                            <div className="col-9 emboss backgroundColorFloralWhite previewWindow" style={{height: "60vh", overflow: "scroll"}}>
                                <React.Fragment>
                                    <div className="row">
                                        
                                        <div className="col-12">
                                            <h2 className="adjust-for-nav adjustSizePreviewHeading" style={{textAlign: "center"}}>{this.props.draft.data.title}</h2>
                                        </div>
                                        
                                        <div className="col-12">
                                            <h3 style={{textAlign: "center"}}>{this.props.draft.data.date + " by " + this.props.auth.username}</h3>
                                        </div>
                                        <div className="col-12">
                                            {title_photo}
                                        </div>
                                        <div className="col-12">
                                            <Droppable droppableId={'textDroppable'}>
                                                    {(provided, snapshot) => {
                                                        return(
                                                            <div 
                                                                ref={provided.innerRef}
                                                                {...provided.droppableProps}
                                                            >   
                                                                {this.state.textList.map((item, index) => {

                                                                        if (item.type === 'img') {
                                                                            return(
                                                                                <Draggable draggableId={(index + 30000).toString()} index={index} key={index + 40000}>
                                                                                {(provided, snapshot) => {
                                                                                    return  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                                                                {this.renderImageFromImages(item.image, index)}
                                                                                            </div>
                                                                                }
                                                                                }
                                                                                </Draggable>
                                                                            );
                                                                        }

                                                                        else if (item.type !== 'img') {
                                                                            return(
                                                                                <Draggable isDragDisabled={true} draggableId={(index + 50000).toString()} index={index} key={index + 60000}>
                                                                                {(provided, snapshot) => {
                                                                                    switch (item.type) {
                                                                                        case 'p':
                                                                                            return(
                                                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                                                                    <p className="adjustTextPreview" key={index}>{item.content}</p>
                                                                                                </div>
                                                                                            );
                                                                                        case 'pell':
                                                                                            return(
                                                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                                                                    <p><Markdown className="adjustTextPreview" key={index}>{item.content}</Markdown></p>
                                                                                                </div>
                                                                                            );
                                                                                        case 'em':
                                                                                            return(
                                                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                                                                    <p key={index} className="adjustTextPreview"><em>{item.content}</em></p>
                                                                                                </div>
                                                                                            );
                                                                                        case 'strong':
                                                                                            return(
                                                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                                                                                                    <p key={index} className="adjustTextPreview"><strong>{item.content}</strong></p>
                                                                                                </div>
                                                                                            )
                                                                                        default:
                                                                                            return null
                                                                                }}}
                                                                                </Draggable>
                                                                            );
                                                                        }
                                                                        else {
                                                                            return Error('Problem with item content type');
                                                                        }
                                                                    }
                                                                )
                                                                
                                                                }
                                                            
                                                                {provided.placeholder}

                                                            </div>
                                                        );
                                                    }}
                                                </Droppable> 
                                            <div style={{borderBottom: "2px solid black", marginTop: "20px", marginBottom: "20px"}}></div>
                                        </div>
                                        <div className="col-12">
                                            {comments}
                                        </div>
                                    </div>
                            </React.Fragment>
                                
                             </div>
                        
                   
                    
                </div>  
                <div className="row" style={{justifyContent: "space-between", padding: "20px"}}>
                    <Button className="editorButton order-last" style={{backgroundColor: "green"}} type="submit">Post</Button>
                    <Button className="editorButton" onClick={() => this.resetState()}>Reset</Button>
                    <Button className="editorButton order-first" onClick={() => this.props.changeView('posteditor', 'post', this.props.draft)}>Back</Button>
                </div> 
            </Form>
            </DragDropContext>

        );
    }
}
