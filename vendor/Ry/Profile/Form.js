import React, {Component} from 'react';
import trans, {genders} from '../../../app/translations';
import PropTypes from 'prop-types';
import Modelizer from '../Core/Modelizer';

const GENDERMAN = 'mr';

const ProfileProps = {
    baseName : PropTypes.string,
    data : PropTypes.object.isRequired
}

const ContactProps = {
    data : PropTypes.object.isRequired,
    validations : PropTypes.object,
    baseName : PropTypes.string,
    schedule : PropTypes.string,
    label : PropTypes.string
}

class GenderSelect extends Component
{
    render() {
        const basename = this.props.baseName ? this.props.baseName + '[profile]' : 'profile'
        return <React.Fragment>
            <label>{trans("Civilité")}</label>
            <select name={`${basename}[gender]`} className="form-control"
                    defaultValue={this.props.data ? this.props.data.profile.gender : GENDERMAN}>
                <option value="mr">{trans('M')}</option>
                <option value="mrs">{trans('Mme')}</option>
                <option value="ms">{trans('Mlle')}</option>
            </select>
        </React.Fragment>
    }
}

class Gender extends Component
{
    render() {
        const basename = this.props.baseName ? this.props.baseName + '[profile]' : 'profile'
        return <React.Fragment>
            <label className="control-label col-md-3 justify-content-end">{trans('Civilité')}</label>
            <div className="col-md-3">
                <label className="fancy-radio custom-color-green"><input name={`${basename}[gender]`} value="mr" type="radio" defaultChecked={this.props.data.gender=='mr'}/><span><i></i>{genders['mr']}</span></label>
            </div>
            <div className="col-md-3">
                <label className="fancy-radio custom-color-green"><input name={`${basename}[gender]`} value="mrs" type="radio" defaultChecked={this.props.data.gender=='mrs'}/><span><i></i>{genders['mrs']}</span></label>
            </div>
            <div className="col-md-3">
                <label className="fancy-radio custom-color-green"><input name={`${basename}[gender]`} value="ms" type="radio" defaultChecked={this.props.data.gender=='ms'}/><span><i></i>{genders['ms']}</span></label>
            </div>
        </React.Fragment>
    }
}

Gender.propTypes = ProfileProps

class Textinput extends Component
{
    render() {
        const basename = this.props.baseName ? (this.props.baseName + '[profile]') : 'profile'
        const required = this.props.optional ? {} : {required:true}
        if(this.props.default) {
            return <React.Fragment>
                <label className="control-label">{this.props.label}</label>
                <input className="form-control" type="text" name={`${basename}[${this.props.name}]`} defaultValue={this.props.data[this.props.name]} {...required}/>
            </React.Fragment>
        }
        return <React.Fragment>
            <label className="control-label col-md-3 justify-content-end">{this.props.label}</label>
            <div className="col-md-9">
                <input className="form-control w-100" type="text" name={`${basename}[${this.props.name}]`} defaultValue={this.props.data[this.props.name]} {...required}/>
            </div>
        </React.Fragment>
    }
}

class Firstname extends Component
{
    render() {
        return <Textinput {...this.props} label={trans('Prénom')} name="firstname"/>
    }
}

Firstname.propTypes = ProfileProps

class Lastname extends Component
{
    render() {
        return <Textinput {...this.props} label={trans('Nom')} name="lastname"/>
    }
}

Lastname.propTypes = ProfileProps

class Contact extends Component
{
    render() {
        const basename = this.props.baseName ? (this.props.baseName + '[contacts]') : 'contacts'
        if(this.props.default) {
            return <React.Fragment>
                <label className="control-label">{this.props.label}</label>
                <input className="form-control" type="text" name={`${basename}[${this.props.schedule}][ndetail][value]`} defaultValue={this.models('props.data.ndetail.value','')} {...this.props.validations}/>
                    <input type="hidden" name={`${basename}[${this.props.schedule}][contact_type]`} value={this.props.type}/>
                    <input type="hidden" name={`${basename}[${this.props.schedule}][id]`} value={this.props.data.id}/>
            </React.Fragment>
        }
        return <React.Fragment>
            <label className="control-label col-md-3 justify-content-end">{this.props.label}</label>
            <div className="col-md-9">
                <input className="form-control w-100" type="text" name={`${basename}[${this.props.schedule}][ndetail][value]`} defaultValue={this.models('props.data.ndetail.value','')} {...this.props.validations}/>
                <input type="hidden" name={`${basename}[${this.props.schedule}][contact_type]`} value={this.props.type}/>
                <input type="hidden" name={`${basename}[${this.props.schedule}][id]`} value={this.props.data.id}/>
            </div>
        </React.Fragment>
    }
}

Modelizer(Contact)

class Phone extends Component
{
    render() {
        return <Contact {...this.props} type="phone"/>
    }
}

Phone.defaultProps = {
    schedule : 'fixe',
    label : trans('Téléphone')
}

Phone.propTypes = ContactProps

class Fax extends Component
{
    render() {
        return <Contact {...this.props} type="fax"/>
    }
}

Fax.defaultProps = {
    schedule : 'fax',
    label : trans('Fax')
}

Fax.propTypes = ContactProps

export default {
    Gender : Gender,
    GenderSelect : GenderSelect,
    Firstname : Firstname,
    Lastname : Lastname,
    Contact : {
        Phone : Phone,
        Fax : Fax
    }
}