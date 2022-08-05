import React, {Component} from 'react';
import $ from 'jquery';
import trans from '../../../app/translations';
import Modelizer from '../Core/Modelizer';

class GeneralSetup extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            setup : {}
        }
        this.handleSwitch = this.handleSwitch.bind(this)
    }

    handleSwitch(event, field) {
        const checked = event.target.checked
        this.setState(state=>{
            state.setup[field] = checked
            $.ajax({
                url : '/setup',
                type : 'post',
                data : state
            })
            return state
        })
    }

    render() {
        return <div className="col-md-12">
        <div className="card">
            <div className="card-header">
                {this.props.title}
            </div>
            <div className="body">
                <div className="form-inline mb-3">
                    <label className="col-3 justify-content-end">{trans('Mode maintenance')}</label>
					<div className="col-4">
						<div className="custom-control custom-switch">
							<input type="checkbox" name="setup[maintenance]"
								className="custom-control-input" value="1" defaultChecked={this.props.data.maintenance} id="maintenance-toggle" onChange={e=>this.handleSwitch(e, 'maintenance')}/> <label
								className="custom-control-label float-center"
								htmlFor="maintenance-toggle">{trans('Affiche une page de maintenance si activé')}</label>
						</div>
					</div>
				</div>
                <div className="form-inline mb-3">
                    <label className="col-3 justify-content-end">{trans('Mode debug')}</label>
					<div className="col-4">
						<div className="custom-control custom-switch">
							<input type="checkbox" name="setup[debug]"
								className="custom-control-input" value="1" defaultChecked={this.props.data.debug} id="debug-toggle" onChange={e=>this.handleSwitch(e, 'debug')}/> <label
								className="custom-control-label float-center"
								htmlFor="debug-toggle">{trans('Affiche une page de maintenance si activé')}</label>
						</div>
					</div>
				</div>
                <div className="form-inline mb-3">
                    <label className="col-3 justify-content-end">{trans('Envoi des e-mails')}</label>
					<div className="col-4">
						<div className="custom-control custom-switch">
							<input type="checkbox" name="setup[general][email]"
								className="custom-control-input" value="1" defaultChecked={this.models('props.data.general.email')} id="emailing-toggle" onChange={e=>this.handleSwitch(e, 'email')}/> <label
								className="custom-control-label float-center"
								htmlFor="emailing-toggle">{trans("Empêche tout envoi d'emails si désactivé")}</label>
						</div>
					</div>
				</div>
                <div className="form-inline mb-3">
					<label className="col-3 justify-content-end">{trans("Logo")}</label>
					<div className="d-flex justify-content-center">
						<label className="btn btn-light mr-30" data-name="logo" data-dropzone-action="/upload" data-preview-target="#logo">{trans("Sélectionner image")}</label>
					</div>
					<div className="fileupload-new thumbnail col-6">
						<img src={this.props.data.logo} alt="Logo" id="logo" className="img-fluid"/>
					</div>
				</div>
				<div className="form-inline mb-3">
					<label className="col-3 justify-content-end">{trans("Image par défaut")}</label>
					<div className="d-flex justify-content-center">
						<label className="btn btn-light mr-30" data-name="nophoto" data-dropzone-action="/upload" data-preview-target="#nophoto">{trans("Sélectionner image")}</label>
					</div>
					<div
						className="fileupload-new thumbnail col-6">
						<img src={this.props.data.nophoto} alt="no photo" id="nophoto" className="img-fluid"/>
					</div>
				</div>
				<div className="form-inline mb-3">
                    <label className="col-3 justify-content-end">{trans("Favicon")}</label>
					<div className="d-flex justify-content-center">
						<label className="btn btn-light mr-30" data-name="favicon" data-dropzone-action="/upload" data-preview-target="#favicon">{trans("Sélectionner image")}</label>
					</div>
					<div className="col-6">
						<div className="fileupload-new thumbnail">
							<img src={this.props.data.favicon} alt="Favicon" id="favicon" className="img-fluid"/>
						</div>
					</div>
				</div>
            </div>
        </div>
    </div>
    }
}

export default Modelizer(GeneralSetup);