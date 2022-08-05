import React, {Component} from 'react';
import Modelizer from '../../Core/Modelizer';
import trans from '../../../../app/translations';
import homme from '../../../../medias/images/profil-homme.jpg';
import femme from '../../../../medias/images/profil-femme.jpg';
import Profile from '../../Profile/Form';
import $ from 'jquery';
import swal from 'sweetalert2';

const GENDERMAN = 'mr';

export const TYPELABELS = {
    Airline : trans('Compagnie aérienne'),
    GSA : trans("Société"),
    Road : trans('Road')
}

class Account extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            password : '',
            password_error : false
        }
        this.handlePassword = this.handlePassword.bind(this)
        this.removePhoto = this.removePhoto.bind(this)
		this.header = this.header.bind(this)
    }

    handlePassword(event) {
        const value = event.target.value
        this.setState({
            password : value
        })
    }

    removePhoto() {
        this.refs.userphoto.src = (this.props.data.profile&&this.props.data.profile.gender!==GENDERMAN)?femme:homme
        $(this.refs.nophoto).attr("checked", true)
    }

    componentDidMount() {
        const nophoto = this.refs.nophoto
        $("input:file").change(function(){
            $(nophoto).attr("checked", false)
        });
        this.props.store.subscribe(()=>{
            const storeState = this.props.store.getState()
            if(storeState.type=='users' && storeState.status=='error') {
                this.setState({
                    password_error : storeState.message
                })
            }
            else if(storeState.type=='users' && storeState.row) {
                swal(
                    trans('Modification enregistrée'),
                    trans("Vos changements ont été enregistrés avec succès"),
                    'success'
                )
            }
        })
    }

	header() {
		return <div className="border-bottom header text-large">
	        <i className="fa fa-user-edit"></i> {this.models("props.data.user.name")}<span className="mx-3">-</span>{trans('Statut')} : <span className="text-orange">{this.models("props.data.user.account_type")}</span><span className="mx-3">-</span>{this.models("props.data.user.account_type")} : <span className="text-orange">{this.models("props.data.user.customer_account.facturable.name")}</span>
	    </div>
	}

    render() {
        let required = this.state.password!=''?{required:true}:{}
        return <div className="col-md-12">
            <form action="/update_me" method="post" name="frm_user">
                <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
                <input type="hidden" name="ry"/>
                <div className="card">
                    {this.header()}
                    <div className="body">
                        <div className="row">
                            <div className="col-md-2 text-center">
                                <img src={this.models('props.data.user.thumb', false)?this.props.data.user.thumb:(this.models('props.data.user.profile.gender', false)!==GENDERMAN?femme:homme)} className="img-fluid img-thumbnail rounded-circle icon-160" ref="userphoto"/>
                                <input type="file" name="photo" id="photo" className="d-none"/>
                                <label htmlFor="photo" className="bg-primary mouse-pointable mt-3 p-4 rounded text-white">{trans("Choisir une photo")}</label><br/>
                                <div>
                                    <span className="badge badge-danger mr-15">{trans('NOTE!')}</span>
                                    <span>{trans('Formats')} : .jpg, .png, .gif</span>
                                </div>
                                <button className="btn btn-danger btn-xs mt-2" type="button" onClick={this.removePhoto}>{trans('Supprimer la photo')}</button>
                                <input type="checkbox" name="nophoto" ref="nophoto" value="1" className="d-none"/>
                            </div>
                            <div className="col-md-10">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="row mb-3">
                                            <div className="col-md-3">
                                                <Profile.GenderSelect data={this.models("props.data.user", {
                                                    gender : GENDERMAN
                                                })}/>
                                            </div>
                                            <div className="col-md-4">
                                                <Profile.Firstname default={true} data={this.models("props.data.user.profile", {})}/>
                                            </div>
                                            <div className="col-md-5">
                                                <Profile.Lastname default={true} data={this.models("props.data.user.profile", {})}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6"></div>
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-header">
                                                <i className="fa fa-shield-alt"></i> {trans("Informations & statuts")}
                                            </div>
                                            <div className="body">
                                                <div className="row">
                                                    {this.models('props.data.select_charges')?<div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label">{trans('Fonction')}</label>
                                                            <select name="nsetup[charge]" className="form-control" defaultValue={this.models("props.data.user.customer_account.details.charge",'')}>
                                                                <option key={`user-charge-none`} value="">{trans('Aucun')}</option>
                                                                {this.models('props.data.select_charges', []).map(charge=><option key={`user-charge-${charge.id}`} value={charge.label}>{charge.label}</option>)}
                                                            </select>
                                                        </div>
                                                    </div>:null}
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <Profile.Contact.Phone default={true} data={this.models("props.data.user.contacts.fixe_phone", {})}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <Profile.Contact.Phone default={true} data={this.models("props.data.user.contacts.mobile_phone", {})} schedule="mobile" label={trans('Mobile')}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <Profile.Contact.Fax default={true} data={this.models("props.data.user.contacts.fax_fax", {})}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className='card'>
                                            <div className="card-header">
                                                <i className="fa fa-lock"></i> {trans("Informations de connexion")}
                                            </div>
                                            <div className="body">
                                                {this.state.password_error?<div className="alert alert-danger">{this.state.password_error}</div>:null}
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label justify-content-end">{trans('Email')}</label>
                                                            <input className="form-control" type="email" name="email" defaultValue={this.models("props.data.user.email",'')} required/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label">{trans('Mot de passe actuel')}</label>
                                                            <input type="password" 
                                                            className="form-control" name="password_old" {...required}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label">{trans('Nouveau mot de passe')}</label>
                                                            <input type="password" className="form-control" name="password" id="password" {...required} onChange={this.handlePassword}/>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label className="control-label">{trans('Confirmer le nouveau mot de passe')}</label>
                                                            <input type="password" className="form-control" name="password_confirmation" data-parsley-equalto="#password" {...required}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary">{trans('Enregistrer')}</button>
                </div>
            </form>
        </div>
    }
}

export default Modelizer(Account);