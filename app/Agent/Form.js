import React from 'react';
import BaseUserForm from '../../vendor/Ry/Admin/User/Account';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import homme from '../../medias/images/profil-homme.jpg';
import femme from '../../medias/images/profil-femme.jpg';
import Profile from 'ryvendor/Ry/Profile/Form';
import $ from 'jquery';

const GENDERMAN = 'mr';

class Form extends BaseUserForm
{
  render() {
    let required = this.state.password!=''?{required:true}:{}
    return <div className="col-md-12">
        <form action="/update_me" method="post" name="frm_user">
            <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
            <input type="hidden" name="ry"/>
            <div className="card">
                <div className="border-bottom header text-large">
                    <i className="fa fa-user-edit"></i> {this.models("props.data.user.name")}
                </div>
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
                                <div className="col-md-8">
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
                                <div className="col-md-4"></div>
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="card-header">
                                            <i className="fa fa-shield-alt"></i> {trans("Informations & statuts")}
                                        </div>
                                        <div className="body">
                                          <div className="row">
                                            <label className="col-md-2 text-capitalize text-right pt-2">{trans("Code")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.user.profile.nsetup.code')} className="form-control" name="profile[nsetup][code]" />
                                            </div>
                                            <label className="text-capitalize col-md-2 text-right pt-2">{trans("Pays")}</label>
                                            <div className="form-group col-md-4">
                                                <select required name="profile[adresse][ville][country][id]" defaultValue={this.models('props.data.user.profile.adresse.ville.country.id')} className="form-control">
                                                    {this.props.data.countries.map(country=><option key={`country-${country.id}`} value={country.id}>{country.nom}</option>)}
                                                </select>
                                            </div>
                                            <label className="text-capitalize col-md-2 text-right pt-2">{trans("Adresse")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.user.profile.adresse.raw')} className="form-control" name="profile[adresse][raw]" />
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Téléphone")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.user.contacts.bureau_phone.ndetail.value')} className="form-control" id="contacts-0-ndetail-value" name="contacts[bureau][ndetail][value]" />
                                                <input type="hidden" name="contacts[bureau][contact_type]" defaultValue={'phone'}/>
                                                <input type="hidden" name="contacts[bureau][type]" defaultValue={'bureau'}/>
                                                <input type="hidden" name="contacts[bureau][id]" defaultValue={this.models('props.data.user.contacts.bureau_phone.id')}/>
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Code postal")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.user.profile.adresse.ville.cp')} className="form-control" name="profile[adresse][ville][cp]" />
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Fax")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" className="form-control" id="contacts-1-ndetail-value" name="contacts[fax][ndetail][value]" defaultValue={this.models('props.data.user.contacts.fax_fax.ndetail.value')}/>
                                                <input type="hidden" name="contacts[fax][contact_type]" defaultValue={'fax'}/>
                                                <input type="hidden" name="contacts[fax][type]" defaultValue={'fax'}/>
                                                <input type="hidden" name="contacts[fax][id]" defaultValue={this.models('props.data.user.contacts.fax_fax.id')}/>
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Boîte postale")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" defaultValue={this.models('props.data.user.profile.adresse.raw2')} className="form-control" name="profile[adresse][raw2]" />
                                            </div>
                                            <label htmlFor="email" className="col-md-2 text-right pt-2">{trans("Email")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="email" className="form-control" id="email" name="email" defaultValue={this.models('props.data.user.email')} required/>
                                            </div>
                                            <label className="col-md-2 text-right pt-2">{trans("Ville")}</label>
                                            <div className="form-group col-md-4">
                                                <input type="text" required defaultValue={this.models('props.data.user.profile.adresse.ville.nom')} className="form-control" name="profile[adresse][ville][nom]" />
                                            </div>
                                            <label className="text-capitalize col-md-2 text-right pt-2">{trans("Langue")}</label>
                                            <div className="form-group col-md-4">
                                                <select required name="profile[languages]" defaultValue={this.models('props.data.user.profile.languages', 'fr')} className="form-control">
                                                    {this.props.data.select_langs.map(lang=><option key={`lang-${lang.id}`} value={lang.code}>{lang.french}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className='card'>
                                        <div className="card-header">
                                            <i className="fa fa-lock"></i> {trans("Informations de connexion")}
                                        </div>
                                        <div className="body">
                                            {this.state.password_error?<div className="alert alert-danger">{this.state.password_error}</div>:null}
                                            <div className="form-group">
                                                <label className="control-label">{trans('Mot de passe actuel')}</label>
                                                <input type="password" 
                                                className="form-control" name="password_old" {...required}/>
                                            </div>
                                            <div className="form-group">
                                                <label className="control-label">{trans('Nouveau mot de passe')}</label>
                                                <input type="password" className="form-control" name="password" id="password" {...required} onChange={this.handlePassword}/>
                                            </div>
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
            <div className="d-flex justify-content-end">
                <button className="btn btn-primary">{trans('Enregistrer')}</button>
            </div>
        </form>
    </div>
  }
}

export default Modelizer(Form);