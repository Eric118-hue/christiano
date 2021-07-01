import React from 'react';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import AdminUser from '../../../vendor/Ry/Admin/User';
import {GENDERMAN} from '../../../vendor/Ry/Admin/User/constants';
import homme from '../../../medias/images/profil-homme.jpg';
import femme from '../../../medias/images/profil-femme.jpg';
import trans, {nophoto} from '../../translations';
import $ from 'jquery';
import Organisation from '../Client/Organisation';

const airportinfo = false

class Form extends AdminUser
{
    constructor(props) {
        super(props)
        this.state = {
            oncevalidate : false,
            errors : [],
            search_airport : '',
            active : this.models('props.data.active', true),
            airline : '',
            filter_airlines : [],
            airlines : this.models('props.data.company.airlines', []),
            deleted_airlines : [],
            select_edi : false,
            select_edis : [],
            select_airport : false,
            search_edi : '',
            edis : this.models('props.data.edis', []),
            select_airports : [],
            deleted_customers : [],
            airport : this.models('props.data.airport', null) ? this.props.data.airport : this.models('props.data.select_airports', []).length>0?this.props.data.select_airports[0]:null
        }
        this.removeLogo = this.removeLogo.bind(this)
        this.filterAirline = this.filterAirline.bind(this)
        this.addAirline = this.addAirline.bind(this)
        this.removeAirline = this.removeAirline.bind(this)
        this.handleEdiChange = this.handleEdiChange.bind(this)
        this.handleSelectEdi = this.handleSelectEdi.bind(this)
        this.offClick = this.offClick.bind(this)
        this.activeHandler = this.activeHandler.bind(this)
        this.handleStationChange = this.handleStationChange.bind(this)
        this.editAirport = this.editAirport.bind(this)
        this.handleSearchAirport = this.handleSearchAirport.bind(this)
        this.handleSelectAirport = this.handleSelectAirport.bind(this)
        this.removeSelectedEdi = this.removeSelectedEdi.bind(this)
    }

    removeSelectedEdi(event, edi_index) {
        event.preventDefault()
        this.setState(state=>{
            state.edis[edi_index].deleted = true
            return state
        })
        return false
    }

    handleSelectAirport(event, airport) {
        event.preventDefault()
        this.setState({
            airport : airport,
            select_airport : false
        })
        return false
    }

    handleSearchAirport(event) {
        const value = event.target.value
        this.setState({
            search_airport : value
        })
        if(this.axAirport)
            this.axAirport.abort()
        this.axAirport = $.ajax({
            url : '/airports',
            data : {
                json : true,
                q : value,
                with : ['customers']
            },
            success : response=>{
                this.setState(state=>{
                    if(response.data.data.length>0)
                        state.select_airport = true
                    state.select_airports = response.data.data
                    return state
                })
            }
        })
    }

    editAirport() {
        this.setState({
            select_airport : true
        })
        window.setTimeout(()=>{
            $(this.refs.airport_editor).focus();
            $('body').on('click', this.offClick);
        }, 0)
    }

    handleStationChange(event) {
        const value = event.target.value
        this.setState(state=>{
            state.airport = state.select_airports.find(item=>item.id==value)
            return state
        })
    }

    activeHandler(event) {
        const checked = event.target.checked
        this.setState({
            active : checked
        })
    }

    handleEdiChange(event) {
        const value = event.target.value
        this.setState({
            search_edi : value
        })
        if(value.length<2)
            return
        if(this.axEdi)
            this.axEdi.abort()
        this.axEdi = $.ajax({
            url : '/edis',
            data : {
                s : value
            },
            success : response=>{
                if(response.length==0)
                    return
                $('body').on('click', this.offClick);
                this.setState({
                    select_edi : true,
                    select_edis : response
                })
            }
        })
    }

    handleSelectEdi(event, item) {
        event.preventDefault()
        this.setState(state=>{
            state.search_edi = ''
            if(!state.edis.find(it=>it.id==item.id))
                state.edis.push(item)
            return state
        })
        return false
    }

