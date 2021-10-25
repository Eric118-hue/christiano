import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import $ from 'jquery';
import MultiForm from 'ryvendor/Ry/Admin/User/Multiform';
import swal from 'sweetalert2';
import Autocomplete from 'ryvendor/Ry/Core/LiveSearchAutocomplete';
import Repository from './Repository';

class Form extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tab : this.models('props.data.tab', 'postoffice-account'),
			row : this.models('props.data.row'),
			company_tab : this.models('props.data.row.companies.0.id'),
			errorMessages : []
		}
		this.removeContact = this.removeContact.bind(this)
		this.removeLogo = this.removeLogo.bind(this)
	}
	
	componentDidMount() {
		const nologo = this.refs.nologo
        $("input:file").change(function(){
            $(nologo).attr("checked", false)
        });
	}
	
	removeContact(contact, done) {
        const dis = this
        swal({
            title: trans('Confirmez-vous la suppression?'),
            text: trans('Cet enregistrement sera supprimé définitivement'),
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: trans('Oui je confirme')
        }).then((result) => {
            if (result.value) {
                if(contact.id>0) {
                    $.ajax({
                        url : trans('/postoffices/contacts'),
                        type : 'delete',
                        data : {
                            user_id : contact.id,
                            postoffice_id : dis.props.data.row.id
                        },
                        success : done
                    })
                }
                else
                    done()
            }
        })
    }

	removeLogo() {
        this.refs.logo.src = this.props.data.logo
        $(this.refs.nologo).attr("checked", true)
    }
	
	render() {
		return <div className="col-md-12">
			<div className="card">
				<div className="card-body">
					{this.state.errorMessages.length > 0 ? <div className="alert alert-danger">
						{this.state.errorMessages.map((errorMessage, index) => <div key={`error-${index}`}>{errorMessage}</div>)}
					</div> : null}
					<form name="frm_postoffice" autoComplete="off" method="post" action={this.props.data.action} encType="multipart/form-data">
						<input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')} />
						<ul className="nav nav-tabs" role="tablist" id="tab-form">
                            <li className="nav-item">
                                <a className={`nav-link ${this.state.tab=='postoffice-account'?'active':''}`}
		                        data-toggle="tab" href={`#postoffice-account`} role="tab"
		                        aria-controls="postoffice-account"
		                        aria-selected="true">{trans('Compte poste')}</a>
                            </li>
							<li className="nav-item">
                                <a className={`nav-link ${this.state.tab=='air'?'active':''}`}
                            		data-toggle="tab" href={`#air`} role="tab"
                            		aria-controls="air">{trans('Airlines')}</a>
                            </li>
						</ul>
						<div className="tab-content border-bottom border-left border-right p-4 mb-4">
                            <div className={`tab-pane ${this.state.tab=='postoffice-account'?'active':''} first-section`}
                            id={`postoffice-account`} role="tabpanel" aria-labelledby="postoffice-account-tab">
								<div className="row">
									<div className="col-md-3 text-center border-right">
										<img src={this.models('state.row.medias.0.fullpath', this.models('props.data.logo'))} className="img-fluid img-thumbnail rounded-circle icon-160" ref="logo"/><br/>
				                        <input type="file" name="logo" id="logo" className="d-none"/>
										<div className="justify-content-around my-2 row">
											<label htmlFor="logo" className="bg-primary mouse-pointable p-2 px-3 rounded text-white m-0">{trans("Choisir un logo")}</label>
											<button className="btn btn-danger btn-xs" type="button" onClick={this.removeLogo}>{trans('Supprimer le logo')}</button>
										</div>
			                            <span className="badge badge-danger mr-15">{trans('NOTE!')}</span>
			                            <span>{trans('Formats')} : .jpg, .png, .gif</span>
										<input type="checkbox" name="nologo" ref="nologo" value="1" className="d-none"/>
									</div>
									<div className="col-md-3">
										<div className="form-group">
											<label className="control-label">{trans('Nom')}</label>
											<Autocomplete value={this.models('props.data.row.operator')} name="operator[id]" optionSubtext={it=>it.edi_address} placeholder={trans('Entrez le code EDI de la poste')} endpoint="/postoffices/operators" optionLabel={it=>it.operator}/>
										</div>
									</div>
								</div>
								<div className="mt-2">
		                            <MultiForm data={this.props.data} remove={this.removeContact}/>
		                        </div>
							</div>
							<div className={`tab-pane ${this.state.tab=='air'?'active':''}`}
                            id={`air`} role="tabpanel" aria-labelledby="air-tab">
								<div className="d-flex">
									<div className="border flex-column nav nav-pills p-1 rounded" id="v-pills-tab-client" role="tablist" aria-orientation="vertical">
										{this.models("props.data.row.companies", []).map(company=><a key={`pill-company-${company.id}`} className={`nav-link text-nowrap nav-link-client mb-1 ${company.id==this.state.company_tab?'active':''}`} id={`v-pills-${company.id}-tab`} data-toggle="pill" href={`#v-pills-${company.id}`} role="tab" aria-controls={`v-pills-${company.id}`} aria-selected={company.id==this.state.tab?"true":"false"}>{company.company.name}</a>)}
						            </div>
									<div className="tab-content pt-0" id="v-pills-tabContent">
										{this.models('props.data.row.companies', []).map(company=><div key={`tab-company-${company.id}`} className={`tab-pane fade show ${company.id==this.state.company_tab?'active':''}`} id={`v-pills-${company.id}`} role="tabpanel" aria-labelledby={`v-pills-${company.id}-tab`}>
										<Repository data={company} prefix={`companies[${company.id}]`} type="airline"/>
										</div>)}
									</div>
								</div>
							</div>
						</div>
						<input type="hidden" name="id" value={this.models('props.data.row.id')}/>
                        <div className="d-flex justify-content-end">
                            <button className="btn btn-primary">{trans('Enregistrer')}</button>
                        </div>
					</form>
				</div>
			</div>
		</div>
	}
}

export default Modelizer(Form)