import React, {Component} from 'react';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import {PopupBody, PopupHeader, PopupFooter} from '../../vendor/bs/bootstrap';
import trans from '../translations';
import $ from 'jquery';

class RySelect extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      oncevalidate : false,
      value : this.props.value,
      selected : false,
      search : '',
      options : []
    }
    this.edit = this.edit.bind(this)
    this.offClick = this.offClick.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.validate = this.validate.bind(this)
  }

  validate() {
    this.setState({
      oncevalidate : true
    })
    if(this.props.required) {
      return this.state.value
    }
    return true
  }

  handleSelect(event, option) {
    event.preventDefault()
    this.setState({
        value : option,
        selected : false
    })
    return false
  }

  handleSearch(event) {
    const value = event.target.value
    this.setState({
        search : value
    })
    if(this.ax)
        this.ax.abort()
    this.ax = $.ajax({
        url : this.props.href,
        data : {
            json : true,
            q : value
        },
        success : response=>{
            this.setState(state=>{
                if(response.data.data.length>0)
                    state.selected = true
                state.options = response.data.data
                return state
            })
        }
    })
  }

  edit() {
    this.setState({
        selected : true
    })
    window.setTimeout(()=>{
      $(this.refs.editor).focus();
      $('body').on('click', this.offClick);
    }, 0)
  }

  offClick() {
    this.setState({
      selected : false
    })
    $('body').off('click', this.offClick);
  }

  render() {
    return <div className="position-relative">
    <div className={`border rounded mouse-pointable ${(this.state.oncevalidate && !this.state.value)?'border-danger':''}`} onClick={this.edit} style={{minHeight:'35px', padding:7}}>
        {this.state.value?this.props.onValue(this.state.value):null}
    </div>
    <div className={`position-absolute w-100 ${this.state.selected?'':'d-none'}`} style={{top:0}}>
        <input type="text" ref="editor" className="form-control" value={this.state.search} onChange={this.handleSearch}/>
        <div className={`dropdown-menu overflow-auto w-100 ${this.state.selected?'show':''}`} style={{maxHeight:200}}>
          {this.state.options.map(item=><a key={`select-${item.id}`} className="dropdown-item" href="#" onClick={e=>this.handleSelect(e, item)}>{this.props.item(item)}</a>)}
        </div>
    </div>
  </div>
  }
}

