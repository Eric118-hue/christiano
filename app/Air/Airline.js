import React, {Component} from 'react';
import NavigableModel from '../../vendor/Ry/Core/NavigableModel'
import trans, {nophoto} from '../../app/translations';
import AdminUser from '../../vendor/Ry/Admin/User';
import {GENDERMAN} from '../../vendor/Ry/Admin/User/constants';
import homme from '../../medias/images/profil-homme.jpg';
import femme from '../../medias/images/profil-femme.jpg';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import $ from 'jquery';

class UserForm extends AdminUser
{
    constructor(props) {
        super(props)
        this.state = {
            airline : '',
            filter_airlines : [],
            airlines : this.models('props.data.company.airlines', []),
            deleted_airlines : []
        }
        this.removeLogo = this.removeLogo.bind(this)
        this.filterAirline = this.filterAirline.bind(this)
        this.addAirline = this.addAirline.bind(this)
        this.removeAirline = this.removeAirline.bind(this)
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
    }

    removeLogo() {
        this.refs.companylogo.src = nophoto
        $(this.refs.companylogo).attr("checked", true)
    }

    render() {
        return <form action={this.props.data.action} name="frm_user" method="post" encType="multipart/form-data">
            <div className="modal-header">
                <h5 className="modal-title"><i className="fa fa-user-edit"></i> {this.props.data.name?this.props.data.name:this.props.data.add_role}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="row">
                    <div className="col-md-4 text-center">
                        <div>
                            <img src={this.props.data.thumb?this.props.data.thumb:((this.props.data.profile&&this.props.data.profile.gender!==GENDERMAN)?femme:homme)} className="img-fluid img-thumbnail rounded-circle icon-160" ref="userphoto"/>
                            <input type="file" name="photo" id="photo" className="d-none"/>
                            <label htmlFor="photo" className="bg-primary mouse-pointable mt-3 p-4 rounded text-white">{trans("choisir_une_photo")}</label><br/>
                            <div>
                                <span className="badge badge-danger mr-15">NOTE!</span>
                                <span>Formats : .jpg, .png, .gif</span>
                            </div>
                            <button className="btn btn-danger btn-xs mt-2" type="button" onClick={this.removePhoto}>{trans('supprimer_la_photo')}</button>
                            <input type="checkbox" name="nophoto" ref="nophoto" value="1" className="d-none"/>
                        </div>
                        <hr className="border"/>
                        <div>
                            <img src={this.models('props.data.company.logo.fullpath', nophoto)} className="img-fluid img-thumbnail rounded-circle icon-160" ref="companylogo"/>
                            <input type="file" name="logo" id="logo" className="d-none"/>
                            <label htmlFor="logo" className="bg-secondary mouse-pointable mt-3 p-4 rounded text-white">{trans("logo_de_la_societe")}</label><br/>
                            <div>
                                <span className="badge badge-danger mr-15">NOTE!</span>
                                <span>Formats : .jpg, .png, .gif</span>
                            </div>
                            <button className="btn btn-danger btn-xs mt-2" type="button" onClick={this.removeLogo}>{trans('supprimer_le_logo')}</button>
                            <input type="checkbox" name="nologo" ref="nologo" value="1" className="d-none"/>
                        </div>
                    </div>
                    <div className="col-md-8">
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
                                <input name="profile[firstname]" type="text" defaultValue={this.props.data.profile?this.props.data.profile.firstname:''} className="form-control" id="profile-firstname" required/>
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="profile-lastname">{trans("nom")}</label>
                                <input type="text" name="profile[lastname]" defaultValue={this.props.data.profile?this.props.data.profile.lastname:''} required className="form-control" id="profile-lastname"/>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-building"></i> {trans('informations_societe')}
                            </div>
                            <div className="body">
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label>{trans('societe')}</label>
                                        <input required type="text" name="company[name]" defaultValue={this.models('props.data.company.name', '')} className="form-control"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>{trans('code_societe')}</label>
                                        <input type="text" name="company[nsetup][code]" defaultValue={this.models('props.data.company.nsetup.code', '')} className="form-control"/>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label>{trans('adresse')}</label>
                                        <input type="text" name="company[adresse][raw]" defaultValue={this.models('props.data.company.adresse.raw', '')} className="form-control"/>
                                        <input type="hidden" name="company[adresse][id]" defaultValue={this.models('props.data.company.adresse.id')}/>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label>{trans('complement_dadresse')}</label>
                                        <input type="text" name="company[adresse][raw2]" defaultValue={this.models('props.data.company.adresse.raw2', '')} className="form-control"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>{trans('code_postal')}</label>
                                        <input type="text" name="company[adresse][ville][cp]" defaultValue={this.models('props.data.company.adresse.ville.cp', '')} className="form-control"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>{trans('ville')}</label>
                                        <input type="text" name="company[adresse][ville][nom]" defaultValue={this.models('props.data.company.adresse.ville.nom', '')} className="form-control"/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>{trans('pays')}</label>
                                        <select name="company[adresse][ville][country][id]" className="form-control" defaultValue={this.models('props.data.company.adresse.ville.country.id')}>
                                            {this.props.data.countries.map((country => <option
                                                key={`country-${country.id}`}
                                                value={country.id}>{country.nom}</option>))}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label>{trans('statut_de_lentreprise')}</label>
                                        <select className="form-control" name="company[nsetup][legal_entity]" title={trans('choisissez')} defaultValue={this.models('props.data.company.nsetup.legal_entity', '')}>
                                            {this.props.data.legal_entities.map(legal_entity=><option key={`legal-entity-${legal_entity.id}`}>{legal_entity.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group col-md-12">
                                        <label>{trans('SIRET')}</label>
                                        <input type="text" name="company[nsetup][siret]" defaultValue={this.models('props.data.company.nsetup.siret')} className="form-control"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-plane"></i> {trans('compagnies_aeriennes')}
                            </div>
                            <div className="body">
                                {this.state.deleted_airlines.map(airline=><input key={`deleted-airlines-${airline.id}`} type="hidden" name="deleted_airlines[][id]" value={airline.id}/>)}
                                <div className="row">
                                    {this.state.airlines.map(airline=><div key={`airline-${airline.id}`} className="col-md-6">
                                        <div className="border rounded m-2 p-2 mouse-pointable" onClick={()=>this.removeAirline(airline)}>
                                            <div className="row m-0">
                                                <div className="col">
                                                    {airline.name} 
                                                </div>
                                                <i className="fa fa-times text-danger"></i>
                                            </div>
                                        </div>
                                        <input type="hidden" name="airlines[][id]" value={airline.id}/>
                                    </div>)}
                                </div>
                                <div className="bg-stone rounded p-1">
                                    <div className="form-group">
                                        <input type="text" value={this.state.airline} onChange={this.filterAirline} className="form-control" placeholder={trans('filtre_rapide')}/>
                                    </div>
                                    <div className="row">
                                        {this.state.filter_airlines.map(airline=><div key={`airline-${airline.id}`} className="col-md-6">
                                            <div className="border rounded m-2 p-2 mouse-pointable" onClick={()=>this.addAirline(airline)}>
                                                <div className="row m-0">
                                                    <div className="col">
                                                        {airline.name} 
                                                    </div>
                                                    <i className="fa fa-plus-circle text-success"></i>
                                                </div>
                                            </div>
                                        </div>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-shield-alt"></i> {trans("informations_statuts")}
                            </div>
                            <div className="body">
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="contacts-0-coord">{trans("telephone")}</label>
                                        <input type="text" required defaultValue={(this.props.data.contacts && this.props.data.contacts.length>0)?this.props.data.contacts[0].ndetail.value:''} className="form-control" id="contacts-0-coord" name="contacts[0][coord]" />
                                        <input type="hidden" name="contacts[0][contact_type]" defaultValue={(this.props.data.contacts && this.props.data.contacts.length>0)?this.props.data.contacts[0].ndetail.type:'phone'}/>
                                        <input type="hidden" name="contacts[0][type]" defaultValue={(this.props.data.contacts && this.props.data.contacts.length>0)?this.props.data.contacts[0].ndetail.schedule:'bureau'}/>
                                        <input type="hidden" name="contacts[0][id]" defaultValue={(this.props.data.contacts && this.props.data.contacts.length>0)?this.props.data.contacts[0].id:''}/>
                                    </div>
                                    <div className="form-group col-md-6">
                                        <label htmlFor="contacts-1-coord">{trans("mobile")}</label>
                                        <input type="text" required className="form-control" id="contacts-1-coord" name="contacts[1][coord]" defaultValue={(this.props.data.contacts && this.props.data.contacts.length>1)?this.props.data.contacts[1].ndetail.value:''}/>
                                        <input type="hidden" name="contacts[1][contact_type]" defaultValue={(this.props.data.contacts && this.props.data.contacts.length>1)?this.props.data.contacts[1].ndetail.type:'phone'}/>
                                        <input type="hidden" name="contacts[1][type]" defaultValue={(this.props.data.contacts && this.props.data.contacts.length>1)?this.props.data.contacts[1].ndetail.schedule:'mobile'}/>
                                        <input type="hidden" name="contacts[1][id]" defaultValue={(this.props.data.contacts && this.props.data.contacts.length>1)?this.props.data.contacts[1].id:''}/>
                                    </div>
                                    <div className="form-group col-12 text-capitalize">
                                        <label htmlFor="contacts-1-coord" className="required">{trans("statut")} <i className="alpha-80 fa fa-lock pl-2 text-orange"></i></label>
                                        <select name="roles[]" required className="form-control" id="roles" defaultValue={this.models('props.data.roles', []).length>0?this.props.data.roles[0].id:''} onChange={this.checkIfBuyer}>
                                            {this.props.data.select_roles.map((role)=><option key={`edit-user-role-${role.id}`} value={role.id} className="text-capitalize">{trans(role.name)}</option>)}
                                        </select>
                                        <input type="hidden" name="user_role_id" defaultValue={this.models('props.data.roles', []).length==1 && this.props.data.roles[0].pivot ? this.props.data.roles[0].pivot.id : ''}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-lock"></i> {trans("informations_de_connexion")}
                            </div>
                            <div className="body">
                                <div className="row">
                                    <div className="form-group col-md-6">
                                        <label htmlFor="email">{trans("e_mail")}</label>
                                        <input type="email" className="form-control" id="email" name="email" defaultValue={this.props.data.email} required/>
                                    </div>
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
                    <input type="hidden" name="id" defaultValue={this.props.data.id}/>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">{trans('annuler')}</button>
                    <button type="submit" className="btn btn-primary ml-2">{trans('enregistrer')}</button>
                </div>
            </div>
        </form>
    }
}

Modelizer(UserForm);

class Item extends Component
{
    render() {
        return <tr>
            <td>{this.props.data.iata_code}</td>
            <td>{this.props.data.name}</td>
        </tr>
    }
}

class List extends NavigableModel
{
    constructor(props) {
        super(props)
        this.state.filter = {
            iata_code : '',
            name : ''
        }
        this.model = 'airlines'
        this.endpoint = '/airlines'
        this.onFilter = this.onFilter.bind(this)
        this.data = {
            json : true,
            s : {}
        }
    }

    beforelist() {
        return <div></div>
    }

    afterlist() {
        return this.beforelist()
    }

    onFilter(event, field) {
        const value = event.target.value
        this.setState(state=>{
            state.filter[field] = value
            return state
        })
        this.data.s[field] = value
        if(this.request) {
            this.request.abort()
        }
        this.request = $.ajax({
            url : this.endpoint,
            data : this.data,
            success : response=>{
                this.props.store.dispatch({...response})
            }
        })
    }

    item(airline, key) {
        return <Item key={`airline-${airline.id}`} data={airline}/>
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

        return <div className="col-12">            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {this.nopaginate?null:pagination}
            </div>
            {this.searchEngine()}
            <div className="card mt-3">
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th className="text-capitalize">{trans('Code')}</th>
                                <th className="text-capitalize">{trans('Nom')}</th>
                            </tr>
                            <tr className="bg-yellow">
                                <th>
                                    <input type="search" value={this.state.filter.iata_code} onChange={e=>this.onFilter(e, 'iata_code')} className="form-control text-capitalize" placeholder={trans('filtre')}/>
                                </th>
                                <th>
                                    <input type="search" value={this.state.filter.name} onChange={e=>this.onFilter(e, 'name')} className="form-control text-capitalize" placeholder={trans('filtre')}/>
                                </th>
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

class Airline extends Component
{
    render() {
        return <List data={this.props.data.data} store={this.props.store}/>
    }
}

const Components = {
    List : Airline,
    User : UserForm
}

export default Components