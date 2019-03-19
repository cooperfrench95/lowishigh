import React, { Component } from 'react';
import { init } from 'pell';

import 'pell/dist/pell.css'


export default class Editor extends Component {
    
    editor = null

    componentDidMount () {
        this.editor = init({
        element: this.container,
        onChange: html => this.props.onChange(html),
        actions: this.props.actions
        })

        this.container.content.innerHTML = this.props.defaultContent;
    }

    componentDidUpdate() {
        if (this.container.content.innerHTML !== this.props.defaultContent) {
          this.container.content.innerHTML = this.props.defaultContent
        }
    }

    render() {



        return (
            <div style={{border: this.props.valid === undefined ? "none" : (this.props.valid ? "1px solid #28a745" : "1px solid #dc3545" ) }}
            ref={e => this.container = e} className="pell"/>
        );
    }
}
