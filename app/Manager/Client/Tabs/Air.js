import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import MultiForm from 'ryvendor/Ry/Admin/User/Multiform';
import trans from 'ryapp/translations';
import $ from 'jquery';
import swal from 'sweetalert2';
import Repository from '../Repository';

class MldVersion extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      airports : this.models('props.data.airport', false) ? [this.models('props.data.airport')] : [],
      airport : this.models('props.data.airport')
    }
    this.mld_version = React.createRef()
    this.airport = React.createRef()
    this.airport_container = React.createRef()
    this.handleAirport = this.handleAirport.bind(this)
  }

  handleAirport(event) {
    const airport_id = event.target.value
    this.setState(state=>{
      state.airport = state.airports.find(it=>it.id==airport_id)
      return state
    })
  }

  componentDidMount() {
    $(this.mld_version.current).selectpicker({
      noneSelectedText: '--',
      container: 'body'
    });
    $(this.airport.current).selectpicker({
      noneSelectedText: '--',
      container: 'body',
      liveSearch: true,
      noneResultsText: trans('Aucun résultat pour')
    });
    const airport_input = $(this.airport_container.current).find('.bs-searchbox input')
    airport_input.on('input propertychange', ()=>{
      if(this.xhr)
        this.xhr.abort()
      this.xhr = $.ajax({
        url : '/airports',
        data : {
          q : airport_input.val(),
          json : true
        },
        success : response=>{
          this.setState(state=>{
            state.airports = this.cast(response, 'data.data', [])
            state.airport = this.cast(response, 'data.data.0')
            return state
          })
          setTimeout(()=>{
            $(this.airport.current).selectpicker('refresh')
          }, 0)
        }
      })
    })
  }

  render() {
    const prefix = this.props.prefix ? this.props.prefix + '[nsetup]' : 'nsetup'
    return <div className="align-items-center mb-2 row">
    <select ref={this.mld_version} className="col-md-5" name={`${prefix}[mld_versions][${this.props.pindex}][mld_version]`} defaultValue={this.models('props.data.mld_version')}>
        <option value="V1">V1</option>
        <option value="CV">CV</option>
    </select>
    <div className="col-md-5" ref={this.airport_container}>
        <select ref={this.airport} className="form-control" name={`${prefix}[mld_versions][${this.props.pindex}][airport][id]`} onChange={this.handleAirport} value={this.models('state.airport.id')}>
            {this.state.airports.map(airport=><option key={`airport-${airport.id}`} value={airport.id}>{airport.iata}</option>)}
        </select>
        <input type="hidden" name={`${prefix}[mld_versions][${this.props.pindex}][airport][iata]`} value={this.models('state.airport.iata')}/>
    </div>
    <div className="col-md-2 align-right">
      <button className="btn-circle btn btn-danger" type="button" onClick={this.props.remove}><i className="fa fa-trash"></i></button>
    </div>
  </div>
  }
}

Modelizer(MldVersion)

class MldVersions extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      mld_versions : this.models('props.data.nsetup.mld_versions', [])
    }
    this.add = this.add.bind(this)
    this.remove = this.remove.bind(this)
  }

  add() {
    this.setState(state=>{
      state.mld_versions.push({})
      return state
    })
  }

  remove(index) {
    this.setState(state=>{
      state.mld_versions.splice(index, 1)
      return state
    })
  }

  render() {
    return <div className="col-md-4 offset-md-2">
    <label className="control-label text-uppercase row mx-0 justify-content-between">
      <span>{trans('Version MLD')}</span>
      <button className="btn-circle btn btn-primary" type="button" onClick={this.add}><i className="fa fa-plus"></i></button>
    </label>
    <div className="form-group pt-3 border-top">
      {this.state.mld_versions.map((mld_version, index)=><MldVersion prefix={this.props.prefix} remove={()=>this.remove(index)} key={`nsetup-mld-version-${index}`} pindex={index} data={mld_version}/>)}
    </div>
    </div>
  }
}

