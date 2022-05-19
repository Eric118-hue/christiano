import React, {Component} from 'react';
import {Popup, PopupHeader, PopupBody} from '../../../vendor/bs/bootstrap';
import trans from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';

class Lta extends Component
{
  render() {
  return <React.Fragment>
    <PopupHeader>
      <h5>{trans('FHL')}</h5>
    </PopupHeader>
    <PopupBody>
      <div dangerouslySetInnerHTML={{__html:this.models('props.data.content')}}></div>
    </PopupBody>
  </React.Fragment>
  }
}

export default Modelizer(Lta);