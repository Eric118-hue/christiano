import React, { Component } from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import {PopupHeader, PopupBody, PopupFooter} from 'ryvendor/bs/bootstrap';
import { lab } from 'd3';

class Form extends Component
{
  render() {
    return <form action={`/dsv_post_office`} method="post" name="frm_post_office">
      <input type="hidden" name="id" value={this.models('props.data.row.id', '')}/>
      <PopupHeader>{this.models('props.data.row.id', false)?trans('Modifier :name', {name:this.models('props.data.row.name', '')}):trans('Ajouter un nouvel adresse')}</PopupHeader>
      <PopupBody>
        <div className="form-group">
          <label className="control-label">{trans('PRECON')}</label>
          <input type="text" name="precon" className="form-control" defaultValue={this.models('props.data.row.precon', '')} required/>
        </div>
        <div className="form-group">
          <label className="control-label">{trans('CARDIT')}</label>
          <input type="text" name="cardit" className="form-control" defaultValue={this.models('props.data.row.cardit', '')} required/>
        </div>
        <div className="form-group">
          <label className="control-label">{trans('IFTMIN')}</label>
          <input type="text" name="iftmin" className="form-control" defaultValue={this.models('props.data.row.iftmin', '')} required/>
        </div>
        <div className="form-group">
          <label className="control-label">{trans('Nom')}</label>
          <input type="text" name="name" className="form-control" defaultValue={this.models('props.data.row.name', '')} required/>
        </div>
        <div className="form-group">
          <label className="control-label">{trans('Adresse')}</label>
          <input type="text" name="adresse[raw]" className="form-control" defaultValue={this.models('props.data.row.adresse.raw')} required/>
        </div>
        <div className="form-group">
          <label className="control-label">{trans('Ville')}</label>
          <input type="text" name="adresse[ville][nom]" className="form-control" defaultValue={this.models('props.data.row.adresse.ville.nom')} required/>
        </div>
        <div className="form-group">
          <label className="control-label">{trans('CP')}</label>
          <input type="text" name="adresse[ville][cp]" className="form-control" defaultValue={this.models('props.data.row.adresse.ville.cp')} required/>
        </div>
        <div className="form-group">
          <label className="control-label">{trans('Pays')}</label>
          <select className="form-control" name="adresse[ville][country][id]" defaultValue={this.models('props.data.row.adresse.ville.country.id')}>
            {this.props.data.countries.map(country=><option key={country.id} value={country.id}>{country.nom}</option>)}
          </select>
        </div>
      </PopupBody>
      <PopupFooter>
        <button className="btn btn-primary">{trans('Enregistrer')}</button>
      </PopupFooter>
    </form>
  }
}

export default Modelizer(Form);