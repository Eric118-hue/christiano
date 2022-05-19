import React, {Component} from 'react';
import {Popup, PopupHeader, PopupBody} from '../../../vendor/bs/bootstrap';
import trans from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import numeral from 'numeral';

class Ffr extends Component
{
  render() {
  return <React.Fragment>
    <PopupHeader>
      <h5>{trans('FFR Nº :n', {n:''})} {numeral(this.models('props.data.lta.customer_company.nsetup.lta.prefix')).format("000")}-{this.models('props.data.lta.code')}</h5>
    </PopupHeader>
    <PopupBody>
      <div dangerouslySetInnerHTML={{__html:this.models('props.data.content')}}></div>
    </PopupBody>
  </React.Fragment>
  }
}

export default Modelizer(Ffr);