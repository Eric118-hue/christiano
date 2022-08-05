import React, {Component} from 'react';
import trans from '../../../../app/translations';
import Profile from '../../Profile/Form';
import $ from 'jquery';
import Modelizer from '../../Core/Modelizer';

const GENDERMAN = 'mr';
const CONTACT_PROTO = {
    email : '',
    profile : {
        firstname : '',
        lastname : '',
        gender : GENDERMAN
    },
    nsetup : {
        charge : ''
    },
    contacts : {
        bureau : {
            id : 0,
            ndetail : {
                value : '',
                type : 'phone',
                schedule : 'bureau'
            }
        },
        mobile : {
            id : 0,
            ndetail : {
                value : '',
                type : 'phone',
                schedule : 'mobile'
            }
        },
        fax: {
            id : 0,
            ndetail : {
                value : '',
                type : 'fax',
                schedule : 'fax'
            }
        }
    }
}

class Userline extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            optional : this.props.optional,
            email : this.models("props.data.email", '')
        }
        this.handleMailFull = this.handleMailFull.bind(this)
    }

    handleMailFull(event) {
        const value = event.target.value
        this.setState({
            email : value,
            optional : value!='' ? false : true
        })
    }

    componentDidMount() {
        $('label').centraleValidate()
        $('select').not(".select-default").selectpicker({
            noneSelectedText: '--',
            container: 'body'
        });
    }

    render() {
        const emailRequired = this.state.optional ? {} : {required:true}
        const prefix = this.props.namespace ? this.props.namespace + '[users]' : 'users'
        return <div className="card">
        <div className="card-header">
            <div className="row m-0 justify-content-between">
                <strong>{trans('Contact auxiliaire', {index:this.props.num})}</strong>
                {this.models('props.data.login', false)?<a href={this.models('props.data.login')} className="text-blue" target="_blank">{trans('Connexion')} <i className="fa fa-cog"></i></a>:null}
            </div>
        </div>
        <div className="card-body">
            <div className="row">
                <div className="col-md-6">
                    <div className="form-inline mb-3">
                        <label className="control-label col-md-3 justify-content-end">{trans('Email')}</label>
                        <div className="col-md-9">
                            <input className="form-control w-100" type="email" name={prefix + `[${this.props.pkey}][email]`} value={this.state.email} onChange={this.handleMailFull} {...emailRequired}/>
                        </div>
                    </div>
                    <div className="form-inline mb-3">
                        <Profile.Gender data={this.models("props.data.profile", {})} baseName={prefix + `[${this.props.pkey}]`}/>
                    </div>
                    <div className="form-inline mb-3">
                        <Profile.Firstname data={this.models("props.data.profile", {})} baseName={prefix + `[${this.props.pkey}]`} optional={this.state.optional}/>
                    </div>
                    <div className="form-inline mb-3">
                        <Profile.Lastname data={this.models("props.data.profile", {})} baseName={prefix + `[${this.props.pkey}]`} optional={this.state.optional}/>
                    </div>
                    {(this.props.fwbCancelledNotifyUsers && this.props.data.id)?<div className="custom-control custom-switch pt-4">
                        <input type="checkbox" name={this.props.fwbCancelledNotifyUsersFieldName} value={this.props.data.id} className={`custom-control-input`} id={`user-toggle-fwb_cancelled_notify_users-${this.props.data.id}`} defaultChecked={this.models('props.fwbCancelledNotifyUsers', []).find(it=>it==this.models("props.data.id", -1))}/>
                        <label className="custom-control-label" htmlFor={`user-toggle-fwb_cancelled_notify_users-${this.props.data.id}`}>{trans("Cardit 1")}</label>
                    </div>:null}
                </div>
                <div className="col-md-6">
                    <div className="form-inline mb-3">
                        <label className="control-label col-md-3 justify-content-end">{trans('Fonction')}</label>
                        <div className="col-md-9">
                            <select name={prefix + `[${this.props.pkey}][nsetup][charge]`} className="form-control" defaultValue={this.models("props.data.nsetup.charge", '')}>
                                <option key={`user-${this.props.pkey}-charge-none`} value="">{trans('Aucun')}</option>
                                {this.models('props.selectCharges', []).map(charge=><option key={`user-${this.props.pkey}-charge-${charge.id}`} value={charge.label}>{charge.label}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-inline mb-3">
                        <Profile.Contact.Phone data={this.models('props.data.contacts.fixe_phone', {})} baseName={prefix + `[${this.props.pkey}]`}/>
                    </div>
                    <div className="form-inline mb-3">
                        <Profile.Contact.Phone label={trans('Mobile')} data={this.models('props.data.contacts.mobile_phone', {})} baseName={prefix + `[${this.props.pkey}]`} schedule="mobile"/>
                    </div>
                    <div className="form-inline mb-3">
                        <Profile.Contact.Fax data={this.models('props.data.contacts.fax_fax', {})} baseName={prefix + `[${this.props.pkey}]`}/>
                    </div>
                </div>
            </div>
        </div>
        <div className="card-footer text-right">
            <input type="hidden" name={prefix + `[${this.props.pkey}][id]`} value={this.models("props.data.id",'')}/>
            <button className="btn btn-danger" type="button" onClick={this.props.remove}>{trans('Supprimer le contact')} <i className="fa fa-trash-alt"></i></button>
        </div>
    </div>
    }
}

Modelizer(Userline);

class Multiform extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            contacts: this.models('props.data.users', []),
            optional: this.props.optional,
            email: this.models("props.data.main_user.email",'')
        }
        this.addContactLine = this.addContactLine.bind(this)
        this.removeContactLine = this.removeContactLine.bind(this)
        this.handleMailFull = this.handleMailFull.bind(this)
    }

    handleMailFull(event) {
        const value = event.target.value
        this.setState({
            email : value,
            optional : value!='' ? false : true
        })
    }

    addContactLine() {
        this.setState((state) => {
            let proto = JSON.parse(JSON.stringify(CONTACT_PROTO))
            let ar = []
            state.contacts.map(contact=>ar.push(contact.id ? contact.id : contact.tempid ? contact.tempid : 0))
            proto.tempid = ar.length > 0 ? Math.max(...ar) + 1 : 0
            state.contacts.push(proto);
            return state
        })
    }

    removeContactLine(user) {
        const dis = this
        this.props.remove(user, response=>{
            dis.setState(state=>{
                state.contacts = state.contacts.filter(contact=>{
                    if(user.id && user.id>0)
                        return contact.id!=user.id
                    return contact.tempid!=user.tempid
                })
                return state
            })
        })
    }

    render() {
        const emailRequired = this.state.optional ? {} : {required:true}
        const prefix = this.props.namespace ? this.props.namespace + '[main_user]' : 'main_user'
        return <React.Fragment>
            <div className="card">
                <div className="card-header">
                    <div className="row m-0 justify-content-between">
                        <strong>{trans('Contact principal')}</strong>
                        {this.models('props.data.main_user.login', false)?<a href={this.models('props.data.main_user.login')} className="text-blue" target="_blank">{trans('Connexion')} <i className="fa fa-cog"></i></a>:null}
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-inline mb-3">
                                <label className="control-label col-md-3 justify-content-end">{trans('Email')}</label>
                                <div className="col-md-9">
                                    <input className="form-control w-100" type="email" name={prefix + "[email]"} value={this.state.email} onChange={this.handleMailFull} {...emailRequired}/>
                                </div>
                            </div>
                            <div className="form-inline mb-3">
                                <Profile.Gender data={this.models("props.data.main_user.profile", {
                                    gender : GENDERMAN
                                })} baseName={prefix}/>
                            </div>
                            <div className="form-inline mb-3">
                                <Profile.Firstname data={this.models("props.data.main_user.profile", {})} baseName={prefix} optional={this.state.optional}/>
                            </div>
                            <div className="form-inline mb-3">
                                <Profile.Lastname data={this.models("props.data.main_user.profile", {})} baseName={prefix} optional={this.state.optional}/>
                            </div>
                            {this.props.fwbCancelledNotifyUsers?<div className='form-inline mb-3'>
                                <div className="custom-control custom-switch pt-4">
                                    <input type="checkbox" name={this.props.fwbCancelledNotifyUsersFieldName} value={this.models("props.data.main_user.id")} className={`custom-control-input`} id={`user-toggle-fwb_cancelled_notify_users-${this.models('props.data.main_user.id')}`} defaultChecked={this.models('props.fwbCancelledNotifyUsers', []).find(it=>it==this.models("props.data.main_user.id", -1))}/>
                                    <label className="custom-control-label" htmlFor={`user-toggle-fwb_cancelled_notify_users-${this.models('props.data.main_user.id')}`}>{trans("Cardit 1")}</label>
                                </div>
                            </div>:null}
                        </div>
                        <div className="col-md-6">
                            <div className="form-inline mb-3">
                                <label className="control-label col-md-3 justify-content-end">{trans('Fonction')}</label>
                                <div className="col-md-9">
                                    <select name={prefix + "[nsetup][charge]"} className="form-control" defaultValue={this.models("props.data.main_user.nsetup.charge",'')}>
                                        <option key={`mainUser-charge-none`} value="">{trans('Aucun')}</option>
                                        {this.models('props.data.select_charges', []).map(charge=><option key={`mainUser-charge-${charge.id}`} value={charge.label}>{charge.label}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="form-inline mb-3">
                                <Profile.Contact.Phone data={this.models("props.data.main_user.contacts.fixe_phone", {})} baseName={prefix}/>
                            </div>
                            <div className="form-inline mb-3">
                                <Profile.Contact.Phone data={this.models("props.data.main_user.contacts.mobile_phone", {})} baseName={prefix} schedule="mobile" label={trans('Mobile')}/>
                            </div>
                            <div className="form-inline mb-3">
                                <Profile.Contact.Fax data={this.models("props.data.main_user.contacts.fax_fax", {})} baseName={prefix}/>
                            </div>
                        </div>
                    </div>
                </div>
                <input type="hidden" name={prefix + `[id]`} value={this.models("props.data.main_user.id",'')}/>
            </div>
            <button type="button" className="btn btn-primary mb-4" onClick={this.addContactLine}><i className="fa fa-plus"></i> {trans('Ajouter un contact auxiliaire')}</button>
            {this.state.contacts.filter(item=>(item.tempid!=this.models("props.data.main_user.id", -1))).map((user, key)=><Userline namespace={this.props.namespace} optional={this.props.optional} selectCharges={this.models('props.data.select_charges', [])} key={`user-${user.tempid>=0?user.tempid:user.id}`} num={key+1} pkey={`${user.tempid}-${key}`} data={user} fwbCancelledNotifyUsers={this.props.fwbCancelledNotifyUsers} fwbCancelledNotifyUsersFieldName={this.props.fwbCancelledNotifyUsersFieldName} remove={()=>this.removeContactLine(user)}/>)}
            {this.state.contacts.filter(item=>(item.tempid!=this.models("props.data.main_user.id"))).length>0?<button type="button" className="btn btn-primary mb-4" onClick={this.addContactLine}><i className="fa fa-plus"></i> {trans('Ajouter un contact auxiliaire')}</button>:null}
        </React.Fragment>
    }
}

export default Modelizer(Multiform);
