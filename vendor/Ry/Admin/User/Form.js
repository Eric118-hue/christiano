import React, { Component } from 'react';
import trans from '../../../../app/translations';
import homme from '../../../../medias/images/profil-homme.jpg';
import femme from '../../../../medias/images/profil-femme.jpg';
import $ from 'jquery';
import {GENDERMAN} from './constants';
import Modelizer from '../../Core/Modelizer';

export class EditUserDialog extends Component
{
    constructor(props) {
        super(props)
        this.removePhoto = this.removePhoto.bind(this)
    }

    componentDidMount() {
        const nophoto = this.refs.nophoto
        $("input:file").change(function(){
            $(nophoto).attr("checked", false)
        });
    }

    removePhoto() {
        this.refs.userphoto.src = (this.props.data.profile&&this.props.data.profile.gender!==GENDERMAN)?femme:homme
        $(this.refs.nophoto).attr("checked", true)
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
                        <img src={this.props.data.thumb?this.props.data.thumb:((this.props.data.profile&&this.props.data.profile.gender!==GENDERMAN)?femme:homme)} className="img-fluid img-thumbnail rounded-circle icon-160" ref="userphoto"/>
                        <input type="file" name="photo" id="photo" className="d-none"/>
                        <label htmlFor="photo" className="bg-primary mouse-pointable mt-3 p-4 rounded text-white">{trans("Choisir une photo")}</label><br/>
                        <div>
                            <span className="badge badge-danger mr-15">{trans('NOTE!')}</span>
                            <span>{trans('Formats')} : .jpg, .png, .gif</span>
                        </div>
                        <button className="btn btn-danger btn-xs mt-2" type="button" onClick={this.removePhoto}>{trans('Supprimer la photo')}</button>
                        <input type="checkbox" name="nophoto" ref="nophoto" value="1" className="d-none"/>
                        {this.props.data.guard?<input type="hidden" name="roles[]" value={this.props.data.guard.id}/>:<div className="form-group mt-3 text-capitalize">
                            <label htmlFor="statut" className="required">{trans("Fonction")} <i className="alpha-80 fa fa-lock pl-2 text-orange"></i></label>
                            <select name="roles[]" required className="form-control" id="roles" defaultValue={this.models('props.data.roles', []).length>0?this.props.data.roles[0].id:''} onChange={this.checkIfBuyer}>
                                {this.props.data.select_roles.map((role)=><option key={`edit-user-role-${role.id}`} value={role.id} className="text-capitalize">{trans(role.name)}</option>)}
                            </select>
                            <input type="hidden" name="user_role_id" defaultValue={this.models('props.data.roles', []).length==1 && this.props.data.roles[0].pivot ? this.props.data.roles[0].pivot.id : ''}/>
                        </div>}
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="form-group col-3">
                                <label htmlFor="profile-gender" className="required">{trans("Civilité")} <i className="alpha-80 fa fa-lock pl-2 text-orange"></i></label>
                                <select name="profile[gender]" className="form-control" id="profile-gender" defaultValue={this.props.data.profile?this.props.data.profile.gender:GENDERMAN} required>
                                    <option value="mr">{trans('M')}</option>
                                    <option value="mrs">{trans('Mme')}</option>
                                    <option value="ms">{trans('Mlle')}</option>
                                </select>
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="profile-firstname">{trans("Prénom")}</label>
                                <input name="profile[firstname]" type="text" defaultValue={this.props.data.profile?this.props.data.profile.firstname:''} className="form-control" id="profile-firstname" required/>
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="profile-lastname">{trans("Nom")}</label>
                                <input type="text" name="profile[lastname]" defaultValue={this.props.data.profile?this.props.data.profile.lastname:''} required className="form-control" id="profile-lastname"/>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-shield-alt"></i> {trans("Informations & statuts")}
                            </div>
                            <div className="body">
                                <div className="row">
                                    <div className="form-group col-6">
                                        <label htmlFor="contacts-bureau-coord">{trans("Téléphone")}</label>
                                        <input type="text" required defaultValue={this.models("props.data.contacts.bureau_phone.ndetail.value", '')} className="form-control" id="contacts-bureau-coord" name="contacts[bureau][ndetail][value]" />
                                        <input type="hidden" name="contacts[bureau][contact_type]" defaultValue={this.models("props.data.contacts.bureau_phone.ndetail.type",'phone')}/>
                                        <input type="hidden" name="contacts[bureau][id]" defaultValue={this.models("props.data.contacts.bureau_phone.id",'')}/>
                                    </div>
                                    <div className="form-group col-6">
                                        <label htmlFor="contacts-mobile-coord">{trans("Mobile")}</label>
                                        <input type="text" required className="form-control" id="contacts-mobile-coord" name="contacts[mobile][ndetail][value]" defaultValue={this.models("props.data.contacts.mobile_phone.ndetail.value", '')}/>
                                        <input type="hidden" name="contacts[mobile][contact_type]" defaultValue={this.models("props.data.contacts.mobile_phone.ndetail.type", 'phone')}/>
                                        <input type="hidden" name="contacts[mobile][id]" defaultValue={this.models("props.data.contacts.mobile_phone.id", '')}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-lock"></i> {trans("Informations de connexion")}
                            </div>
                            <div className="body">
                                <div className="row">
                                    <div className="form-group col-6">
                                        <label htmlFor="email">{trans("Email")}</label>
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
                    <span className="text-orange">{trans('Champs obligatoires')}</span>
                </div>
                <div className="col-auto">
                    <input type="hidden" name="id" defaultValue={this.props.data.id}/>
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">{trans('Annuler')}</button>
                    <button type="submit" className="btn btn-primary ml-2">{trans('Enregistrer')}</button>
                </div>
            </div>
        </form>
    }
}

