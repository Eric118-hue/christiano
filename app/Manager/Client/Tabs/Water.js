import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import MultiForm from 'ryvendor/Ry/Admin/User/Multiform';
import trans from 'ryapp/translations';
import Repository from '../Repository';
import Air, {Mlds as MldVersions} from './Air';

class Water extends Air
{
	constructor(props) {
    super(props)
    this.state.tab = this.cast(this.models('props.data.row.companies', []).filter(it=>it.type=='water'), '0.id', 0)
    this.state.companies = this.models('props.data.row.companies', []).filter(it=>it.type=='water')
  }
	
  render() {
    return <div className={`tab-pane water-pane ${this.props.data.tab=='water'?'active':''}`}
        id={`water`} role="tabpanel" aria-labelledby="water-tab">
          <div className="d-flex">
            <div className="border flex-column nav nav-pills p-1 rounded" id="v-pills-tab-client" role="tablist" aria-orientation="vertical">
				{this.props.data.row.type=='mix'?<a className="nav-link text-light bg-primary text-nowrap mb-1" id={`v-pills-newwater-tab`} data-toggle="pill" href={`#v-pills-newwater`} role="tab" aria-controls={`v-pills-newwater`} aria-selected={this.state.tab=='newwater'?"true":"false"}>{trans('Ajouter une compagnie maritime')}</a>:null}
              	{this.state.companies.map(company=><a key={`pill-company-${company.id}`} className={`nav-link text-nowrap nav-link-client mb-1 ${company.id==this.state.tab?'active':''}`} id={`v-pills-${company.id}-tab`} data-toggle="pill" href={`#v-pills-${company.id}`} role="tab" aria-controls={`v-pills-${company.id}`} aria-selected={company.id==this.state.tab?"true":"false"}>{company.company.name}</a>)}
            </div>
            <div className="tab-content pt-0" id="v-pills-tabContent">
				{this.props.data.row.type=='mix'?<div className="tab-pane fade" id="v-pills-newwater" role="tabpanel" aria-labelledby="v-pills-newwater-tab">
                <div className="form-group form-inline position-relative">
                    <label className="control-label col-md-2">{trans('Nom')}</label>
                    <input type="text" name="companies[newwater][company][name]" autoComplete="bistrict" className={`form-control`}/>
                </div>
                <div className="form-group form-inline">
                  <label className="control-label col-md-2">{trans('Préfixe compagnie')}</label>
                  <input type="number" className="form-control" name={`companies[newwater][nsetup][lta][prefix]`}/>
                </div>
                <input type="hidden" name={`companies[newwater][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`companies[newwater][company_id]`} value={this.models('state.company.id')}/>
                <input type="hidden" name={`companies[newwater][company_type]`} value="water"/>
                <MultiForm namespace={`companies[newwater]`} remove={this.removeContact} optional={true}/>
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
                                      <input type="radio" id={`companies-newwater-nsetup-mail-manifest-1`} name={`companies[newwater][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={false} value="1"/>
                                      <label className="custom-control-label" htmlFor={`companies-newwater-nsetup-mail-manifest-1`}>{trans('Oui')}</label>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="custom-control custom-radio">
                                      <input type="radio" id={`companies-newwater-nsetup-mail-manifest-0`} name={`companies[newwater][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={true} value="0"/>
                                      <label className="custom-control-label" htmlFor={`companies-newwater-nsetup-mail-manifest-0`}>{trans('Non')}</label>
                                  </div>
                              </div>
                          </div>
                        </div>
                        <MldVersions prefix="companies[newwater]"/>
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
                                        <input type="radio" id={`companies-newwater-nsetup-fwb-1`} name={`companies[newwater][nsetup][fwb]`} className="custom-control-input" defaultChecked={false} value="1"/>
                                        <label className="custom-control-label" htmlFor={`companies-newwater-nsetup-fwb-1`}>{trans('Oui')}</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id={`companies-newwater-nsetup-fwb-0`} name={`companies[newwater][nsetup][fwb]`} className="custom-control-input" defaultChecked={true} value="0"/>
                                        <label className="custom-control-label" htmlFor={`companies-newwater-nsetup-fwb-0`}>{trans('Non')}</label>
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
                                <select name={`companies[newwater][nsetup][fwb_version]`} className="form-control">
                                    <option value="17">17</option>
                                    <option value="16">16</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <input type="text" name={`companies[newwater][nsetup][fwb_name]`} className="form-control" placeholder="Nom FWB"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Repository prefix={`companies[newwater]`} type="water"/>
              </div>:null}
              {this.state.companies.map(company=><div key={`tab-company-${company.id}`} className={`tab-pane fade show ${company.id==this.state.tab?'active':''}`} id={`v-pills-${company.id}`} role="tabpanel" aria-labelledby={`v-pills-${company.id}-tab`}>
                <input type="hidden" name={`companies[${company.id}][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`companies[${company.id}][company_id]`} value={this.cast(company, 'company_id')}/>
                <input type="hidden" name={`companies[${company.id}][company_type]`} value="water"/>
                <div className="form-group form-inline">
                  <label className="control-label mr-3">{trans('Préfixe compagnie')}</label>
                    <input type="number" className="form-control" name={`companies[${company.id}][nsetup][lta][prefix]`} defaultValue={this.cast(company, `nsetup.lta.prefix`)}/>
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
                <Repository data={company} prefix={`companies[${company.id}]`} type="water"/>
              </div>)}
            </div>
          </div>
    </div>
  }
}

export default Modelizer(Water);