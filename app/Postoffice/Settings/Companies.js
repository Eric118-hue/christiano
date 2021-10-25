import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import numeral from 'numeral';
import Ry, {store} from 'ryvendor/Ry/Core/Ry';
import swal from 'sweetalert2';
import $ from 'jquery';

class Companies extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			companies : this.models('props.data.row.companies', [])
		}
		this.warningChange = this.warningChange.bind(this)
		this.remove = this.remove.bind(this)
	}
	
	warningChange(event, company) {
		const value = event.target.value
		this.setState(state=>{
			const found = state.companies.find(it=>it.id==company.id)
			if(found) {
				this.descend(found, 'nsetup.lta.warning', value)
			}
			return state
		})
	}
	
	remove(company) {
		swal({
            title: trans('Confirmez-vous la suppression?'),
            text: trans('Cet enregistrement sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme')
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url : trans('/company'),
                    type : 'delete',
                    data : {
                        id : company.id
                    },
					success : ()=>{
						this.setState(state=>{
							state.companies = state.companies.filter(it=>it.id!=company.id)
							return state
						})
					}
                })
            }
        })
	}
	
	componentDidMount() {
		store.subscribe(()=>{
			const storeState= store.getState()
			if(storeState.type=='company') {
				this.setState(state=>{
					state.companies = storeState.row.companies
					return state
				})
			}
		})
	}
	
	
	
	render() {
		return <div className="col-md-10 offset-md-1">
			<a className="btn btn-turquoise" href="#dialog/companies"><i className="fa fa-plus"></i> {trans('Ajouter une compagnie aérienne')}</a>
			<div className="card mt-3">
				<div className="card-header">
					<h6>{trans('Setting : Airlines')}</h6>
				</div>
				<div className="card-body">
					<table className="table table-striped table-bordered table-postoffice table-centerall">
						<thead>
							<tr>
								<th>{trans('Préfixe')}</th>
								<th>{trans('Code IATA')}</th>
								<th>{trans('Compagnie aérienne')}</th>
								<th>{trans('Version FWB')}</th>
								<th>{trans('COVER')}</th>
								<th>{trans('PAWB')}</th>
								<th style={{borderLeftWidth: 8}}>
									{trans('Nº AWB en stock')}
								</th>
								<th>
									{trans("Niveau d'alerte")}
								</th>
								<th>{trans('Ajouter des Nº AWB')}</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{this.models('state.companies', []).map(company=><tr key={`company-${company.id}`}>
								<td><strong>{numeral(company.company.prefix).format('000')}</strong></td>
								<td><strong>{this.cast(company, 'company.iata_code')}</strong></td>
								<td>{this.cast(company, 'company.name')}</td>
								<td>
									<div className="form-group">
										<select required className="form-control" name={`companies[${company.id}][nsetup][fwb_version]`} defaultValue={this.cast(company, 'nsetup.fwb_version')}>
											<option value=""></option>
											<option value="16">16</option>
											<option value="17">17</option>
										</select>
									</div>
								</td>
								<td>
									<div className="custom-control custom-radio">
                                        <input type="radio" id={`company-cover${company.id}`} name={`companies[${company.id}][nsetup][system]`} className="custom-control-input" defaultChecked={this.cast(company, 'nsetup.system')=='cover'} value="cover"/>
										<label className="custom-control-label" htmlFor={`company-cover${company.id}`}></label>
                                    </div>
								</td>
								<td>
									<div className="custom-control custom-radio">
                                        <input type="radio" id={`company-pawb${company.id}`} name={`companies[${company.id}][nsetup][system]`} className="custom-control-input" defaultChecked={this.cast(company, 'nsetup.system', 'pawb')=='pawb'} value="pawb"/>
										<label className="custom-control-label" htmlFor={`company-pawb${company.id}`}></label>
                                    </div>
								</td>
								<td style={{borderLeftWidth: 8}}>
									<strong>{this.cast(company, 'navailable_ltas', 0)} <a href={`#dialog/ltas?company_id=${company.id}`}><i className="fa fa-info-circle text-turquoise"></i></a></strong>
								</td>
								<td>
									<input type="text" name={`companies[${company.id}][nsetup][lta][warning]`} style={{maxWidth:80}} className={`form-control h-auto p-1 m-auto text-center text-white font-weight-bold ${parseInt(this.cast(company, 'nsetup.lta.warning', -1))<this.cast(company, 'navailable_ltas', 0)?"bg-success":"bg-danger"}`} onChange={e=>this.warningChange(e, company)} value={this.cast(company, 'nsetup.lta.warning')}/>
								</td>
								<td>
									<a href={`#dialog/newltas?company_id=${company.id}`} className="btn btn-primary py-0">{trans('Ajouter')}</a>
								</td>
								<td>
									<button className="btn p-0" type="button" onClick={()=>this.remove(company)}>
		                                <i className="fa fa-trash-alt"></i>
		                            </button>
									<Ry/>
								</td>
							</tr>)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	}
}

export default Modelizer(Companies)