import React, {Component} from 'react';
import trans, {plural} from '../../translations';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import swal from 'sweetalert2';
import $ from 'jquery';
import './Form.scss';

class Form extends Component
{
  constructor(props) {
    super(props)
    this.state = {
      numbers : [],
      saved : false
    }
    this.saveLta = this.saveLta.bind(this)
    this.generate = this.generate.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
  }

  generate() {
    $(this.refs.mode).val('generate')
    $(this.refs.form).submit()
  }

  handleCheck(event, index) {
    const checked = event.target.checked
    this.setState(state=>{
      state.numbers[index].selected = checked
      return state
    })
  }

  saveLta() {
    const duplicates = this.state.numbers.filter(it=>!it.available && it.selected)
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
        this.setState({
          numbers : storeState.numbers,
          saved : storeState.saved
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
                  <li>
                    <div className="row">
                      <div className="col-5">
                        <div className="alert d-flex justify-content-between align-items-center p-2">
                          {trans('Code compagnie aérienne')} : <strong className="font-24">{this.models('props.data.user.customer_account.nsetup.lta.prefix')}</strong>
                        </div>
                      </div>
                      <span className="edi-trait mt-4"></span>
                      <div className="col-5">
                        <div className="alert d-flex justify-content-between p-2">
                          <div className="form-inline">
                            <label className="control-label bg-inverse">
                              {trans('Premier numéro AWB')} : 
                            </label>
                            <input className="ml-3 form-control text-center" data-parsley-length="[8,8]" data-parsley-length-message={trans('Le premier numéro doit comporter 8 chiffres exactement')} required type="number" data-parsley-errors-container="#first-number" name="first"/>
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
                                <input className="ml-3 form-control text-center" required type="number" name="n"/>
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
                  </li>
                </ul>
              </li>
            </ul>
            {this.state.numbers.length>0?<div>
              <h4>{trans('Liste des AWB')}</h4>
              <strong>{this.state.numbers.length}</strong> {plural('AWB Number disponible', {n:this.state.numbers.length}, 'AWB Number disponibles')}
              <div className="row my-5 mx-0 bg-light">
                {this.state.numbers.map((number, index)=>{
                  const readonly = number.available ? {readOnly:true} : {}
                  return <label key={`number-${number.value}`} className={`fancy-checkbox px-4 py-2 border ${number.available?'':'border-danger'}`}><input type="checkbox" name="numbers[]" value={number.value} checked={number.selected} onChange={e=>this.handleCheck(e, index)} {...readonly}/>
                    <span>{number.value}</span>
                </label>})}
              </div>
              {!this.state.saved?<div className="text-center">
                <button className="btn btn-success text-white" type="button" onClick={this.saveLta}>{trans('Enregistrer les AWB')}</button>
              </div>:null}
            </div>:null}
            <input type="hidden" name="mode" ref="mode" value="generate"/>
            <input type="hidden" name="ry"/>
          </form>
        </div>
      </div>
    </div>
  }
}

export default Modelizer(Form)