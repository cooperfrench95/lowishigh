import React, { Component } from 'react';
import YouTube from 'react-youtube';


class Portfolio extends Component {


    componentDidMount () {
        window.scrollTo(0, 0);
        if (this.props.homeHeaderInView === true) {
            this.props.toggleNavbarTitle(false);
            this.props.changeFirstLoadMarker(false);
        };
    }


    render () {

        
        const mappedProjects = this.props.projects.map((project, index) => {
            project.id = index;
            var count = 0;
            var project_description = project.data.description.map((item) => {
                count += 1
                return(
                    <p key={count}>{item}</p>
                )
            });
                return(
                    // return the element rendered from the json
                    <div key={project.id} className="row h-100 row-content align-items-center">
                        <div className="col-12 col-md-6 h-100" style={{height: "100%"}}>
                            <YouTube className="youtube" containerClassName="youtubeContainer"
                            videoId={project.data.youtube_link} />
                        </div>
                        <div className="col-12 col-md-6 portfoliotext">
                            <h2 className="makeSmallerForPhones">{project.data.title}</h2>
                            {project.data.time}
                            {project_description}
                        </div>
                    </div>
                )
            });

        return(
            <div className="container animated fadeIn">
                <div className="row row-content">
                    <div className="col-12">
                        <h1 className="gallery-heading text-center addtopmargin">Portfolio</h1>
                    </div>
                </div>
                {mappedProjects}
            </div>
        );
    }
}


export default Portfolio;