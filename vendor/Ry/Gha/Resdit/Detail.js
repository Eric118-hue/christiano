import React, { Component } from 'react';
import trans from '../../../../app/translations';
import { PopupBody, PopupHeader } from '../../../bs/bootstrap';

class Detail extends Component
{
    render() {
        let title = this.props.data.consignment_event_code
        if(this.props.data.consignment_event_code!='reception') {
            title = this.props.data.consignment_event_code + ' - Contenu du fichier ' + this.props.data.filename
        }
        return <div>
            <PopupHeader>
                {trans('RESDIT')} {title}
            </PopupHeader>
            <PopupBody>
                <div className="text-break" dangerouslySetInnerHTML={{__html:this.props.data.data}}></div>
            </PopupBody>
        </div>
            
    }
}

export default Detail;