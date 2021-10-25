import React, {Component} from 'react';
import {Popup, PopupHeader, PopupBody} from '../../../vendor/bs/bootstrap';
import trans from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import numeral from 'numeral';

class Lta extends Component
{
  render() {
  return <React.Fragment>
    <PopupHeader>
      <h5>{trans('FWB Nº :n', {n:''})} {numeral(this.models('props.data.lta.company.company.prefix')).format("000")}-{this.models('props.data.lta.code')}</h5>
    </PopupHeader>
    <PopupBody>
      <div dangerouslySetInnerHTML={{__html:this.models('props.data.content')}}></div>
    </PopupBody>
  </React.Fragment>
  }
}

export default Modelizer(Lta);