Modelizer(EditUserDialog)

export class EditCentraleUserDialog extends EditUserDialog
{
    render() {
        return <React.Fragment>
            <div className="modal-header">
                <h5 className="modal-title"><i className="fa fa-user-edit"></i> {this.props.data.name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                <div className="row">
                    <div className="col-4 text-center">
                        <img src={this.props.data.thumb?this.props.data.thumb:(this.props.data.profile.gender===GENDERMAN?homme:femme)} className="img-fluid img-thumbnail rounded-circle icon-160"/>
                        <input type="file" name="photo" id="photo" className="d-none"/>
                        <label htmlFor="photo" className="bg-primary mouse-pointable mt-3 p-4 rounded text-white">{trans("Choisir une photo")}</label>
                    </div>
                    <div className="col-8">
                        <div className="row">
                            <div className="form-group col-2">
                                <label htmlFor="profile-gender">{trans("Civilité")}</label>
                                <select name="profile[gender]" className="form-control" id="profile-gender" defaultValue={this.props.data.profile.gender}>
                                    <option value="mr">{trans('M')}</option>
                                    <option value="mrs">{trans('Mme')}</option>
                                    <option value="ms">{trans('Mlle')}</option>
                                </select>
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="profile-firstname">{trans("Prénom")}</label>
                                <input name="profile[firstname]" type="text" defaultValue={this.props.data.profile.firstname} className="form-control" id="profile-firstname"/>
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="profile-lastname">{trans("Nom")}</label>
                                <input type="text" name="profile[lastname]" defaultValue={this.props.data.profile.lastname} required className="form-control" id="profile-lastname"/>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-shield-alt"></i> {trans("Informations & statuts")}
                            </div>
                            <div className="body">
                                <div className="row">
                                    <div className="form-group col-6">
                                        <label htmlFor="contacts-fixe-coord">{trans("Téléphone")}</label>
                                        <input type="text" defaultValue={this.props.data.contacts.fixe_phone.ndetail.value} className="form-control" id="contacts-fixe-coord" name="contacts[fixe][ndetail][value]" />
                                        <input type="hidden" name="contacts[fixe][contact_type]" defaultValue={this.models("props.data.contacts.fixe_phone.ndetail.type")}/>
                                        <input type="hidden" name="contacts[fixe][id]" defaultValue={this.props.data.contacts.fixe_phone.id}/>
                                    </div>
                                    <div className="form-group col-6">
                                        <label htmlFor="contacts-mobile-coord">{trans("Mobile")}</label>
                                        <input type="text" className="form-control" id="contacts-mobile-coord" name="contacts[mobile][ndetail][value]" defaultValue={this.models("props.data.contacts.mobile_phone.ndetail.value")}/>
                                        <input type="hidden" name="contacts[mobile][contact_type]" defaultValue={this.props.data.contacts.mobile_phone.ndetail.type}/>
                                        <input type="hidden" name="contacts[mobile][id]" defaultValue={this.props.data.contacts.mobile_phone.id}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <i className="fa fa-lock"></i> {trans("Informations de connexion")}
                            </div>
                            <div className="body">
                                <div className="row">
                                    <div className="form-group col-6">
                                        <label htmlFor="email">{trans("Email")}</label>
                                        <input type="email" className="form-control" id="email" name="email" defaultValue={this.props.data.email}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <input type="hidden" name="id" defaultValue={this.props.data.id}/>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">{trans('Annuler')}</button>
                <button type="submit" className="btn btn-primary">{trans('Enregistrer')}</button>
            </div>
        </React.Fragment>
    }
}

export default EditUserDialog;
