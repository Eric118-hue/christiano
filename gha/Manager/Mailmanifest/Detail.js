import React, { Component } from 'react';
import trans from '../../translations';
import { PopupBody, PopupHeader } from '../../../vendor/bs/bootstrap';

class Detail extends Component
{
    render() {
        return <div>
            <PopupHeader>
                {trans('CARDIT')} {this.props.data.filename}
            </PopupHeader>
            <PopupBody>
                <div className="text-break" dangerouslySetInnerHTML={{__html:this.props.data.data}}></div>
            </PopupBody>
        </div>
            
    }
}

export default Detail;