export const Mlds = Modelizer(MldVersions)

class Air extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      tab : this.cast(this.models('props.data.row.companies', []).filter(it=>it.type=='air'), '0.id', 0),
      companies : this.models('props.data.row.companies', []).filter(it=>it.type=='air'),
      errors : [],
      errorMessages : [],
      oncevalidate : false,
      name_search : '',
      select_airline : false,
      airlines : []
    }
    this.removeContact = this.removeContact.bind(this)
    this.handleSelectAirline = this.handleSelectAirline.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.offClick = this.offClick.bind(this)
    this.validate = this.validate.bind(this)
	this.remove = this.remove.bind(this)
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

  offClick() {
    this.setState({
        select_airline : false
    })
    $('body').off('click', this.offClick)
  }

  handleNameChange(event) {
    this.setState({
        name_search : event.target.value
    })
  }

  handleSearch(event) {
    const value = event.target.value
    this.setState({
        name_search : value,
        company : value!=this.state.name_search ? {
            id : 0
        } : this.state.company,
        select_airline : this.state.airlines.length>0
    })

    if(value.length<2)
        return

    if(this.searchx)
        this.searchx.abort()

    this.searchx = $.ajax({
        url : '/airlines',
        data : {
            json : true,
            s : {
                name : value
            }
        },
        success : response=>{
            if(response.data.data.length>0)
                $('body').on('click', this.offClick)
            this.setState({
                airlines : response.data.data,
                select_airline : response.data.data.length>0
            })
        }
    })
  }

  handleSelectAirline(event, airline) {
      event.preventDefault()
      this.setState({
          name_search : airline.name,
          company : airline,
          select_airline : false
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
    let fsfields = $(".air-pane input").parsley()
    for(let i=0; i<fsfields.length; i++) {
        if(!fsfields[i].isValid({force:true}))
            errors = errors.concat(fsfields[i].getErrorsMessages())
    }
    if(this.models('state.name_search') && !this.models('state.company.id', false)) {
      errors.push('no_airline_match')
    }
    return errors
  }

  render() {
    return <div className={`tab-pane air-pane ${this.props.data.tab=='air'?'active':''}`}
        id={`air`} role="tabpanel" aria-labelledby="air-tab">
          <div className="d-flex">
            <div className="border flex-column nav nav-pills p-1 rounded" id="v-pills-tab-client" role="tablist" aria-orientation="vertical">
              {this.props.data.row.facturable_type.endsWith('Airline')?null:<a className="nav-link text-light bg-primary text-nowrap mb-1" id={`v-pills-newair-tab`} data-toggle="pill" href={`#v-pills-newair`} role="tab" aria-controls={`v-pills-newair`} aria-selected={this.state.tab=='newair'?"true":"false"}>{trans('Ajouter une compagnie aérienne')}</a>}
              {this.state.companies.map(company=><a key={`pill-company-${company.id}`} className={`nav-link text-nowrap nav-link-client mb-1 ${company.id==this.state.tab?'active':''}`} id={`v-pills-${company.id}-tab`} data-toggle="pill" href={`#v-pills-${company.id}`} role="tab" aria-controls={`v-pills-${company.id}`} aria-selected={company.id==this.state.tab?"true":"false"}>{company.company.name}</a>)}
            </div>
            <div className="tab-content pt-0" id="v-pills-tabContent">
            {this.props.data.row.facturable_type.endsWith('Airline')?null:<div className="tab-pane fade" id="v-pills-newair" role="tabpanel" aria-labelledby="v-pills-newair-tab">
                <div className="form-group form-inline position-relative">
                    <label className="control-label col-md-2">{trans('Nom')}</label>
                    <input type="text" value={this.state.name_search} onChange={this.handleSearch} onClick={this.handleSearch} name="companies[newair][company][name]" autoComplete="bistrict" className={`form-control ${this.state.errors.indexOf('no_airline_match')>=0?'error':''}`}/>
                    <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airline?'show':''}`} style={{maxHeight:200}}>
                        {this.state.airlines.map(airline=><a key={`airline-${airline.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirline(e, airline)}>{airline.name}</a>)}
                    </div>
                </div>
                <div className="form-group form-inline">
                  <label className="control-label col-md-2">{trans('Préfixe compagnie')}</label>
                  <input type="number" className="form-control" name={`companies[newair][nsetup][lta][prefix]`}/>
                </div>
                <input type="hidden" name={`companies[newair][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`companies[newair][company_id]`} value={this.models('state.company.id')}/>
                <input type="hidden" name={`companies[newair][company_type]`} value="air"/>
                <MultiForm namespace={`companies[newair]`} remove={this.removeContact} optional={true}/>
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
                                      <input type="radio" id={`companies-newair-nsetup-mail-manifest-1`} name={`companies[newair][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={false} value="1"/>
                                      <label className="custom-control-label" htmlFor={`companies-newair-nsetup-mail-manifest-1`}>{trans('Oui')}</label>
                                  </div>
                              </div>
                              <div className="col-md-6">
                                  <div className="custom-control custom-radio">
                                      <input type="radio" id={`companies-newair-nsetup-mail-manifest-0`} name={`companies[newair][nsetup][mail_manifest]`} className="custom-control-input" defaultChecked={true} value="0"/>
                                      <label className="custom-control-label" htmlFor={`companies-newair-nsetup-mail-manifest-0`}>{trans('Non')}</label>
                                  </div>
                              </div>
                          </div>
                        </div>
                        <MldVersions prefix="companies[newair]"/>
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
                                        <input type="radio" id={`companies-newair-nsetup-fwb-1`} name={`companies[newair][nsetup][fwb]`} className="custom-control-input" defaultChecked={false} value="1"/>
                                        <label className="custom-control-label" htmlFor={`companies-newair-nsetup-fwb-1`}>{trans('Oui')}</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="custom-control custom-radio">
                                        <input type="radio" id={`companies-newair-nsetup-fwb-0`} name={`companies[newair][nsetup][fwb]`} className="custom-control-input" defaultChecked={true} value="0"/>
                                        <label className="custom-control-label" htmlFor={`companies-newair-nsetup-fwb-0`}>{trans('Non')}</label>
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
                                <select name={`companies[newair][nsetup][fwb_version]`} className="form-control">
                                    <option value="17">17</option>
                                    <option value="16">16</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <input type="text" name={`companies[newair][nsetup][fwb_name]`} className="form-control" placeholder="Nom FWB"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Repository prefix={`companies[newair]`} type="airline"/>
              </div>}
              {this.state.companies.map(company=><div key={`tab-company-${company.id}`} className={`tab-pane fade show ${company.id==this.state.tab?'active':''}`} id={`v-pills-${company.id}`} role="tabpanel" aria-labelledby={`v-pills-${company.id}-tab`}>
                <input type="hidden" name={`companies[${company.id}][customer_id]`} value={this.models('props.data.row.id')}/>
                <input type="hidden" name={`companies[${company.id}][company_id]`} value={this.cast(company, 'company_id')}/>
                <input type="hidden" name={`companies[${company.id}][company_type]`} value="air"/>
                <div className="d-flex justify-content-between">
	                <div className="form-group form-inline">
	                  <label className="control-label mr-3">{trans('Préfixe compagnie')}</label>
	                    <input type="number" className="form-control" name={`companies[${company.id}][nsetup][lta][prefix]`} defaultValue={this.cast(company, `nsetup.lta.prefix`)}/>
	                </div>
	                {this.props.data.row.facturable_type.endsWith('Airline')?null:<div>
	                	<button type="button" onClick={()=>this.remove(company)} className="btn btn-danger text-light"><i className="fa fa-times-circle"></i> {trans("Supprimer la compagnie aérienne")}</button>
	                </div>}
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
                <Repository data={company} prefix={`companies[${company.id}]`} type="airline"/>
              </div>)}
            </div>
          </div>
    </div>
  }
}

export default Modelizer(Air);