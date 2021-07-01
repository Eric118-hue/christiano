import React, {Component} from 'react';
import trans from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import $ from 'jquery';
import MultiForm from '../../../vendor/Ry/Admin/User/Multiform';
import Organisation from './Organisation';
import swal from 'sweetalert2';
import LandTab from './Tabs/Land';
import WaterTab from './Tabs/Water';
import AirTab from './Tabs/Air';
import './Form.scss';

class Form extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            confirmed : false,
            tab : this.models('props.data.tab', 'client-account'),
            errors : [],
            errorMessages : [],
            oncevalidate : false,
            type : this.models('props.data.row.type', 'airline'),
            name_search : this.models('props.data.row.facturable.name'),
            airlines : [],
            select_airline : false,
            facturable : this.models('props.data.row.facturable')
        }
        this.handleSelectAirline = this.handleSelectAirline.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleTypeChange = this.handleTypeChange.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.offClick = this.offClick.bind(this)
        this.removeContact = this.removeContact.bind(this)
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
                        url : trans('/client_contacts'),
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

    handleTypeChange(event, type) {
        this.setState({type})
    }

    handleSearch(event) {
        const value = event.target.value
        this.setState({
            name_search : value,
            facturable : value!=this.state.name_search ? {
                id : 0
            } : this.state.facturable,
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
            facturable : airline,
            select_airline : false
        })
    }

    componentDidMount() {
        $('[data-toggle="tab"]').on('shown.bs.tab', e=>{
            this.setState({
                tab : $(e.target).attr('href').replace('#', '')
            })
        })
        $(this.refs.client_form).parsley().on('form:validate', formInstance=>{
            $(window).off("beforeunload");
            let errors = []
            let errorMessages = []
            let notabshown = true
            let fsfields = $(".first-section input").parsley()
            for(let i=0; i<fsfields.length; i++) {
                if(!fsfields[i].isValid({force:true}))
                    errors = errors.concat(fsfields[i].getErrorsMessages())
            }
            if(errors.length>0) {
                errorMessages.push("Veuillez remplir le compte client.")
                $('#tab-form a[href="#client-account"]').tab('show')
                notabshown = false
            }
            if(this.refs.client_form) {
                if(this.state.type=='airline' && !this.models('state.facturable.id', false)) {
                    errors.push('no_airline_match')
                    errorMessages.push(trans("La compagnie aérienne n'est pas valide."))
                    if(!notabshown) {
                        $('#tab-form a[href="#client-account"]').tab('show')
                        notabshown = false
                    }
                }
            }
            if(this.refs.organisation) {
                let organisation_errors = this.refs.organisation.validate()
                if(organisation_errors.length>0) {
                    errors = errors.concat(organisation_errors)
                    errorMessages.push(trans("Veuillez remplir l'organisation."))
                    if(!notabshown) {
                        $('#tab-form a[href="#organisation"]').tab('show')
                        notabshown = false
                    }
                }
            }
            if(this.refs.airTab) {
                let air_errors = this.refs.airTab.validate()
                if(air_errors.length>0) {
                    errors = errors.concat(air_errors)
                    errorMessages.push(trans("Veuillez remplir airlines."))
                    if(!notabshown) {
                        $('#tab-form a[href="#air"]').tab('show')
                        notabshown = false
                    }
                }
            }
            if(this.refs.landTab) {
                let land_errors = this.refs.landTab.validate()
                if(land_errors.length>0) {
                    errors = errors.concat(land_errors)
                    errorMessages.push(trans("Veuillez remplir road."))
                    if(!notabshown) {
                        $('#tab-form a[href="#land"]').tab('show')
                        notabshown = false
                    }
                }
            }
            if(this.refs.WaterTab) {
                let water_errors = this.refs.waterTab.validate()
                if(water_errors.length>0) {
                    errors = errors.concat(water_errors)
                    errorMessages.push(trans("Veuillez remplir maritime."))
                    if(!notabshown) {
                        $('#tab-form a[href="#water"]').tab('show')
                        notabshown = false
                    }
                }
            }
            formInstance.validationResult = errors.length==0;
            this.setState({
                oncevalidate : true,
                errors : errors,
                errorMessages : errorMessages
            })
            if(this.state.tab=='pricing' && formInstance.validationResult && !this.state.confirmed) {
                formInstance.validationResult = false
                swal.fire({
                    title : trans('Attention!'),
                    text : trans('Les prix fournis seront définitifs sur la période renseignée.'),
                    icon: 'warning',
                    showCancelButton: true
                }).then(result=>{
                    this.setState({
                        confirmed : result.value
                    })
                    if(result.value)
                        $(this.refs.client_form).submit()
                })
            }
        })
    }

    render() {
        return <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    {this.state.errorMessages.length>0?<div className="alert alert-danger">
                        {this.state.errorMessages.map((errorMessage, index)=><div key={`error-${index}`}>{errorMessage}</div>)}
                    </div>:null}
                    <form name="frm_client" autoComplete="off" method="post" action={this.props.data.action} ref="client_form">
                        <input type="hidden" name="tab" value={this.state.tab}/>
                        <input type="hidden" value="nothing"/>
                        <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
                        <input type="hidden" name="facturable[id]" value={this.models('state.facturable.id')}/>
                        <ul className="nav nav-tabs" role="tablist" id="tab-form">
                            <li className="nav-item">
                                <a className={`nav-link ${this.state.tab=='client-account'?'active':''}`}
                        data-toggle="tab" href={`#client-account`} role="tab"
                        aria-controls="client-account"
                        aria-selected="true">{trans('Compte client')}</a>
                            </li>
                            {this.props.data.row.id?<React.Fragment>
                                {this.models('props.data.row.transport_types', []).indexOf('air')>=0?<li className="nav-item">
                                    <a className={`nav-link ${this.state.tab=='air'?'active':''}`}
                            data-toggle="tab" href={`#air`} role="tab"
                            aria-controls="air">{trans('Airlines')}</a>
                                </li>:null}
                                {this.models('props.data.row.transport_types', []).indexOf('land')>=0?<li className="nav-item">
                                    <a className={`nav-link ${this.state.tab=='land'?'active':''}`}
                            data-toggle="tab" href={`#land`} role="tab"
                            aria-controls="land">{trans('Roads')}</a>
                                </li>:null}
                                {this.models('props.data.row.transport_types', []).indexOf('water')>=0?<li className="nav-item">
                                    <a className={`nav-link ${this.state.tab=='water'?'active':''}`}
                            data-toggle="tab" href={`#water`} role="tab"
                            aria-controls="water">{trans('Maritimes')}</a>
                                </li>:null}
                                <li className="nav-item">
                                    <a className={`nav-link ${this.state.tab=='organisation'?'active':''}`}
                            data-toggle="tab" href={`#organisation`} role="tab"
                            aria-controls="organisation">{trans('Organisation')}</a>
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link ${this.state.tab=='pricing'?'active':''}`}
                            data-toggle="tab" href={`#pricing`} role="tab"
                            aria-controls="pricing">{trans('Tarifications')}</a>
                                </li>
                                <li className="nav-item">
                                    <a className={`nav-link`} href={`/carts?customer_id=${this.props.data.row.id}`}
                            aria-controls="invoices">{trans('Facturations')}</a>
                                </li>
                            </React.Fragment>:null}
                        </ul>
                        <div className="tab-content border-bottom border-left border-right p-4 mb-4">
                            <div className={`tab-pane ${this.state.tab=='client-account'?'active':''} first-section`}
                            id={`client-account`} role="tabpanel" aria-labelledby="client-account-tab">
                                <div className="row">
                                    <div className="col-md-1-10">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="type-airline" name="type" className="custom-control-input" onChange={event=>this.handleTypeChange(event, 'airline')} checked={this.state.type=='airline'} value="airline"/>
                                            <label className="custom-control-label" htmlFor="type-airline">{trans('Compagnie aérienne')}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-1-10">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="type-gsa" name="type" className="custom-control-input" onChange={event=>this.handleTypeChange(event, 'gsa')} checked={this.state.type=='gsa'} value="gsa"/>
                                            <label className="custom-control-label" htmlFor="type-gsa">{trans('GSA')}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-1-10">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="type-road" name="type" className="custom-control-input" onChange={event=>this.handleTypeChange(event, 'road')} checked={this.state.type=='road'} value="road"/>
                                            <label className="custom-control-label" htmlFor="type-road">{trans('Road')}</label>
                                        </div>
                                    </div>
									<div className="col-md-1-10">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="type-water" name="type" className="custom-control-input" onChange={event=>this.handleTypeChange(event, 'water')} checked={this.state.type=='water'} value="water"/>
                                            <label className="custom-control-label" htmlFor="type-water">{trans('Maritime')}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-1-10">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="type-mix" name="type" className="custom-control-input" onChange={event=>this.handleTypeChange(event, 'mix')} checked={this.state.type=='mix'} value="mix"/>
                                            <label className="custom-control-label" htmlFor="type-mix">{trans('Mix')}</label>
                                        </div>
                                    </div>
									{this.state.type=='mix'?<React.Fragment>
	                                    <div className="col-md-2">
	                                        <div className="custom-control custom-checkbox">
	                                            <input type="checkbox" id="mix-air" name="nsetup[transport_types][]" className="custom-control-input" defaultChecked={this.models('props.data.row.nsetup.transport_types', ['air']).indexOf('air')>=0} value="air"/>
	                                            <label className="custom-control-label" htmlFor="mix-air">{trans('Compagnie aérienne')}</label>
	                                        </div>
	                                    </div>
	                                    <div className="col-md-2">
	                                        <div className="custom-control custom-checkbox">
	                                            <input type="checkbox" id="mix-land" name="nsetup[transport_types][]" className="custom-control-input" defaultChecked={this.models('props.data.row.nsetup.transport_types', ['land']).indexOf('land')>=0} value="land"/>
	                                            <label className="custom-control-label" htmlFor="mix-land">{trans('Road')}</label>
	                                        </div>
	                                    </div>
	                                    <div className="col-md-2">
	                                        <div className="custom-control custom-checkbox">
	                                            <input type="checkbox" id="mix-water" name="nsetup[transport_types][]" className="custom-control-input" defaultChecked={this.models('props.data.row.nsetup.transport_types', ['water']).indexOf('water')>=0} value="water"/>
	                                            <label className="custom-control-label" htmlFor="mix-water">{trans('Maritime')}</label>
	                                        </div>
	                                    </div>
	                                </React.Fragment>:null}
                                </div>
                                    <div className="row">
	                                    <div className="col-md-6">
	                                        {this.state.type=='airline'?<div className="form-group position-relative mt-2">
	                                            <label className="control-label">{trans('Nom')}</label>
	                                            <input type="text" value={this.state.name_search} onChange={this.handleSearch} onClick={this.handleSearch} name="name" autoComplete="bistrict" required className={`form-control ${this.state.errors.indexOf('no_airline_match')>=0?'error':''}`}/>
	                                            <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airline?'show':''}`} style={{maxHeight:200}}>
	                                                {this.state.airlines.map(airline=><a key={`airline-${airline.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirline(e, airline)}>{airline.name}</a>)}
	                                            </div>
	                                        </div>:<div className="form-group position-relative mt-2">
	                                            <label className="control-label">{trans('Nom')}</label>
	                                            <input type="text" className="form-control" value={this.state.name_search} name="name" autoComplete="bistrict" onChange={this.handleNameChange} required/>
	                                        </div>}
	                                    </div>
									</div>
									<div>
                                    <div className="col-md-12 mt-2">
                                        <MultiForm data={this.props.data} remove={this.removeContact}/>
                                    </div>
                                    <div className="col-md-12">
                                    <div className="card">
                                            <div className="card-header">
                                                {trans('Coordonnées')}
                                            </div>
                                            <div className="body">
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-raw`}
                                                        className="col-md-4 mt-3 text-right">{trans("Adresse")}</label>
                                                    <div className="col-md-8">
                                                        <input name="adresse[raw]" required type="text"
                                                            defaultValue={this.models("props.data.row.facturable.adresse.raw", '')}
                                                            className="form-control" id="adresse-raw"/>
                                                        <input type="hidden" name="adresse[lat]" value={this.models("props.data.row.facturable.adresse.lat", '')}/>
                                                        <input type="hidden" name="adresse[lng]" value={this.models("props.data.row.facturable.adresse.lng", '')}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-raw2`}
                                                        className="col-md-4 mt-3 text-right">{trans("Adresse complémentaire")}</label>
                                                    <div className="col-md-8">
                                                        <input name="adresse[raw2]" type="text"
                                                            defaultValue={this.models("props.data.row.facturable.adresse.raw2", '')}
                                                            className="form-control" id="adresse-raw2"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-ville-cp`}
                                                        className="col-md-4 mt-3 text-right">{trans("Code postal")}</label>
                                                    <div className="col-md-8">
                                                        <input name="adresse[ville][cp]" required maxLength="10" type="text"
                                                            defaultValue={this.models("props.data.row.facturable.adresse.ville.cp", '')}
                                                            className="form-control" id="adresse-ville-cp"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-ville-nom`}
                                                        className="col-md-4 mt-3 text-right">{trans("Ville")}</label>
                                                    <div className="col-md-8">
                                                        <input name="adresse[ville][nom]" required type="text"
                                                            defaultValue={this.models("props.data.row.facturable.adresse.ville.nom", '')}
                                                            className="form-control" id="adresse-ville-nom"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-ville-country-id`}
                                                        className="col-md-4 mt-3 text-right">{trans("Pays")}</label>
                                                    <div className="col-md-8">
                                                        <select name={`adresse[ville][country][id]`} className="form-control"
                                                                id={`adresse-ville-country-id`} required
                                                                defaultValue={this.models("props.data.row.facturable.adresse.ville.country.id", '')}
                                                                data-size="5">
                                                            {this.props.data.countries.map((country => <option
                                                                key={`country-${country.id}`}
                                                                value={country.id}>{country.nom}</option>))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-4 mt-3 text-right"
                                                        htmlFor="contacts-fixe-ndetail-value">{trans("Téléphone")}</label>
                                                    <div className="col-md-8">
                                                        <input type="text"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fixe_phone.ndetail.value")}
                                                            className="form-control" id="contacts-fixe-ndetail-value"
                                                            name="contacts[fixe][ndetail][value]"/>
                                                        <input type="hidden" name="contacts[fixe][contact_type]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fixe_phone.ndetail.type", 'phone')}/>
                                                        <input type="hidden" name="contacts[fixe][id]" value={this.models("props.data.row.facturable.contacts.fixe_phone.id")}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-4 mt-3 text-right"
                                                        htmlFor="contacts-fax-ndetail-value">{trans("Fax")}</label>
                                                    <div className="col-md-8">
                                                        <input type="text"
                                                            defaultValue={this.models('props.data.row.facturable.contacts.fax_fax.ndetail.value','')}
                                                            className="form-control" id="contacts-fax-ndetail-value"
                                                            name="contacts[fax][ndetail][value]"/>
                                                        <input type="hidden" name="contacts[fax][contact_type]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fax_fax.ndetail.type", 'fax')}/>
                                                        <input type="hidden" name="contacts[fax][id]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fax_fax.id", '')}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-4 mt-3 text-right"
                                                        htmlFor="contacts-email-ndetail-value">{trans("Email")}</label>
                                                    <div className="col-md-8">
                                                        <input type="text" 
                                                            defaultValue={this.models("props.data.row.facturable.contacts.email_email.ndetail.value", '')}
                                                            className="form-control" id="contacts-email-ndetail-value"
                                                            name="contacts[email][ndetail][value]"/>
                                                        <input type="hidden" name="contacts[email][contact_type]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.email_email.ndetail.type", 'email')}/>
                                                        <input type="hidden" name="contacts[email][id]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.email_email.id", '')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.props.data.row.id && this.models('props.data.row.transport_types', []).indexOf('air')>=0?<AirTab ref="airTab" data={this.props.data}/>:null}
                            {this.props.data.row.id && this.models('props.data.row.transport_types', []).indexOf('land')>=0?<LandTab ref="landTab" data={this.props.data}/>:null}
                            {this.props.data.row.id && this.models('props.data.row.transport_types', []).indexOf('water')>=0?<WaterTab ref="waterTab" data={this.props.data}/>:null}
                            <Organisation tabbed={true} ref="organisation" data={this.props.data} store={this.props.store}/>
                        </div>
                        <input type="hidden" name="id" value={this.models('props.data.row.id')}/>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary">{trans('Enregistrer')}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Form)