import React from 'react';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import AdminUser from '../../../vendor/Ry/Admin/User';
import {GENDERMAN} from '../../../vendor/Ry/Admin/User/constants';
import homme from '../../../medias/images/profil-homme.jpg';
import femme from '../../../medias/images/profil-femme.jpg';
import trans, {nophoto} from '../../translations';
import $ from 'jquery';

class Form extends AdminUser
{
    constructor(props) {
        super(props)
        this.state = {
            airline : '',
            filter_airlines : [],
            airlines : this.models('props.data.company.airlines', []),
            deleted_airlines : [],
            select_ediA : false,
            select_ediB : false,
            select_ediAs : [],
            select_ediBs : [],
            search_ediA : '',
            search_ediB : '',
            edi_couples : this.models('props.data.edi_couples', []),
            select_airports : this.models('props.data.select_airports', []),
            deleted_customers : []
        }
        this.couple_index = 0
        this.removeLogo = this.removeLogo.bind(this)
        this.filterAirline = this.filterAirline.bind(this)
        this.addAirline = this.addAirline.bind(this)
        this.removeAirline = this.removeAirline.bind(this)
        this.handleEdiAChange = this.handleEdiAChange.bind(this)
        this.handleEdiBChange = this.handleEdiBChange.bind(this)
        this.handleSelectEdiA = this.handleSelectEdiA.bind(this)
        this.handleSelectEdiB = this.handleSelectEdiB.bind(this)
        this.saveCouple = this.saveCouple.bind(this)
        this.removeCouple = this.removeCouple.bind(this)
    }

    saveCouple() {
        if(!this.props.data.id) {
            this.couple_index++;
            this.setState(state=>{
                state.edi_couples.push({
                    a : state.ediA,
                    b : state.ediB,
                    id : this.couple_index
                })
                state.search_ediA = ''
                state.search_ediB = ''
                return state
            })
        }
        else {
            $.ajax({
                url : '/edi_couple',
                type : 'post',
                data : {
                    user_id : this.props.data.id,
                    a_id : this.state.ediA.id,
                    b_id : this.state.ediB.id
                },
                success : response => {
                    this.setState(state=>{
                        state.edi_couples.push({
                            a : state.ediA,
                            b : state.ediB,
                            id : response.row.id
                        })
                        state.search_ediA = ''
                        state.search_ediB = ''
                        delete state.ediA
                        delete state.ediB
                        return state
                    })
                }
            })
        }
    }

    removeCouple(couple) {
        if(!this.props.data.id) {
            this.setState(state=>{
                state.edi_couples = state.edi_couples.filter(item=>item.id!=couple.id)
                return state
            })
        }
        else {
            $.ajax({
                url : '/edi_couple',
                type : 'delete',
                data : {
                    id : couple.id
                },
                success : response=>{
                    this.setState(state=>{
                        state.edi_couples = state.edi_couples.filter(item=>item.id!=couple.id)
                        return state
                    })
                }
            })
        }
    }

    handleEdiAChange(event) {
        const value = event.target.value
        this.setState({
            search_ediA : value
        })
        if(value.length<2)
            return
        $.ajax({
            url : '/edis',
            data : {
                s : value
            },
            success : response=>{
                if(response.length==0)
                    return
                this.setState({
                    select_ediA : true,
                    select_ediAs : response
                })
            }
        })
    }

    handleEdiBChange(event) {
        const value = event.target.value
        this.setState({
            search_ediB : value
        })
        if(value.length<2)
            return
        $.ajax({
            url : '/edis',
            data : {
                s : value
            },
            success : response=>{
                if(response.length==0)
                    return
                this.setState({
                    select_ediB : true,
                    select_ediBs : response
                })
            }
        })
    }

    handleSelectEdiA(event, item) {
        event.preventDefault()
        this.setState({
            search_ediA : item.edi_address,
            ediA : item
        })
    }

