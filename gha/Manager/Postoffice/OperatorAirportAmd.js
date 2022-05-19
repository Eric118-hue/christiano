import React, {Component} from 'react';
import NavigableModel from 'ryvendor/Ry/Core/NavigableModel';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import Autocomplete from 'ryvendor/Ry/Core/LiveSearchAutocomplete';
import Ry, {store} from 'ryvendor/Ry/Core/Ry';
import $ from 'jquery';

class OperatorAirportAmd extends NavigableModel
{
	constructor(props) {
		super(props)
		this.model = "operator_airport_amd";
		this.endpoint = "/postoffices/operator_airport_amd";
		this.state.amds = []
		this.operatorChange = this.operatorChange.bind(this)
		this.airportChange = this.airportChange.bind(this)
		this.amd_select = React.createRef()
		this.form = React.createRef()
		this.mode = React.createRef()
		this.search = this.search.bind(this)
		this.insert = this.insert.bind(this)
		this.state.status = 'departure'
		this.statusChange = this.statusChange.bind(this)
	}
	
	statusChange(e) {
		const value = e.target.value
		this.setState({
			status : value
		})
	}
	
	search() {
		$(this.mode.current).val("search")
		$(this.form.current).submit()
	}
	
	insert() {
		$(this.mode.current).val("insert")
		$(this.form.current).submit()
	}
	
	operatorChange(operator) {
		this.setState({
			operator
		}, ()=>{
			if(this.axamd)
				this.axamd.abort()
			
			this.axamd = $.ajax({
				url : '/postoffices/amds',
				data : {
					party_identifier : this.models('state.operator.party_identifier'),
					airport_iata : this.models('state.airport.iata')
				},
				success : response=>{
					if(response.data) {
						this.setState({
							amds : response.data
						}, ()=>{
							$(this.amd_select.current).selectpicker('refresh')
						})
					}
				}
			})
		})
	}
	
	airportChange(airport) {
		this.setState({
			airport
		}, ()=>{
			if(this.axamd)
				this.axamd.abort()
			
			this.axamd = $.ajax({
				url : '/postoffices/amds',
				data : {
					party_identifier : this.models('state.operator.party_identifier'),
					airport_iata : this.models('state.airport.iata')
				},
				success : response=>{
					if(response.data) {
						this.setState({
							amds : response.data
						}, ()=>{
							$(this.amd_select.current).selectpicker('refresh')
						})
					}
				}
			})
		})
	}
	
	render() {
		let pagination = <ul className={`list-inline m-0 ${this.props.data.per_page>=this.state.total?'d-none':''}`}>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toFirst}><i className="fa fa-angle-double-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===1?'disabled':''}`} href="#" onClick={this.toPrevious}><i className="fa fa-angle-left"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.state.last_page?'disabled':''}`} href="#" onClick={this.toNext}><i className="fa fa-angle-right"></i></a>
            </li>
            <li className="list-inline-item">
                <a className={`btn btn-outline-primary ${this.state.page===this.state.last_page?'disabled':''}`} href="#" onClick={this.toEnd}><i className="fa fa-angle-double-right"></i></a>
            </li>
        </ul>
		
		return <div className="col-12">            
            <div className="justify-content-between m-0 row">
                {this.beforelist()}
                {(this.progressive || this.nopaginate)?null:pagination}
            </div>
            {this.searchEngine()}
			<form action="/postoffices/operator_airport_amd" method="post" name="frm_operator_airport_amd" ref={this.form}>
				<table className="table table-bordered tabel-centerall table-striped">
					<thead>
						<tr>
							<th></th>
							<th style={{width:'15%'}}>{trans('ORIG.')}</th>
							<th style={{width:'15%'}}>{trans('DEST.')}</th>
							<th style={{width:'15%'}}>{trans('LOC+5')}</th>
							<th style={{width:'15%'}}>{trans('LOC+7')}</th>
							<th style={{width:'15%'}}>{trans('ERN')}</th>
							<th style={{width:'15%'}}>{trans('AWN')}</th>
							<th style={{width:50}}></th>
						</tr>
						{false?<tr>
							<td></td>
							<td>
								<input type="search" name="s[departure][edi_address]" className="form-control"/>
							</td>
							<td>
								<input type="search" name="s[arrival][edi_address]" className="form-control"/>
							</td>
							<td>
								<input type="search" name="s[departure][iata]" className="form-control"/>
							</td>
							<td>
								<input type="search" name="s[departure][iata]" className="form-control"/>
							</td>
							<td></td>
							<td></td>
							<td>
								<button className="btn btn-primary" type="button" onClick={this.search}><i className="fa fa-search"></i></button>
							</td>
						</tr>:null}
					</thead>
					<tbody>
						{this.state.data.map((row, index)=><tr key={`operator-airport-amd-${row.id}`}>
							<td></td>
							{row.status=='departure'?<React.Fragment>
								<td>
									{row.operator.edi_address}
								</td>
								<td></td>
								<td>
									{row.airport.iata}
								</td>
								<td></td>
								<td>
									{row.amd.code}
								</td>
								<td></td>
							</React.Fragment>:<React.Fragment>
								<td></td>
								<td>
									{row.operator.edi_address}
								</td>
								<td></td>
								<td>
									{row.airport.iata}
								</td>
								<td></td>
								<td>
									{row.amd.code}
								</td>
							</React.Fragment>}
							<td>
								<button className="btn btn-danger" type="button" onClick={()=>this.remove(index, row.id)}><i className="fa fa-trash"></i></button>
							</td>
						</tr>)}
					</tbody>
					<tfoot>
						<tr>
							<td>
								<select name="status" className="form-control">
									<option value="departure">{trans('Expéditeur')}</option>
									<option value="arrival">{trans('Destinataire')}</option>
								</select>
							</td>
							<td colSpan="2">
								<Autocomplete name="operator_id" endpoint={`/postoffices/operators`} required optionSubtext={it=>it.edi_address} placeholder={trans('Entrez un adresse postal EDI')} optionLabel={it=>it.operator} onChange={operator=>this.operatorChange(operator)}/>
							</td>
							<td colSpan="2">
								<Autocomplete name="airport_id" endpoint={`/airports?json`} required optionSubtext={it=>it.iata} placeholder={trans('Entrez un code aéroport')} optionLabel={it=>it.name} onChange={airport=>this.airportChange(airport)}/>
							</td>
							<td colSpan="2">
								<select ref={this.amd_select} name="amd_id" className="form-control">
									{this.state.amds.map(amd=><option value={amd.id} data-subtext={amd.code}>{amd.name35}</option>)}
								</select>
							</td>
							<td><button className="btn btn-primary" type="button" onClick={this.insert}><i className="fa fa-save"></i></button></td>
						</tr>
					</tfoot>
				</table>
				<input type="hidden" name="ry"/>
				<input type="hidden" name="mode" value="insert" ref={this.mode}/>
					</form>
		<div ref="overscroller" className="justify-content-between m-0 row">
                {this.afterlist()}
                {(this.progressive || this.nopaginate)?null:pagination}
            </div>
        </div>
	}
}

Modelizer(OperatorAirportAmd);

class List extends Component
{
	render() {
		return <div className="card">
			<div className="card-body">
				<OperatorAirportAmd data={this.props.data.data} store={store}/>
			</div>
		</div>
	}
}

export default Modelizer(List);