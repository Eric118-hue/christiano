import React, {Component} from 'react';
import UPUList from '../Upu/List';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import trans from '../translations';
import Ry from '../../vendor/Ry/Core/Ry';
import $ from 'jquery';
import {Popup, PopupHeader, PopupBody, PopupFooter} from '../../vendor/bs/bootstrap';

class List extends UPUList
{
    constructor(props) {
        super(props)
        this.detail = this.detail.bind(this)
    }

    detail(event, id) {
        event.preventDefault()
        $(`#detail-${id}`).modal('show')
    }

  item(row, key) {
    return <tr key={`list-${row.id}`}>
        <td>{row.code}</td>
        <td>{row.name12}</td>
        <td>{row.organisation_name12}</td>
        {this.props.editable?<React.Fragment>
            <td>{row.name35}</td>
            <td>{row.organisation_name35}</td>
            <td>{row.party_identifier}</td>
        </React.Fragment>:null}
        <td>{this.cast(row.airport, 'iata')}</td>
        <td dangerouslySetInnerHTML={{__html:row.complete_address}}></td>
        {this.props.editable?<td dangerouslySetInnerHTML={{__html:row.complete_contacts}}></td>:null}
        <td>{this.cast(row.currency, 'iso_code')}</td>
        {this.props.editable?<td><Ry/><a href={`#dialog/amd?id=${row.id}`} className="btn btn-info"><i className="fa fa-pencil-alt"></i></a></td>:<td><Ry/>
            <Popup id={`detail-${row.id}`}>
                <PopupHeader>
                    <h6>{row.name12}</h6>
                </PopupHeader>
                <PopupBody>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="control-label font-11">{trans('IMPC Code')}</label>
                                <div>{row.code}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('IMPC name (12 characters)')}</label>
                                <div>{row.name12}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('IMPC name (35 characters)')}</label>
                                <div>{row.name35}</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Party identifier')}</label>
                                <div>{row.party_identifier}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Organisation name (12 characters)')}</label>
                                <div>{row.organisation_name12}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Organisation name (35 characters)')}</label>
                                <div>{row.organisation_name35}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Adresse')}</label>
                                <div>{this.cast(row.adresse, 'raw')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Code Postal')}</label>
                                <div>{this.cast(row.adresse, 'ville.cp')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Pays')}</label>
                                <div>{this.cast(row.adresse, 'ville.country.nom')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Fax')}</label>
                                <div>{this.cast(row.contacts, 'bureau_fax.ndetail.value')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Aéroport')}</label>
                                <div>{this.cast(row.airport, 'iata')} {this.cast(row.airport, 'name')} {this.cast(row.airport, 'country.nom')}</div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Localité')}</label>
                                <div>{this.cast(row.adresse, 'ville.nom')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Etat / province')}</label>
                                <div>{this.cast(row.adresse, 'raw2')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Téléphone')}</label>
                                <div>{this.cast(row.contacts, 'bureau_phone.ndetail.value')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Devise')}</label>
                                <div>{this.cast(row.currency, 'iso_code')}</div>
                            </div>
                            <div className="form-group">
                                <label className="control-label font-11">{trans('Info comptable')}</label>
                                <div>{this.cast(row.nsetup, 'account.info')}</div>
                            </div>
                        </div>
                    </div>
                </PopupBody>
            </Popup>
            <a href="#" onClick={e=>this.detail(e, row.id)} className="btn btn-info"><i className="fa fa-search-plus"></i></a>    
        </td>}
    </tr>
  }

  beforelist() {
    return this.props.editable?<div>
      <a href="#dialog/amd" className="btn btn-primary"><i className="fa fa-plus"></i> {trans("Ajouter un AMD")}</a>
    </div>:null
  }

  render() {
    let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.props.data.total?'d-none':''}`}>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
        </li>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
        </li>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
        </li>
        <li className="list-inline-item">
            <a className={`btn btn-outline-primary ${this.state.page===this.props.data.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
        </li>
    </ul>

    return <div className="col-md-12">
        <div className="justify-content-between m-0 row">
            {this.beforelist()}
            {this.nopaginate?null:pagination}
        </div>
        {this.searchEngine()}
        <div className="card mt-3">
            <div className="card-header">
                {this.props.title}
            </div>
            <div className="card-body overflow-auto">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>{trans('IMPC code')}</th>
                            <th>{trans('IMPC name (12 characters)')}</th>
                            <th>{trans('Organisation name (12 characters)')}</th>
                            {this.props.editable?<React.Fragment>
                                <th>{trans('IMPC name (35 characters)')}</th>
                                <th>{trans('Organisation name (35 characters)')}</th>
                                <th>{trans('Party identifier')}</th>
                            </React.Fragment>:null}
                            <th>{trans('Airport IATA')}</th>
                            <th>{trans('Adresse')}</th>
                            {this.props.editable?<th>{trans('Contacts')}</th>:null}
                            <th>{trans('Devise')}</th>
                            <th></th>
                        </tr>
                        <tr className="bg-yellow">
                            <th>
                                <input type="search" value={this.models('state.tfilter.code', '')} onChange={e=>this.onTfilter(e, 'code')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                            </th>
                            <th>
                                <input type="search" value={this.models('state.tfilter.name12', '')} onChange={e=>this.onTfilter(e, 'name12')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                            </th>
                            <th>
                                <input type="search" value={this.models('state.tfilter.organisation_name12', '')} onChange={e=>this.onTfilter(e, 'organisation_name12')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                            </th>
                            {this.props.editable?<React.Fragment>
                                <th>
                                    <input type="search" value={this.models('state.tfilter.name35', '')} onChange={e=>this.onTfilter(e, 'name35')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.models('state.tfilter.organisation_name35', '')} onChange={e=>this.onTfilter(e, 'organisation_name35')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.models('state.tfilter.party_identifier', '')} onChange={e=>this.onTfilter(e, 'party_identifier')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                                </th>
                            </React.Fragment>:null}
                            <th>
                                <input type="search" value={this.models('state.tfilter.iata')} onChange={e=>this.onTfilter(e, 'iata')} className="form-control text-capitalize" placeholder={trans('Filtre')}/>
                            </th>
                            <th></th>
                            {this.props.editable?<th></th>:null}
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map((item, key)=>this.item(item, key))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="justify-content-between m-0 row">
            {this.afterlist()}
            {this.nopaginate?null:pagination}
        </div>
    </div>
  }
}

Modelizer(List)

class TheList extends Component
{
    render() {
        return <List data={this.props.data.data} title={this.props.data.title} headers={[
            "IMPC code",
            "IMPC name (12 characters)",
            "Organisation name (12 characters)",
            "IMPC name (35 characters)",
            "Organisation name (35 characters)",
            "Party identifier"
        ]} endpoint={'/amds'} store={this.props.store} type="amd" editable={this.props.data.editable}/>
    }
}

export default Modelizer(TheList);