    addAirline(airline) {
        this.setState(state=>{
            state.airlines.push({...airline})
            state.filter_airlines = state.filter_airlines.filter(item=>item.id!=airline.id)
            state.deleted_airlines = state.deleted_airlines.filter(item=>item.id!=airline.id)
            return state
        })
    }

    removeAirline(airline) {
        this.setState(state=>{
            state.airlines = state.airlines.filter(item=>item.id!=airline.id)
            state.filter_airlines.push({...airline})
            state.deleted_airlines.push({...airline})
            return state
        })
    }

    filterAirline(event) {
        const value = event.target.value
        this.setState({
            airline : value
        })
        if(value.length>2) {
            if(this.request)
                this.request.abort()
            this.request = $.ajax({
                url : '/airlines',
                data : {
                    q : value,
                    json : true
                },
                success : response=>{
                    this.setState({
                        filter_airlines : response.data.data
                    })
                }
            })
        }
    }

    offClick() {
        this.setState({
            select_edi : false,
            select_airport : false
        })
        $('body').off('click', this.offClick);
    }

    componentDidMount() {
        const nophoto = this.refs.nophoto
        $("input:file").change(function(){
            $(nophoto).attr("checked", false)
        });
        const nologo = this.refs.nologo
        $("input:file").change(function(){
            $(nologo).attr("checked", false)
        });
        $(this.refs.agent_form).parsley({
            excluded : ':hidden',
        }).on('form:validate', formInstance=>{
            $(window).off("beforeunload");
            let errors = []
            if(this.state.edis.length==0)
                errors.push('edis')
            if(!this.state.airport) {
                errors.push('airport')
            }
            this.setState({
                oncevalidate : true,
                errors : errors
            })
            formInstance.validationResult = errors.length==0;
        })
    }

    removeLogo() {
        this.refs.companylogo.src = nophoto
        $(this.refs.companylogo).attr("checked", true)
    }