class Form extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      country_id : this.models('props.data.data.adresse.ville.country.id'),
      currency_id : this.models('props.data.data.currency_id')
    }
    this.handleCountryChange = this.handleCountryChange.bind(this)
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this)
  }

  handleCountryChange(event) {
    const country_id = event.target.value
    const currency_id = this.cast(this.props.data.country_currencies.find(it=>it.country_id==country_id), 'currency_id')
    this.setState({
      country_id,
      currency_id
    })
    window.setTimeout(()=>{
      $(this.refs.currency_select).selectpicker('refresh')
    }, 0)
  }

  handleCurrencyChange(event) {
    const currency_id = event.target.value
    this.setState({currency_id})
  }

  componentDidMount() {
    $(this.refs.amd_form).parsley({
      excluded : ':hidden',
    }).on('form:validate', formInstance=>{
      let errors = []
      if(!this.refs.airport.validate()) {
          errors.push('airport')
      }
      this.setState({
          errors : errors
      })
      formInstance.validationResult = errors.length==0;
    })
  }

  render() {
    return <form action="/amd" method="post" name="frm_amd" ref="amd_form">
      <PopupHeader>
        <h6>{this.models('props.data.data.id')?trans('Modifier un AMD'):trans('Ajouter un AMD')}</h6>
      </PopupHeader>
      <PopupBody>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">{trans('IMPC Code')}</label>
              <input type="text" defaultValue={this.models('props.data.data.code')} name="code" className="form-control" required/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('IMPC name (12 characters)')}</label>
              <input type="text" defaultValue={this.models('props.data.data.name12')} name="name12" className="form-control" required/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('IMPC name (35 characters)')}</label>
              <input type="text" defaultValue={this.models('props.data.data.name35')} name="name35" className="form-control" required/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">{trans('Party identifier')}</label>
              <input type="text" defaultValue={this.models('props.data.data.party_identifier')} name="party_identifier" className="form-control" required/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Organisation name (12 characters)')}</label>
              <input type="text" defaultValue={this.models('props.data.data.organisation_name12')} name="organisation_name12" className="form-control" required/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Organisation name (35 characters)')}</label>
              <input type="text" defaultValue={this.models('props.data.data.organisation_name35')} name="organisation_name35" className="form-control" required/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">{trans('Adresse')}</label>
              <input type="text" defaultValue={this.models('props.data.data.adresse.raw', '')} name="adresse[raw]" className="form-control" required/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Code Postal')}</label>
              <input type="text" defaultValue={this.models('props.data.data.adresse.ville.cp', '')} name="adresse[ville][cp]" className="form-control" required/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Pays')}</label>
              <select name="adresse[ville][country][id]" value={this.state.country_id} className="form-control" onChange={this.handleCountryChange} required>
                {this.props.data.countries.map(country=><option key={`country-${country.id}`} value={country.id}>{country.nom}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Fax')}</label>
              <input type="text" defaultValue={this.models('props.data.data.contacts.bureau_fax.ndetail.value', '')} name="contacts[fax][ndetail][value]" className="form-control"/>
              <input type="hidden" name="contacts[fax][contact_type]" defaultValue={'fax'}/>
              <input type="hidden" name="contacts[fax][type]" defaultValue={'bureau'}/>
              <input type="hidden" name="contacts[fax][id]" defaultValue={this.models('props.data.data.contacts.bureau_fax.id')}/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Aéroport')}</label>
              <RySelect ref="airport" required href="/airports" value={this.models('props.data.data.airport') ? this.props.data.data.airport : this.models('props.data.select_airports', []).length>0?this.props.data.select_airports[0]:null} onValue={value=><React.Fragment>
                <span className="text-orange">{value.iata}</span> - {value.name} - {this.cast(value.country, 'nom')}
                <input type="hidden" name="airport_id" value={this.cast(value, 'id')}/>
              </React.Fragment>} item={item=><React.Fragment><span className="text-orange">{item.iata}</span> - {item.name} - {this.cast(item, 'country.nom')}</React.Fragment>}/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className="control-label">{trans('Localité')}</label>
              <input type="text" defaultValue={this.models('props.data.data.adresse.ville.nom', '')} name="adresse[ville][nom]" className="form-control"/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Etat / province')}</label>
              <input type="text" defaultValue={this.models('props.data.data.adresse.raw2', '')} name="adresse[raw2]" className="form-control"/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Téléphone')}</label>
              <input type="text" defaultValue={this.models('props.data.data.contacts.bureau_phone.ndetail.value', '')} name="contacts[bureau][ndetail][value]" className="form-control"/>
              <input type="hidden" name="contacts[bureau][contact_type]" defaultValue={'phone'}/>
              <input type="hidden" name="contacts[bureau][type]" defaultValue={'bureau'}/>
              <input type="hidden" name="contacts[bureau][id]" defaultValue={this.models('props.data.data.contacts.bureau_phone.id')}/>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Devise')}</label>
              <select name="currency_id" ref="currency_select" required value={this.state.currency_id} onChange={this.handleCurrencyChange} className="form-control">
                {this.props.data.currencies.map(currency=><option key={`currency-${currency.id}`} value={currency.id}>{currency.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="control-label">{trans('Info comptable')}</label>
              <textarea defaultValue={this.models('props.data.data.nsetup.account.info', '')} name="nsetup[account][info]" className="form-control"/>
            </div>
          </div>
        </div>
      </PopupBody>
      <PopupFooter>
        <input type="hidden" name="id" value={this.models('props.data.data.id', 0)}/>
        <button className="btn btn-orange">{trans('Enregistrer')}</button>
      </PopupFooter>
    </form>
  }
}

export default Modelizer(Form)