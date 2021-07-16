import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import MultiForm from 'ryvendor/Ry/Admin/User/Multiform';
import trans from 'ryapp/translations';
import $ from 'jquery';
import swal from 'sweetalert2';
import Repository from '../Repository';
import {Mlds as MldVersions} from './Air';

class Land extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      tab : this.cast(this.models('props.data.row.companies', []).filter(it=>it.type=='land'), '0.id', 0),
      companies : this.models('props.data.row.companies', []).filter(it=>it.type=='land'),
      errors : [],
      errorMessages : [],
      oncevalidate : false,
    }
    this.removeContact = this.removeContact.bind(this)
    this.validate = this.validate.bind(this)
  }

  remove(company) {
	swal({
        title: trans('Confirmez-vous la suppression de cette compagnie?'),
        text: trans('Cet compagnie sera supprimée définitivement'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: trans('Oui je confirme')
    }).then((result) => {
        if (result.value) {
            if(company.id>0) {
                $.ajax({
                    url : trans('/customer_company'),
                    type : 'delete',
                    data : {
                        id : company.id
                    },
                    success : ()=>{
						this.setState(state=>{
							state.companies = state.companies.filter(it=>it.id!=company.id)
							return state
						})
					}
                })
            }
        }
    })
  }

  removeContact(contact, done) {
    const dis = this
    swal({
        title: trans('Confirmez-vous la suppression?'),
        text: trans('Cet enregistrement sera supprimé définitivement'),
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: trans('Oui je confirme')
    }).then((result) => {
        if (result.value) {
            if(contact.id>0) {
                $.ajax({
                    url : trans('/client_transport_contacts'),
                    type : 'delete',
                    data : {
                        user_id : contact.id,
                        customer_id : dis.props.data.row.id
                    },
                    success : done
                })
            }
            else
                done()
        }
    })
  }

  validate() {
    let errors = []
    let fsfields = $(".land-pane input").parsley()
    for(let i=0; i<fsfields.length; i++) {
        if(!fsfields[i].isValid({force:true}))
            errors = errors.concat(fsfields[i].getErrorsMessages())
    }
    return errors
  }

  render() {
    return <div className={`tab-pane land-pane ${this.props.data.tab=='land'?'active':''}`}
        id={`land`} role="tabpanel" aria-labelledby="land-tab">
          <div className="d-flex">
            <div className="border flex-column nav nav-pills p-1 rounded" id="v-pills-tab-client" role="tablist" aria-orientation="vertical">
              {this.props.data.row.facturable_type.endsWith('Mixtransporter')?<a className="nav-link text-light bg-primary text-nowrap mb-1" id={`v-pills-newland-tab`} data-toggle="pill" href={`#v-pills-newland`} role="tab" aria-controls={`v-pills-newland`} aria-selected={this.state.tab=='newland'?"true":"false"}>{trans('Ajouter une compagnie terrestre')}</a>:null}
              {this.state.companies.map(company=><a key={`pill-company-${company.id}`} className={`nav-link text-nowrap nav-link-client mb-1 ${company.id==this.state.tab?'active':''}`} id={`v-pills-${company.id}-tab`} data-toggle="pill" href={`#v-pills-${company.id}`} role="tab" aria-controls={`v-pills-${company.id}`} aria-selected={company.id==this.state.tab?"true":"false"}>{company.company.name}</a>)}
            </div>
            <div className="tab-content pt-0" id="v-pills-tabContent">
              {this.props.data.row.facturable_type.endsWith('Mixtransporter')?<div className="tab-pane fade" id="v-pills-newland" role="tabpanel" aria-labelledby="v-pills-newland-tab">
                <div className="form-group form-inline position-relative">
                    <label className="control-label col-md-2">{trans('Nom')}</label>
                    <input type="text" name="companies[newland][company][name]" autoComplete="bistrict" className={`form-control`}/>
                </div>
                <div className="form-group form-inline">
                  <label className="control-label col-md-2">{trans('Préfixe compagnie')}</label>
                  <input type="number" className="form-control" name={`companies[newland][nsetup][lta][prefix]`}/>
                </div>
                <input type="hidden" name={`companies[newland][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`companies[newland][company_id]`} value={this.models('state.company.id')}/>
                <input type="hidden" name={`companies[newland][company_type]`} value="land"/>
                <MultiForm namespace={`companies[newland]`} remove={this.removeContact} optional={true}/>
                <div className="card">
                  <div className="card-header">
                    <strong>{trans('Mail manifest & Version MLD')}</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 offset-md-1">
                          <label className="control-label text-uppercase">
                              {trans('Mail Manifest')}
                          </label>
                          <div className="row border-top mx-0 pt-1 mb-2">
                              <div className="col-md-6">
                                  <div className="custom-control custom-radio">
                                      <input type="radio" id={`companies-newland-nsetup-mail-manifest-1`} name={`companies[newland][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={false} value="1"/>
                                      <label className="custom-control-label" htmlFor={`companies-newland-nsetup-mail-manifest-1`}>{trans('Oui')}</label>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="custom-control custom-radio">
                                      <input type="radio" id={`companies-newland-nsetup-mail-manifest-0`} name={`companies[newland][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={true} value="0"/>
                                      <label className="custom-control-label" htmlFor={`companies-newland-nsetup-mail-manifest-0`}>{trans('Non')}</label>
                                  </div>
                              </div>
                          </div>
                        </div>
                        <MldVersions prefix="companies[newland]"/>
                  </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <strong>{trans('FWB')}</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 offset-md-1">
                        <label className="control-label text-uppercase">
                            {trans('FWB')}
                        </label>
                        <div className="row border-top mx-0 pt-1 mb-2">
                                <div className="col-md-6">
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id={`companies-newland-nsetup-fwb-1`} name={`companies[newland][nsetup][fwb]`} className="custom-control-input" defaultChecked={false} value="1"/>
                                        <label className="custom-control-label" htmlFor={`companies-newland-nsetup-fwb-1`}>{trans('Oui')}</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id={`companies-newland-nsetup-fwb-0`} name={`companies[newland][nsetup][fwb]`} className="custom-control-input" defaultChecked={true} value="0"/>
                                        <label className="custom-control-label" htmlFor={`companies-newland-nsetup-fwb-0`}>{trans('Non')}</label>
                                    </div>
                                </div>
                            </div>
                      </div>
                      <div className="col-md-4 offset-md-2">
                        <label className="control-label text-uppercase">
                            {trans('Version FWB')}
                        </label>
                        <div className="form-group border-top pt-3">
                          <div className="row">
                            <div className="col-md-6">
                                <select name={`companies[newland][nsetup][fwb_version]`} className="form-control">
                                    <option value="17">17</option>
                                    <option value="16">16</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <input type="text" name={`companies[newland][nsetup][fwb_name]`} className="form-control" placeholder="Nom FWB"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Repository prefix={`companies[newland]`} type="land"/>
              </div>:null}
              {this.state.companies.map(company=><div key={`tab-company-${company.id}`} className={`tab-pane fade show ${company.id==this.state.tab?'active':''}`} id={`v-pills-${company.id}`} role="tabpanel" aria-labelledby={`v-pills-${company.id}-tab`}>
                <input type="hidden" name={`companies[${company.id}][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`companies[${company.id}][company_id]`} value={this.cast(company, 'id')}/>
                <input type="hidden" name={`companies[${company.id}][company_type]`} value="land"/>
				<div className="d-flex justify-content-between">
	                <div className="form-group form-inline">
	                  <label className="control-label mr-3">{trans('Préfixe compagnie')}</label>
	                  <input type="number" className="form-control" name={`companies[${company.id}][nsetup][lta][prefix]`} defaultValue={this.cast(company, `nsetup.lta.prefix`)}/>
	                </div>
	               	{this.props.data.row.facturable_type.endsWith('Mixtransporter')?<div>
	                	<button type="button" onClick={()=>this.remove(company)} className="btn btn-danger text-light"><i className="fa fa-times-circle"></i> {trans("Supprimer la compagnie")}</button>
	                </div>:null}
	            </div>
                <MultiForm data={company} namespace={`companies[${company.id}]`} remove={this.removeContact} optional={true}/>
                <div className="card">
                  <div className="card-header">
                    <strong>{trans('Mail manifest & Version MLD')}</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 offset-md-1">
                          <label className="control-label text-uppercase">
                              {trans('Mail Manifest')}
                          </label>
                          <div className="row border-top mx-0 pt-1 mb-2">
                              <div className="col-md-6">
                                  <div className="custom-control custom-radio">
                                      <input type="radio" id={`companies-${company.id}-nsetup-mail-manifest-1`} name={`companies[${company.id}][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={this.cast(company, `nsetup.mail_manifest`)==1} value="1"/>
                                      <label className="custom-control-label" htmlFor={`companies-${company.id}-nsetup-mail-manifest-1`}>{trans('Oui')}</label>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="custom-control custom-radio">
                                      <input type="radio" id={`companies-${company.id}-nsetup-mail-manifest-0`} name={`companies[${company.id}][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={this.cast(company, `nsetup.mail_manifest`)!=1} value="0"/>
                                      <label className="custom-control-label" htmlFor={`companies-${company.id}-nsetup-mail-manifest-0`}>{trans('Non')}</label>
                                  </div>
                              </div>
                          </div>
                        </div>
                        <MldVersions prefix={`companies[${company.id}]`} data={company}/>
                  </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header">
                    <strong>{trans('FWB')}</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4 offset-md-1">
                        <label className="control-label text-uppercase">
                            {trans('FWB')}
                        </label>
                        <div className="row border-top mx-0 pt-1 mb-2">
                                <div className="col-md-6">
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id={`companies-${company.id}-nsetup-fwb-1`} name={`companies[${company.id}][nsetup][fwb]`} className="custom-control-input" defaultChecked={this.cast(company, 'nsetup.fwb')==1} value="1"/>
                                        <label className="custom-control-label" htmlFor={`companies-${company.id}-nsetup-fwb-1`}>{trans('Oui')}</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id={`companies-${company.id}-nsetup-fwb-0`} name={`companies[${company.id}][nsetup][fwb]`} className="custom-control-input" defaultChecked={this.cast(company, 'nsetup.fwb')!=1} value="0"/>
                                        <label className="custom-control-label" htmlFor={`companies-${company.id}-nsetup-fwb-0`}>{trans('Non')}</label>
                                    </div>
                                </div>
                            </div>
                      </div>
                      <div className="col-md-4 offset-md-2">
                        <label className="control-label text-uppercase">
                            {trans('Version FWB')}
                        </label>
                        <div className="form-group border-top pt-3">
                          <div className="row">
                            <div className="col-md-6">
                                <select name={`companies[${company.id}][nsetup][fwb_version]`} defaultValue={this.cast(company, 'nsetup.fwb_version')} className="form-control">
                                    <option value="17">17</option>
                                    <option value="16">16</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <input type="text" name={`companies[${company.id}][nsetup][fwb_name]`} defaultValue={this.cast(company, 'nsetup.fwb_name')} className="form-control" placeholder="Nom FWB"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Repository data={company} prefix={`companies[${company.id}]`} type="land"/>
              </div>)}
            </div>
          </div>
    </div>
  }
}

export default Modelizer(Land);