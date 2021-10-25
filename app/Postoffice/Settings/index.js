import React, {Component} from 'react';
import Companies from './Companies';
import Operators from './Operators';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';
import $ from 'jquery';

class Settings extends Component
{
	constructor(props) {
		super(props)
		this.state = {
			tab : this.models('props.data.tab', 'companies'),
			errorMessages : []
		}
	}
	
	render() {
		return <div className="col-md-12">
            <div className="card">
                <div className="card-body">
					{this.state.errorMessages.length>0?<div className="alert alert-danger">
                        {this.state.errorMessages.map((errorMessage, index)=><div key={`error-${index}`}>{errorMessage}</div>)}
                    </div>:null}
					<form name="frm_settings" autoComplete="off" method="post" action="/settings" ref="settings_form">
						<input type="hidden" value="nothing"/>
                        <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
						<input type="hidden" name="id" value={this.models('props.data.row.id')}/>
						<ul className="nav nav-tabs" role="tablist" id="tab-form">
                            <li className="nav-item">
                                <a className={`nav-link ${this.state.tab=='companies'?'active':''}`}
                        			data-toggle="tab" href={`#companies`} role="tab"
                        			aria-controls="companies"
                        			aria-selected="true">{trans('Airlines')}</a>
                            </li>
 							<li className="nav-item">
                                <a className={`nav-link ${this.state.tab=='operators'?'active':''}`}
                        			data-toggle="tab" href={`#operators`} role="tab"
                        			aria-controls="operators"
                        			aria-selected="true">{trans('Opérateurs postaux')}</a>
                            </li>
						</ul>
						<div className="tab-content border-bottom border-left border-right p-4 mb-4">
                            <div className={`tab-pane ${this.state.tab=='companies'?'active':''} first-section`}
                            id={`companies`} role="tabpanel" aria-labelledby="companies-tab">
								<Companies data={this.props.data}/>
							</div>
							<div className={`tab-pane ${this.state.tab=='operators'?'active':''} second-section`}
                            id={`operators`} role="tabpanel" aria-labelledby="operators-tab">
								<Operators data={this.props.data}/>
							</div>
						</div>
						<div className="d-flex justify-content-end">
                            <button className="btn btn-primary">{trans('Enregistrer')}</button>
                        </div>
					</form>
				</div>
			</div>
		</div>
	}
}

export default Modelizer(Settings);