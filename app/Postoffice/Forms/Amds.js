import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import {PopupHeader, PopupBody, PopupFooter} from 'ryvendor/bs/bootstrap';
import trans from 'ryapp/translations';
import $ from 'jquery';

class Amds extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			deleted : [],
			s : this.models('props.data.s'),
			data : this.models('props.data.data', [])
		}
		this.handleFilter = this.handleFilter.bind(this)
		this.handleCheck = this.handleCheck.bind(this)
	}
	
	handleCheck(e, amd) {
		const checked = e.target.checked
		this.setState(state=>{
			const the_amd = state.data.find(it=>it.id==amd.id)
			the_amd.selected = checked
			return state
		})
	}
	
	handleFilter(e) {
		const s = e.target.value
		this.setState({
			s
		})
		if(s.length>=6) {
			$.ajax({
				url : '/amdsearch',
				data : {
					party_identifier : s
				},
				success : response=>{
					this.setState(state=>{
						state.data = response.data
						return state
					})
				}
			})	
		}
	}
	
	render() {
		return <form name="frm_amds" action="/amds" method="post">
			<PopupHeader><h5 className="align-center flex-fill">{trans('Rechercher un opérateur postal')}</h5></PopupHeader>
			<PopupBody>
				<div className="align-items-baseline d-flex flex-row form-group justify-content-center text-center">
					<label className="control-label text-capitalize">{trans('Party identifier')}</label>
					<input type="text" className="form-control w-auto ml-3" value={this.state.s} onChange={this.handleFilter}/>
				</div>
				{this.state.data.length>0?<div>
					{this.state.data.filter(it=>!it.selected).map(amd=><input type="hidden" name={`deleted_amds[${this.state.s}][]`} value={amd.id}/>)}
					<div className="border-bottom border-turquoise col-md-8 mb-3 offset-md-2 py-2">{trans('Choisissez')} :</div>
					<table className="table table-borderless">
						<tbody>
							{this.state.data.map(amd=><tr key={`amd-${amd.id}`}>
								<td className="text-center">{amd.code}</td>
								<td>{amd.organisation_name35}</td>
								<td>{amd.name35}</td>
								<td>
									<label key={`amd-${amd.id}`} className={`fancy-checkbox`}><input type="checkbox" name={`amds[${this.state.s}][]`} value={amd.id} checked={amd.selected} onChange={e=>this.handleCheck(e, amd)}/>
				                    	<span></span>
									</label>
								</td>
							</tr>)}
						</tbody>
					</table>
				</div>:null}
			</PopupBody>
			<PopupFooter>
				<button className="btn btn-primary">{trans('Enregistrer')}</button>
			</PopupFooter>
		</form>
	}
}

export default Modelizer(Amds)