    render() {
        return <form action={this.props.data.action} name="frm_user" method="post" className="col-md-12" encType="multipart/form-data" ref="agent_form">
            <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
            <div className="card">
                <div className="body">
                    <div className="row">
                        <div className="col-md-3 text-center">
                            <img src={this.props.data.thumb?this.props.data.thumb:((this.props.data.profile&&this.props.data.profile.gender!==GENDERMAN)?femme:homme)} className="img-fluid img-thumbnail rounded-circle icon-160" ref="userphoto"/><br/>
                            <input type="file" name="photo" id="photo" className="d-none"/>
                            <label htmlFor="photo" className="bg-primary mouse-pointable mt-3 p-4 rounded text-white">{trans("Choisir une photo")}</label><br/>
                            <div>
                                <span className="badge badge-danger mr-15">NOTE!</span>
                                <span>Formats : .jpg, .png, .gif</span>
                            </div>
                            <button className="btn btn-danger btn-xs mt-2" type="button" onClick={this.removePhoto}>{trans('Supprimer la photo')}</button>
                            <input type="checkbox" name="nophoto" ref="nophoto" value="1" className="d-none"/>
                        </div>
                        <div className="col-md-9">
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa fa-shield-alt"></i> {trans("Informations & Statuts")}
                                </div>
                                <div className="body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="row">
                                                <div className="form-group col-3">
                                                    <label htmlFor="profile-gender" className="required">{trans("Civilité")} <i className="alpha-80 fa fa-lock pl-2 text-orange"></i></label>
                                                    <select name="profile[gender]" className="form-control" id="profile-gender" defaultValue={this.props.data.profile?this.props.data.profile.gender:GENDERMAN} required>
                                                        <option value="mr">M</option>
                                                        <option value="mrs">Mme</option>
                                                        <option value="ms">Mlle</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-5">
                                                    <label htmlFor="profile-firstname">{trans("Prénom")}</label>
                                                    <input name="profile[firstname]" type="text" defaultValue={this.models('props.data.profile.firstname','')} className="form-control" id="profile-firstname" required/>
                                                </div>
                                                <div className="form-group col-4">
                                                    <label htmlFor="profile-lastname">{trans("Nom")}</label>
                                                    <input type="text" name="profile[lastname]" defaultValue={this.models('props.data.profile.lastname','')} required className="form-control" id="profile-lastname"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="custom-control custom-switch pt-4 text-right">
                                                        <input type="checkbox" className={`custom-control-input`} id={`user-toggle-active-${this.props.data.id}`} onChange={this.activeHandler} checked={this.models('state.active', false)}/>
                                                        <label className="custom-control-label" htmlFor={`user-toggle-active-${this.props.data.id}`}>{this.state.active?trans('Compte actif'):trans('Compte inactif')}</label>
                                                        <input type="hidden" name="active" value={this.models('state.active')?1:0}/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="custom-control custom-switch pt-4 text-right">
                                                        <input type="checkbox" name="profile[nsetup][omnipresent]" className={`custom-control-input`} id={`user-toggle-omnipresent-${this.props.data.id}`} defaultChecked={this.models('props.data.profile.nsetup.omnipresent')}/>
                                                        <label className="custom-control-label" htmlFor={`user-toggle-omnipresent-${this.props.data.id}`}>{trans('Omniprésent')}</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row m-0">
                                            <label className="col-md-2 text-capitalize text-right pt-2">{trans("Code")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.profile.nsetup.code')} className="form-control" name="profile[nsetup][code]" />
                                            </div>
                                            <label className="text-capitalize col-md-2 text-right pt-2">{trans("Pays")}</label>
                                            <div className="form-group col-md-4">
                                                <select required name="profile[adresse][ville][country][id]" defaultValue={this.models('props.data.profile.adresse.ville.country.id')} className="form-control">
                                                    {this.props.data.countries.map(country=><option key={`country-${country.id}`} value={country.id}>{country.nom}</option>)}
                                                </select>
                                            </div>
                                            <label className="text-capitalize col-md-2 text-right pt-2">{trans("Adresse")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.profile.adresse.raw')} className="form-control" name="profile[adresse][raw]" />
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Téléphone")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.contacts.bureau_phone.ndetail.value')} className="form-control" id="contacts-0-ndetail-value" name="contacts[bureau][ndetail][value]" />
                                                <input type="hidden" name="contacts[bureau][contact_type]" defaultValue={'phone'}/>
                                                <input type="hidden" name="contacts[bureau][type]" defaultValue={'bureau'}/>
                                                <input type="hidden" name="contacts[bureau][id]" defaultValue={this.models('props.data.contacts.bureau_phone.id')}/>
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Code postal")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.profile.adresse.ville.cp')} className="form-control" name="profile[adresse][ville][cp]" />
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Fax")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" className="form-control" id="contacts-1-ndetail-value" name="contacts[fax][ndetail][value]" defaultValue={this.models('props.data.contacts.fax_fax.ndetail.value')}/>
                                                <input type="hidden" name="contacts[fax][contact_type]" defaultValue={'fax'}/>
                                                <input type="hidden" name="contacts[fax][type]" defaultValue={'fax'}/>
                                                <input type="hidden" name="contacts[fax][id]" defaultValue={this.models('props.data.contacts.fax_fax.id')}/>
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Boîte postale")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" defaultValue={this.models('props.data.profile.adresse.raw2')} className="form-control" name="profile[adresse][raw2]" />
                                            </div>
                                            <label htmlFor="email" className="col-md-2 text-right pt-2">{trans("Email")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="email" className="form-control" id="email" name="email" defaultValue={this.models('props.data.email')} required/>
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Ville")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.profile.adresse.ville.nom')} className="form-control" name="profile[adresse][ville][nom]" />
                                            </div>
                                            <label htmlFor="password" className="col-md-2 text-right pt-2">{trans("Mot de passe")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" className="form-control" id="password" name="password" defaultValue={this.models('props.data.id', false)?'******':''} required/>
                                            </div>
                                            {this.props.data.select_roles.map(role=><input key={`role-${role.id}`} type="hidden" name="roles[]" value={role.id}/>)}
                                            <label className="text-capitalize col-md-2 text-right pt-2">{trans("Langue")}</label>
                                            <div className="form-group col-md-4">
                                                <select required name="profile[languages]" defaultValue={this.models('props.data.profile.languages', 'fr')} className="form-control">
                                                    {this.props.data.select_langs.map(lang=><option key={`lang-${lang.id}`} value={lang.code}>{lang.french}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-header">
                                    <i className="fa fa-sitemap"></i> {trans("Stations & Schéma de liaison")}
                                </div>
                                <div className="body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group position-relative">
                                                <label className="control-label">{trans('Poste EDI')}</label>
                                                <div onClick={()=>$(this.refs.search_edi).focus()} className={`border input-group m-0 rounded row ${(this.state.oncevalidate && !this.state.airport)?'border-danger':''}`} style={{minHeight:'35px', padding:7}}>
                                                    {this.state.edis.filter(it=>!it.deleted).map((edi, edi_index)=><a key={`selected-edi-${edi.id}`} href="#" className="bg-light border pl-2 pr-2 rounded mr-1" onClick={e=>this.removeSelectedEdi(e, edi_index)}>{edi.edi_address} <i className="fa fa-times ml-2 text-danger"></i></a>)}
                                                    <div className="position-relative">
                                                        <input ref="search_edi" type="text" className="border-0 focus-outline-hidden" value={this.state.search_edi} onChange={this.handleEdiChange} onClick={this.handleEdiChange} autoComplete="astrict"/>
                                                        <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_edi?'show':''}`} style={{maxHeight:200}}>
                                                            {this.state.select_edis.map(edi=><a key={`edi-${edi.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectEdi(e, edi)}>{edi.edi_address} ({edi.party_identifier})</a>)}
                                                        </div>
                                                    </div>
                                                </div>
                                                {this.state.edis.map((edi, edi_index)=><input key={`edi-${edi.id}`} type="hidden" name={`edis[${edi_index}][${edi.deleted?'deleted_id':'id'}]`} value={edi.id}/>)}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label className="control-label text-capitalize">{trans('Station')} <i className="alpha-80 fa fa-lock pl-2 text-orange"></i></label>
                                                <div className="position-relative">
                                                    <div className={`border rounded mouse-pointable ${(this.state.oncevalidate && !this.state.airport)?'border-danger':''}`} onClick={this.editAirport} style={{minHeight:'35px', padding:7}}>
                                                        {this.state.airport?<React.Fragment>
                                                            <span className="text-orange">{this.state.airport.iata}</span> - {this.state.airport.name} - {this.models('state.airport.country.nom')}
                                                        </React.Fragment>:null}
                                                    </div>
                                                    <div className={`position-absolute w-100 ${this.state.select_airport?'':'d-none'}`} style={{top:0}}>
                                                        <input type="text" ref="airport_editor" className="form-control" value={this.state.search_airport} onChange={this.handleSearchAirport}/>
                                                        <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_airport?'show':''}`} style={{maxHeight:200}}>
                                                            {this.state.select_airports.map(item=><a key={`agent-select-airport-${item.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectAirport(e, item)}><span className="text-orange">{item.iata}</span> - {item.name} - {this.cast(item, 'country.nom')}</a>)}
                                                        </div>
                                                        <input type="hidden" name="profile[nsetup][airport_id]" value={this.models('state.airport.id')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(this.state.airport && airportinfo)?this.state.airport.customers.map(customer=><Organisation key={`customer-${customer.id}`} data={{row:customer}} store={this.props.store} readOnly={true}/>):null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="justify-content-between m-0 mb-3 row">
                <div className="col-auto">
                    <i className="alpha-80 fa fa-lock pl-2 pr-2 text-orange"></i>
                    <span className="text-orange">{trans('Champs obligatoires')}</span>
                </div>
                <div className="col-auto">
                    <input type="hidden" name="customer_id" value={this.models('props.data.customer_id')}/>
                    <input type="hidden" name="id" value={this.models('props.data.id')}/>
                    <button type="submit" className="btn btn-primary ml-2">{trans('Enregistrer')}</button>
                </div>
            </div>
        </form>
    }
}

export default Modelizer(Form);