    handleSelectEdiB(event, item) {
        event.preventDefault()
        this.setState({
            search_ediB : item.edi_address,
            ediB : item
        })
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

    componentDidMount() {
        const nophoto = this.refs.nophoto
        $("input:file").change(function(){
            $(nophoto).attr("checked", false)
        });
        const nologo = this.refs.nologo
        $("input:file").change(function(){
            $(nologo).attr("checked", false)
        });
        if(this.state.select_ediA || this.state.select_ediB) {
            $('body').on('click', ()=>{
                this.setState({
                    select_ediA : false,
                    select_ediB : false
                })
            });
        }
        $(this.refs.customer_select).on('changed.bs.select', (e, clickedIndex, isSelected, previousValue)=>{
            this.setState(state=>{
                if(isSelected) {
                    state.deleted_customers = state.deleted_customers.filter(item=>item.id!=this.props.data.select_customers[clickedIndex].id)

                }
                else {
                    state.deleted_customers.push(this.props.data.select_customers[clickedIndex])
                }
                return state
            })

            if(this.request_stations)
                this.request_stations.abort()

            this.request_stations = $.ajax({
                url : '/stations',
                data : {
                    customer_ids : $(e.target).val()
                },
                success : response=>{
                    this.setState(state=>{
                        state.select_airports = response
                        return state
                    })
                    window.setTimeout(()=>{
                        $(this.refs.airport_select).selectpicker("refresh")
                    }, 1)
                }
            })
        });
    }

    removeLogo() {
        this.refs.companylogo.src = nophoto
        $(this.refs.companylogo).attr("checked", true)
    }

    render() {
        return <form action={this.props.data.action} name="frm_user" method="post" className="col-md-12" encType="multipart/form-data">
            <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
            <div className="card">
                <div className="body">
                    <div className="row">
                        <div className="col-md-3 text-center">
                            <img src={this.props.data.thumb?this.props.data.thumb:((this.props.data.profile&&this.props.data.profile.gender!==GENDERMAN)?femme:homme)} className="img-fluid img-thumbnail rounded-circle icon-160" ref="userphoto"/><br/>
                            <input type="file" name="photo" id="photo" className="d-none"/>
                            <label htmlFor="photo" className="bg-primary mouse-pointable mt-3 p-4 rounded text-white">{trans("choisir_une_photo")}</label><br/>
                            <div>
                                <span className="badge badge-danger mr-15">NOTE!</span>
                                <span>Formats : .jpg, .png, .gif</span>
                            </div>
                            <button className="btn btn-danger btn-xs mt-2" type="button" onClick={this.removePhoto}>{trans('supprimer_la_photo')}</button>
                            <input type="checkbox" name="nophoto" ref="nophoto" value="1" className="d-none"/>
                        </div>
                        <div className="col-md-9">
                            <div className="row">
                                <div className="form-group col-3">
                                    <label htmlFor="profile-gender" className="required">{trans("civilite")} <i className="alpha-80 fa fa-lock pl-2 text-orange"></i></label>
                                    <select name="profile[gender]" className="form-control" id="profile-gender" defaultValue={this.props.data.profile?this.props.data.profile.gender:GENDERMAN} required>
                                        <option value="mr">M</option>
                                        <option value="mrs">Mme</option>
                                        <option value="ms">Mlle</option>
                                    </select>
                                </div>
                                <div className="form-group col-5">
                                    <label htmlFor="profile-firstname">{trans("prenom")}</label>
                                    <input name="profile[firstname]" type="text" defaultValue={this.models('props.data.profile.firstname','')} className="form-control" id="profile-firstname" required/>
                                </div>
                                <div className="form-group col-4">
                                    <label htmlFor="profile-lastname">{trans("nom")}</label>
                                    <input type="text" name="profile[lastname]" defaultValue={this.models('props.data.profile.lastname','')} required className="form-control" id="profile-lastname"/>
                                </div>
                                <div className="card">
                                    <div className="card-header">
                                        <i className="fa fa-shield-alt"></i> {trans("informations_statuts")}
                                    </div>
                                    <div className="body">
                                        <div className="row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="contacts-0-ndetail-value">{trans("telephone")}</label>
                                                <input type="text" required defaultValue={this.models('props.data.contacts.bureau.ndetail.value')} className="form-control" id="contacts-0-ndetail-value" name="contacts[bureau][ndetail][value]" />
                                                <input type="hidden" name="contacts[bureau][contact_type]" defaultValue={'phone'}/>
                                                <input type="hidden" name="contacts[bureau][type]" defaultValue={'bureau'}/>
                                                <input type="hidden" name="contacts[bureau][id]" defaultValue={this.models('props.data.contacts.bureau.id')}/>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="contacts-1-ndetail-value">{trans("mobile")}</label>
                                                <input type="text" required className="form-control" id="contacts-1-ndetail-value" name="contacts[mobile][ndetail][value]" defaultValue={this.models('props.data.contacts.mobile.ndetail.value')}/>
                                                <input type="hidden" name="contacts[mobile][contact_type]" defaultValue={'phone'}/>
                                                <input type="hidden" name="contacts[mobile][type]" defaultValue={'mobile'}/>
                                                <input type="hidden" name="contacts[mobile][id]" defaultValue={this.models('props.data.contacts.mobile.id')}/>
                                            </div>
                                            <input type="hidden" name="roles[]" value="4"/>
                                            <div className="form-group col-12">
                                                <label className="text-capitalize control-label">{trans('client')}</label>
                                                <select name="customers[][id]" required multiple className="form-control" ref="customer_select" defaultValue={this.props.data.customers}>
                                                    {this.props.data.select_customers.map(customer=><option key={`customer-${customer.id}`} value={customer.id}>{customer.facturable.name}</option>)}
                                                </select>
                                                {this.state.deleted_customers.map(deleted_customer=><input key={`deleted-customer-${deleted_customer.id}`} type="hidden" name="deleted_customers[][id]" value={deleted_customer.id}/>)}
                                            </div>
                                            <div className="form-group col-12">
                                                <label className="control-label text-capitalize">{trans('station')}</label>
                                                <select className="form-control" name="profile[nsetup][airport_id]" required defaultValue={this.models('props.data.profile.nsetup.airport_id')} ref="airport_select">
                                                    {this.state.select_airports.map(airport=><option key={`select-airport-${airport.id}`} value={airport.id}>{airport.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            {trans('Adresses EDI')}
                        </div>
                        <div className="body">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th className="text-center">A</th>
                                        <th className="text-center">B</th>
                                        <th></th>
                                    </tr>
                                    <tr>
                                        <th>
                                            <div className="form-group position-relative">
                                                <input type="text" className="form-control" value={this.state.search_ediA} onChange={this.handleEdiAChange} onClick={this.handleEdiAChange} autoComplete="astrict"/>
                                                <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_ediA?'show':''}`} style={{maxHeight:200}}>
                                                    {this.state.select_ediAs.map(ediA=><a key={`ediA-${ediA.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectEdiA(e, ediA)}>{ediA.edi_address} ({ediA.party_identifier})</a>)}
                                                </div>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="form-group position-relative">
                                                <input type="text" className="form-control" value={this.state.search_ediB} onChange={this.handleEdiBChange} onClick={this.handleEdiBChange} autoComplete="bstrict"/>
                                                <div className={`dropdown-menu overflow-auto w-100 ${this.state.select_ediB?'show':''}`} style={{maxHeight:200}}>
                                                    {this.state.select_ediBs.map(ediB=><a key={`ediB-${ediB.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelectEdiB(e, ediB)}>{ediB.edi_address} ({ediB.party_identifier})</a>)}
                                                </div>
                                            </div>
                                        </th>
                                        <th className="text-center">
                                            <button type="button" className="btn btn-success mb-3" onClick={this.saveCouple}><i className="fa fa-save"></i></button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.edi_couples.map(edi_couple=><tr key={`edi-couple-${edi_couple.id}`}>
                                        <td>{edi_couple.a.edi_address}</td>
                                        <td>{edi_couple.b.edi_address}</td>
                                        <td>
                                            <input type="hidden" name={`edi_couples[${edi_couple.id}][a_id]`} value={edi_couple.a.id}/>
                                            <input type="hidden" name={`edi_couples[${edi_couple.id}][b_id]`} value={edi_couple.b.id}/>
                                            <button type="button" className="btn btn-danger" onClick={()=>this.removeCouple(edi_couple)}><i className="fa fa-times-circle"></i></button>
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <i className="fa fa-lock"></i> {trans("informations_de_connexion")}
                        </div>
                        <div className="body">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="email">{trans("e_mail")}</label>
                                    <input type="email" className="form-control" id="email" name="email" defaultValue={this.models('props.data.email')} required/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="password">{trans("mot_de_passe")}</label>
                                    <input type="text" className="form-control" id="password" name="password" defaultValue={this.models('props.data.id', false)?'******':''} required/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="justify-content-between m-0 mb-3 row">
                <div className="col-auto">
                    <i className="alpha-80 fa fa-lock pl-2 pr-2 text-orange"></i>
                    <span className="text-orange">{trans('champs_obligatoires')}</span>
                </div>
                <div className="col-auto">
                    <input type="hidden" name="customer_id" value={this.models('props.data.customer_id')}/>
                    <input type="hidden" name="id" value={this.models('props.data.id')}/>
                    <button type="submit" className="btn btn-primary ml-2">{trans('enregistrer')}</button>
                </div>
            </div>
        </form>
    }
}

export default Modelizer(Form);