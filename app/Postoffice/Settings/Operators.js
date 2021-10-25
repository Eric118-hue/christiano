import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import {store} from 'ryvendor/Ry/Core/Ry';
import swal from 'sweetalert2';
import $ from 'jquery';
import davarrow from './dav-arrow.png';

Array.prototype.groupBy = function(fn){
    let ar = []
    let subar = []
    this.map(it=>{
        let i = fn(it)
        if(ar.indexOf(i)<0)
            ar.push(fn(it))
    })
    ar.map(a=>subar.push(this.filter(it=>fn(it)==a)))
    return subar
}

class Operators extends Component {
	constructor(props) {
		super(props)
		this.state = {
			row : this.models('props.data.row')
		}
		this.removePartyIdentifier = this.removePartyIdentifier.bind(this)
		this.removeAmd = this.removeAmd.bind(this)
	}
	
	removePartyIdentifier(party_identifier) {
		swal({
            title: trans('Confirmez-vous la suppression?'),
            text: trans('Cet enregistrement sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme')
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url : trans('/amds'),
                    type : 'delete',
                    data : {
                        party_identifier
                    },
					success : function(response){
						if(response.type)
							store.dispatch(response);
					}
                })
            }
        })
	}
	
	removeAmd(amd) {
		swal({
            title: trans('Confirmez-vous la suppression?'),
            text: trans('Cet enregistrement sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme')
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    url : trans('/amds'),
                    type : 'delete',
                    data : {
                        id : amd.id
                    },
					success : function(response){
						if(response.type)
							store.dispatch(response);
					}
                })
            }
        })
	}
	
	componentDidMount() {
		store.subscribe(()=>{
			const storeState = store.getState()
			if(storeState.type=='postoffice') {
				const postoffice = storeState.row
				this.setState(state=>{
					state.row.amds = state.row.amds.filter(it=>{
						return storeState.deleted_amds.indexOf(it.id)<0
					})
					postoffice.amds.map(amd=>{
						if(!state.row.amds.find(it=>it.id==amd.id))
							state.row.amds.push(amd)
					})
					return state
				})
			}
		})
	}
	
	render() {
		return <div className="col-md-10 offset-md-1">
			<a className="btn btn-turquoise" href="#dialog/editamds"><i className="fa fa-plus"></i> {trans('Ajouter un opérateur postal')}</a>
			<div className="card mt-3">
				<div className="card-header">
					<h6>{trans('Setting : Opérateurs postaux')}</h6>
				</div>
				<div className="card-body">
					<table className="table table-striped table-bordered table-postoffice table-centerall">
						<thead>
							<tr>
								<th>{trans('Party identifier')}</th>
								<th>{trans('Pays')}</th>
								<th>{trans('Opérateurs postaux')}</th>
								<th>{trans('IMPC Codes')}</th>
								<th>{trans('Auto')}</th>
								<th>{trans('Manuel')}</th>
								<th>{trans('Editer')}</th>
								<th>{trans('Suppr')}</th>
							</tr>
						</thead>
						<tbody>
							{this.models('state.row.amds', []).groupBy(it=>it.party_identifier).map((amd_group, group_index)=><React.Fragment key={`amdgroup-${group_index}`}>
								<tr>
									<td className="font-weight-bold">{this.cast(amd_group[0], 'party_identifier')}</td>
									<td></td>
									<td className="font-weight-bold">{this.cast(amd_group[0], 'organisation_name35')}</td>
									<td></td>
									<td></td>
									<td></td>
									<td>
										<a className="btn btn-info" href={`#dialog/editamds?party_identifier=${this.cast(amd_group[0], 'party_identifier')}`}>
			                                <i className="fa fa-pencil-alt"></i>
			                            </a>
									</td>
									<td>
										<button className="btn" type="button" onClick={()=>this.removePartyIdentifier(this.cast(amd_group[0], 'party_identifier'))}>
			                                <i className="fa fa-trash-alt"></i>
			                            </button>
									</td>
								</tr>
								{amd_group.filter(it=>!it.deleted).map(amd=><tr key={`amd-${group_index}-${amd.id}`}>
									<td><img src={davarrow}/></td>
									<th>{this.cast(amd, 'airport.country.code')}</th>
									<td>{this.cast(amd, 'organisation_name35')}</td>
									<td><strong>{this.cast(amd, 'code')}</strong></td>
									<td>
										<div className="custom-control custom-radio">
                                            <input type="radio" id={`amd-auto${amd.id}`} name={`amds[${amd.id}][amd_nsetup][mode]`} className="custom-control-input" defaultChecked={this.cast(amd, 'amd_nsetup.mode')=='auto'} value="auto"/>
											<label className="custom-control-label" htmlFor={`amd-auto${amd.id}`}></label>
                                        </div>
									</td>
									<td>
										<div className="custom-control custom-radio">
                                            <input type="radio" id={`amd-manual${amd.id}`} name={`amds[${amd.id}][amd_nsetup][mode]`} className="custom-control-input" defaultChecked={this.cast(amd, 'amd_nsetup.mode', 'manual')=='manual'} value="manual"/>
											<label className="custom-control-label" htmlFor={`amd-manual${amd.id}`}></label>
                                        </div>
									</td>
									<td>
										
									</td>
									<td>
										<button className="btn" type="button" onClick={()=>this.removeAmd(amd)}>
			                                <i className="fa fa-trash-alt"></i>
			                            </button>
									</td>
								</tr>)}
							</React.Fragment>)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	}
}

export default Modelizer(Operators);