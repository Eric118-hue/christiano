import React, { Component } from 'react';
import { PopupBody, PopupHeader } from '../../vendor/bs/bootstrap';

class File extends Component
{
    render() {
        return <div>
            <PopupHeader>
                {this.props.data.title}
            </PopupHeader>
            <PopupBody>
                <div className="text-break" dangerouslySetInnerHTML={{__html:this.props.data.data}}></div>
            </PopupBody>
        </div>
            
    }
}

export default File;
