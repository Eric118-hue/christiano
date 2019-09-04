import React, {Component} from 'react';
import trans from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import $ from 'jquery';
import MultiForm from '../../../vendor/Ry/Admin/User/Multiform';
import Station from './Station';

class Form extends Component
{
    constructor(props) {
        super(props)
        this.state = {
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

    render() {
        return <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <form name="frm_client" autoComplete="off" method="post" action={this.props.data.action}>
                        <input type="hidden" value="nothing"/>
                        <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
                        <input type="hidden" name="facturable[id]" value={this.models('state.facturable.id')}/>
                        <ul className="nav nav-tabs" role="tablist">
                            <li className="nav-item">
                                <a className={`nav-link active`}
                        data-toggle="tab" href={`#client-account`} role="tab"
                        aria-controls="client-account"
                        aria-selected="true">{trans('Compte client')}</a>
                            </li>
                            <li className="nav-item">
                                <a className={`nav-link`}
                        data-toggle="tab" href={`#stations`} role="tab"
                        aria-controls="stations">{trans('Stations')}</a>
                            </li>
                        </ul>
                        <div className="tab-content border-bottom border-left border-right p-4 mb-4">
                            <div className={`tab-pane active`}
                            id={`client-account`} role="tabpanel" aria-labelledby="client-account-tab">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="type-airline" name="type" className="custom-control-input" onChange={event=>this.handleTypeChange(event, 'airline')} checked={this.state.type=='airline'} value="airline"/>
                                            <label className="custom-control-label" htmlFor="type-airline">{trans('Compagnie aérienne')}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="custom-control custom-radio">
                                            <input type="radio" id="type-gsa" name="type" className="custom-control-input" onChange={event=>this.handleTypeChange(event, 'gsa')} checked={this.state.type=='gsa'} value="gsa"/>
                                            <label className="custom-control-label" htmlFor="type-gsa">{trans('GSA')}</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        {this.state.type=='airline'?<div className="form-group position-relative">
                                            <label className="control-label">{trans('nom')}</label>
                                            <input type="text" className="form-control" value={this.state.name_search} onChange={this.handleSearch} onClick={this.handleSearch} name="name" autoComplete="bistrict" required/>
                                            <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airline?'show':''}`} style={{maxHeight:200}}>
                                                {this.state.airlines.map(airline=><a key={`airline-${airline.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirline(e, airline)}>{airline.name}</a>)}
                                            </div>
                                        </div>:<div className="form-group position-relative">
                                            <label className="control-label">{trans('nom')}</label>
                                            <input type="text" className="form-control" value={this.state.name_search} name="name" autoComplete="bistrict" onChange={this.handleNameChange} required/>
                                        </div>}
                                    </div>
                                    <div className="col-md-12">
                                        <MultiForm data={this.props.data}/>
                                    </div>
                                    <div className="col-md-12">
                                    <div className="card">
                                            <div className="card-header">
                                                {trans('coordonnees')}
                                            </div>
                                            <div className="body">
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-raw`}
                                                        className="col-md-4 mt-3 text-right">{trans("adresse")}</label>
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
                                                        className="col-md-4 mt-3 text-right">{trans("adresse_complementaire")}</label>
                                                    <div className="col-md-8">
                                                        <input name="adresse[raw2]" type="text"
                                                            defaultValue={this.models("props.data.row.facturable.adresse.raw2", '')}
                                                            className="form-control" id="adresse-raw2"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-ville-cp`}
                                                        className="col-md-4 mt-3 text-right">{trans("code_postal")}</label>
                                                    <div className="col-md-8">
                                                        <input name="adresse[ville][cp]" required type="text"
                                                            defaultValue={this.models("props.data.row.facturable.adresse.ville.cp", '')}
                                                            className="form-control" id="adresse-ville-cp"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-ville-nom`}
                                                        className="col-md-4 mt-3 text-right">{trans("ville")}</label>
                                                    <div className="col-md-8">
                                                        <input name="adresse[ville][nom]" required type="text"
                                                            defaultValue={this.models("props.data.row.facturable.adresse.ville.nom", '')}
                                                            className="form-control" id="adresse-ville-nom"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label htmlFor={`adresse-ville-country-id`}
                                                        className="col-md-4 mt-3 text-right">{trans("pays")}</label>
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
                                                        htmlFor="contacts-fixe-ndetail-value">{trans("telephone")}</label>
                                                    <div className="col-md-8">
                                                        <input type="text"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fixe.ndetail.value")}
                                                            className="form-control" id="contacts-fixe-ndetail-value"
                                                            name="contacts[fixe][ndetail][value]"/>
                                                        <input type="hidden" name="contacts[fixe][contact_type]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fixe.ndetail.type", 'phone')}/>
                                                        <input type="hidden" name="contacts[fixe][id]" value={this.models("props.data.row.facturable.contacts.fixe.id")}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-4 mt-3 text-right"
                                                        htmlFor="contacts-fax-ndetail-value">{trans("fax")}</label>
                                                    <div className="col-md-8">
                                                        <input type="text"
                                                            defaultValue={this.models('props.data.row.facturable.contacts.fax.ndetail.value','')}
                                                            className="form-control" id="contacts-fax-ndetail-value"
                                                            name="contacts[fax][ndetail][value]"/>
                                                        <input type="hidden" name="contacts[fax][contact_type]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fax.ndetail.type", 'fax')}/>
                                                        <input type="hidden" name="contacts[fax][id]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.fax.id", '')}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-md-4 mt-3 text-right"
                                                        htmlFor="contacts-email-ndetail-value">{trans("e_mail")}</label>
                                                    <div className="col-md-8">
                                                        <input type="text" 
                                                            defaultValue={this.models("props.data.row.facturable.contacts.email.ndetail.value", '')}
                                                            className="form-control" id="contacts-email-ndetail-value"
                                                            name="contacts[email][ndetail][value]"/>
                                                        <input type="hidden" name="contacts[email][contact_type]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.email.ndetail.type", 'email')}/>
                                                        <input type="hidden" name="contacts[email][id]"
                                                            defaultValue={this.models("props.data.row.facturable.contacts.email.id", '')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-header">
                                                <span className="text-uppercase">{trans('mode_de_paiement')}</span>
                                            </div>
                                            <div className="body">
                                                <div className="row">
                                                    <div className="form-group col-md-6">
                                                        <label className="control-label"
                                                                    >{trans('blocage_de_paiement')}</label>
                                                        <div className="custom-control custom-switch">
                                                            <input type="checkbox" className="custom-control-input" id="setup-payment-forbid"
                                                                    value="1"
                                                                    defaultChecked={this.models("props.data.row.nsetup.payment.forbid") == 1}
                                                                    name={`nsetup[payment][forbid]`}/>
                                                            <label className="custom-control-label"
                                                                    htmlFor="setup-payment-forbid"></label>
                                                        </div>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="payment_modes">{trans("mode_de_paiement")}</label>
                                                        <select name={`nsetup[orders][payment_modes]`} className="form-control" id={`payment_modes`}
                                                                defaultValue={this.models("props.data.row.nsetup.orders.payment_modes", '')}
                                                                data-size="5">
                                                            {this.props.data.payment_modes.map((payment_mode => <option
                                                                key={`payment_mode-${payment_mode.id}`}
                                                                value={payment_mode.id}>{payment_mode.code} - {payment_mode.label}</option>))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                        <div className="card">
                                            <div className="card-header">
                                                {trans('informations_de_paiement')}
                                            </div>
                                            <div className="body">
                                                <div className="row">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="bank_accounts-0-setup-owner">{trans("nom_titulaire")}</label>
                                                        <input name="bank_accounts[0][nsetup][owner]" type="text"
                                                            defaultValue={(this.models('props.data.row.bank_accounts', false) && this.props.data.row.bank_accounts.length > 0) ? this.props.data.row.bank_accounts[0].nsetup.owner : ''}
                                                            className="form-control" id="bank_accounts-0-nsetup-owner"/>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="setup-payment-paypal-email">{trans("adresse_e_mail_paypal")}</label>
                                                        <input name="nsetup[payment][paypal][email]" type="email"
                                                            defaultValue={this.models("props.data.row.nsetup.payment.paypal.email", '')}
                                                            className="form-control" id="setup-payment-paypal-email"/>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="bank_accounts-0-bank-name">{trans("banque")}</label>
                                                        <input name="bank_accounts[0][bank][name]" type="text"
                                                            defaultValue={(this.models('props.data.row.bank_accounts', false) && this.props.data.row.bank_accounts.length > 0) ? this.props.data.row.bank_accounts[0].bank.name : ''}
                                                            className="form-control" id="bank_accounts-0-bank-name"/>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="bank_accounts-0-setup-rib">{trans("rib")}</label>
                                                        <input name="bank_accounts[0][nsetup][RIB]" type="text"
                                                            defaultValue={(this.models('props.data.row.bank_accounts', false) && this.props.data.row.bank_accounts.length > 0) ? this.props.data.row.bank_accounts[0].nsetup.RIB : ''}
                                                            className="form-control" id="bank_accounts-0-setup-rib"/>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="bank_accounts-0-setup-iban">{trans("iban")}</label>
                                                        <input name="bank_accounts[0][nsetup][IBAN]" type="text"
                                                            defaultValue={(this.models('props.data.row.bank_accounts', false) && this.props.data.row.bank_accounts.length > 0) ? this.props.data.row.bank_accounts[0].nsetup.IBAN : ''}
                                                            className="form-control" id="bank_accounts-0-setup-iban"/>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="bank_accounts-0-setup-bic">{trans("bic")}</label>
                                                        <input name="bank_accounts[0][nsetup][BIC]" type="text"
                                                            defaultValue={(this.models('props.data.row.bank_accounts', false) && this.props.data.row.bank_accounts.length > 0) ? this.props.data.row.bank_accounts[0].nsetup.BIC : ''}
                                                            className="form-control" id="bank_accounts-0-setup-bic"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`tab-pane`}
                            id={`stations`} role="tabpanel" aria-labelledby="stations-tab">
                                <Station data={this.models('props.data.row.stations')} customerId={this.models('props.data.row.id')} store={this.props.store}/>
                            </div>
                        </div>
                        <input type="hidden" name="id" value={this.models('props.data.row.id')}/>
                        <button className="btn btn-primary">{trans('enregistrer')}</button>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Form)