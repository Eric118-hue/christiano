import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import {PopupBody, PopupFooter} from 'ryvendor/bs/bootstrap';
import trans, {plural} from 'ryapp/translations';
import $ from 'jquery';
import swal from 'sweetalert2';
import {store} from 'ryvendor/Ry/Core/Ry';
import numeral from 'numeral';

class Lta extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			numbers : {},
		      saved : false
		}
		this.saveLta = this.saveLta.bind(this)
	    this.generate = this.generate.bind(this)
	    this.handleCheck = this.handleCheck.bind(this)
	}
	
	generate() {
	    $(this.refs.mode).val('generate')
		if($(this.refs.form).parsley().validate()) {
			$(this.refs.form).submit()
		}
	  }

  handleCheck(event, index) {
    const checked = event.target.checked
    this.setState(state=>{
      state.numbers[index].selected = checked
      return state
    })
  }

  saveLta() {
		let duplicates = this.models("state.numbers", []).filter(it=>!it.available && it.selected)
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
		$(this.refs.form).ajaxForm({
			beforeSerialize: ($form, options)=>{
				if($form.find("input:hidden[name='ry']").length>0) {
					const raw = $form.find("input:hidden[name='ry']")[0].ry.getRaw();
					options.data = Array.isArray(raw) ? {'ry.array':raw} : raw
				}
			},
			success : response=>{
				if(response.type)
					store.dispatch(response);
			}
		});
	    this.props.store.subscribe(()=>{
	      const storeState = this.props.store.getState()
	      if(storeState.type=='ltas') {
	        this.setState(state => {
	          state.numbers = storeState.numbers
	          state.saved = storeState.saved
			  state.t++
			  return state
	        })
	      }
		if(storeState.type=='company') {
			$("#myModal").modal('hide');
	        this.setState(state => {
	          state.numbers = []
	          state.saved = true,
			  state.t++
			  return state
	        })
	      }
	    })
	  }
	
	render() {
		return <form className="ramification-client custom-hide" ref="form" name="frm_ltanumber" action="/ltas" method="post">
			<PopupBody>
				<ul className="list-unstyled ramification-airline ml-0">
	              <li className="parsley-escaped">
	                <div className="alert text-uppercase font-24">
	                  {trans('AWB Number Generator')}
	                </div>
	                <ul className="list-unstyled ramification-edi">
						<li>
	                    <div className="row">
	                      <div className="col-5">
	                        <div className="alert align-items-center d-flex flex-column p-2">
	                          <label className="control-label bg-inverse">{trans('Code compagnie aérienne')} : {this.models('props.data.company.company.name')}</label>
								<div className="font-24">{numeral(this.models('props.data.company.company.prefix')).format('000')}</div>
	                        </div>
	                      </div>
	                      <span className="edi-trait mt-4"></span>
	                      <div className="col-5">
	                        <div className="alert p-2">
	                            <label className="control-label bg-inverse">{trans('Premier numéro AWB')} : </label>
	                            <input className="form-control text-center" data-parsley-length="[8,8]" data-parsley-length-message={trans('Le premier numéro doit comporter 8 chiffres exactement')} required type="number" data-parsley-errors-container="#first-number-diag" name={`first`}/>
	                        </div>
	                      </div>
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
	                                <input className="ml-3 form-control text-center" required type="number" name={`n`}/>
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
						<div id="first-number-diag"></div>
	                  </li>
	                </ul>
	              </li>
	            </ul>
	            {this.models("state.numbers", []).length>0?<div>
	              <h4>{trans('Liste des AWB')} {this.models('props.data.company.company.name')}</h4>
	              <strong>{this.models("state.numbers", []).filter(it=>it.selected).length}</strong> {plural('AWB Number disponible', {n:this.models("state.numbers", []).filter(it=>it.selected).length}, 'AWB Number disponibles')}
	              <div className="row my-5 mx-0 bg-light">
	                {this.models("state.numbers", []).map((number, index)=>{
	                  const readonly = number.available ? {readOnly:true} : {}
	                  if(number.selected) {
	                    return <label key={`number-${number.value}`} className={`fancy-checkbox col-md-2 mx-0 py-2 border ${number.available?'':'border-danger'}`}><input type="checkbox" name={`numbers[]`} value={number.value} checked={number.selected} onChange={e=>this.handleCheck(e, index)} {...readonly}/>
	                        <span>{number.value}</span>
	                    </label>
	                  }
	                  return <label key={`number-${number.value}`} className={`fancy-checkbox col-md-2 mx-0 py-2 bg-stone border ${number.available?'':'border-danger'}`}><i className="fa fa-ban mr-2 text-danger"></i>
	                      <span>{number.value}</span>
	                  </label>
	                })}
	              </div>
	            </div>:null}
	            <input type="hidden" name="mode" ref="mode" value="generate"/>
				<input type="hidden" name="company[id]" value={this.models('props.data.company.id')}/>
			</PopupBody>
			{(!this.state.saved && this.models("state.numbers", []).length>0)?<PopupFooter>
            <button className="btn btn-success text-white" type="button" onClick={this.saveLta}>{trans('Enregistrer les AWB')}</button>
          </PopupFooter>:null}
		</form>
	}
}

export default Modelizer(Lta)