import React, {Component} from 'react';
import trans, {plural} from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import swal from 'sweetalert2';
import $ from 'jquery';
import './Form.scss';
import numeral from 'numeral';

class Form extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      numbers : {},
      saved : false,
		t : 0
    }
    this.saveLta = this.saveLta.bind(this)
    this.generate = this.generate.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
  }

  generate() {
    $(this.refs.mode).val('generate')
    $(this.refs.form).submit()
  }

  handleCheck(event, customer_company_id, index) {
    const checked = event.target.checked
    this.setState(state=>{
      state.numbers[customer_company_id][index].selected = checked
      return state
    })
  }

  saveLta() {
	let duplicates = []
	this.models('props.data.user.customer_account.companies', []).map(customer_company=>{
		duplicates = duplicates.concat(this.models("state.numbers." + customer_company.id, []).filter(it=>!it.available && it.selected))
	})
    $(this.refs.mode).val('save')
    if(duplicates.length>0) {
      let lis = []
      duplicates.map(duplicate=>{
        lis.push(`<li>Nº ${duplicate.value}</li>`)
      })
      swal.fire({
        title : trans('AWB Duplicates'),
        html : trans(`Les N° AWB suivants ont déjà été générés par le passé, confirmez-vous cet enregistrement ?`) + `<ul>${lis.join('')}</ul>`,
        confirmButtonText : trans('Oui'),
        cancelButtonText : trans('Non'),
        showCancelButton : true
      }).then(result=>{
        if(result.value) {
          $(this.refs.form).submit()
        }
      })
    }
    else {
      swal.fire({
        title : trans('Appliquer'),
        text : trans(`Confirmez-vous l'enregistrement des AWB`),
        confirmButtonText : trans('Oui'),
        cancelButtonText : trans('Non'),
        showCancelButton : true
      }).then(result=>{
        if(result.value) {
          $(this.refs.form).submit()
        }
      })
    }
  }

  componentDidMount() {
    this.props.store.subscribe(()=>{
      const storeState = this.props.store.getState()
      if(storeState.type=='ltas') {
        this.setState(state => {
          state.numbers = storeState.numbers,
          state.saved = storeState.saved,
		  state.t++
		  return state
        })
      }
    })
  }

  render() {
    return <div className="col-md-12">
      <div className="card">
        <div className="card-body">
          <form className="ramification-client" ref="form" method="post" action="/ltas" name="frm_ltas">
            <ul className="list-unstyled ramification-airline ml-0">
              <li className="parsley-escaped">
                <div className="alert text-uppercase font-24">
                  {trans('AWB Number Generator')}
                </div>
                <ul className="list-unstyled ramification-edi">
				{this.models("props.data.user.customer_account.companies", []).map(customer_company=><li key={`company-${customer_company.id}`}>
                    <div className="row">
                      <div className="col-5">
                        <div className="alert d-flex justify-content-between align-items-center p-2">
                          {trans('Code compagnie aérienne')} : {this.cast(customer_company, 'company.name')} <strong className="font-24">{numeral(this.cast(customer_company, 'nsetup.lta.prefix')).format('000')}</strong>
                        </div>
                      </div>
                      <span className="edi-trait mt-4"></span>
                      <div className="col-5">
                        <div className="alert d-flex justify-content-between p-2">
                          <div className="form-inline">
                            <label className="control-label bg-inverse">
                              {trans('Premier numéro AWB')} : 
                            </label>
                            <input className="ml-3 form-control text-center" data-parsley-length="[8,8]" data-parsley-length-message={trans('Le premier numéro doit comporter 8 chiffres exactement')} required type="number" data-parsley-errors-container="#first-number" name={`companies[${customer_company.id}][first]`}/>
                          </div>
                        </div>
                      </div>
                      <div id="first-number"></div>
                    </div>
                    <ul className="list-unstyled ramification-agent">
                      <li>
                        <div className="row">
                          <div>
                            <div className="alert d-flex justify-content-between mb-0 p-2">
                              <div className="form-inline">
                                <label className="control-label">
                                  {trans('Quantité de AWB')} : 
                                </label>
                                <input className="ml-3 form-control text-center" required type="number" name={`companies[${customer_company.id}][n]`}/>
                              </div>
                            </div>
                          </div>
                          <span className="btn-add font-24 mt-2 mx-3">&gt;</span>
                          <div className="alert p-2">
                            <button className="btn text-light font-weight-bold" type="button" onClick={this.generate}>{trans('Valider')}</button>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>)}
                </ul>
              </li>
            </ul>
            {this.models("props.data.user.customer_account.companies", []).map(customer_company=>this.models("state.numbers." + customer_company.id, []).length>0?<div key={`list-${customer_company.id}-${this.state.t}`}>
              <h4>{trans('Liste des AWB')} {customer_company.company.name}</h4>
              <strong>{this.models("state.numbers." + customer_company.id, []).filter(it=>it.selected).length}</strong> {plural('AWB Number disponible', {n:this.models("state.numbers." + customer_company.id, []).filter(it=>it.selected).length}, 'AWB Number disponibles')}
              <div className="row my-5 mx-0 bg-light">
                {this.models("state.numbers."+customer_company.id, []).map((number, index)=>{
                  const readonly = number.available ? {readOnly:true} : {}
                  if(number.selected) {
                    return <label key={`number-${number.value}`} className={`fancy-checkbox px-4 py-2 border ${number.available?'':'border-danger'}`}><input type="checkbox" name={`companies[${customer_company.id}][numbers][]`} value={number.value} checked={number.selected} onChange={e=>this.handleCheck(e, customer_company.id, index)} {...readonly}/>
                        <span>{number.value}</span>
                    </label>
                  }
                  return <label key={`number-${number.value}`} className={`fancy-checkbox px-4 py-2 bg-stone border ${number.available?'':'border-danger'}`}><i className="fa fa-ban mr-2 text-danger"></i>
                      <span>{number.value}</span>
                  </label>
                })}
              </div>
              {!this.state.saved?<div className="text-center">
                <button className="btn btn-success text-white" type="button" onClick={this.saveLta}>{trans('Enregistrer les AWB')}</button>
              </div>:null}
            </div>:null)}
            <input type="hidden" name="mode" ref="mode" value="generate"/>
            <input type="hidden" name="ry"/>
          </form>
        </div>
      </div>
    </div>
  }
}

export default Modelizer(Form)