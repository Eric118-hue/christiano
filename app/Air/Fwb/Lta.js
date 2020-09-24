import React, {Component} from 'react';
import {Popup, PopupHeader, PopupBody} from '../../../vendor/bs/bootstrap';
import trans from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';

class Lta extends Component
{
  render() {
  return <React.Fragment>
    <PopupHeader>
      <h5>{trans('FWB Nº :n', {n:''})} {this.models('props.data.lta.customer.nsetup.lta.prefix')}-{this.models('props.data.lta.code')}</h5>
    </PopupHeader>
    <PopupBody>
      <div dangerouslySetInnerHTML={{__html:this.models('props.data.content')}}></div>
    </PopupBody>
  </React.Fragment>
  }
}

export default Modelizer(Lta);