import React, { Component } from 'react';
import trans from 'ryapp/translations';
import { PopupBody, PopupHeader } from 'ryvendor/bs/bootstrap';

class Detail extends Component
{
    render() {
        return <div>
            <PopupHeader>
                {trans('PRECON')} {this.props.data.filename}
            </PopupHeader>
            <PopupBody>
                <div className="text-break" dangerouslySetInnerHTML={{__html:this.props.data.data}}></div>
            </PopupBody>
        </div>
            
    }
}

export default Detail;
