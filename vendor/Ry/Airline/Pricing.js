import React, {Component} from 'react';
import Modelizer from '../Core/Modelizer';
import $ from 'jquery';
import Organisation from '../../../app/Air/Organisation';
import trans from '../../../app/translations';
import swal from 'sweetalert2';

class Pricing extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            confirmed : false,
            errorMessages : [],
            customer : {
                type : this.models('props.data.row.type'),
                facturable : this.models('props.data.row.facturable'),
				companies : this.models('props.data.row.companies', [])
            }
        }
        this.validate = this.validate.bind(this)
    }

    componentDidMount() {
        $(this.refs.client_form).parsley().on('form:validate', formInstance=>{
            $(window).off("beforeunload");
            if(!this.state.confirmed) {
                swal.fire({
                    title : trans('Attention!'),
                    text : trans('Les prix fournis seront définitifs sur la période renseignée.'),
                    icon: 'warning',
                    showCancelButton: true
                }).then(result=>{
                    this.setState({
                        confirmed : result.value
                    })
                    if(result.value)
                        $(this.refs.client_form).submit()
                })
                formInstance.validationResult = false
            }
        });
    }

    validate() {
        return this.refs.pricing.validate()
    }

    render() {
        return <div className="col-md-12">
        <div className="card">
            <div className="card-body">
                {this.state.errorMessages.length>0?<div className="alert alert-danger">
                    {this.state.errorMessages.map((errorMessage, index)=><div key={`error-${index}`}>{errorMessage}</div>)}
                </div>:null}
                <form name="frm_client" ref="frm_client" autoComplete="off" method="post" action={this.props.data.action} ref="client_form">
                    <input type="hidden" name="tab" value={this.state.tab}/>
                    <input type="hidden" value="nothing"/>
                    <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
                    <input type="hidden" name="facturable[id]" value={this.models('state.facturable.id')}/>
                    <Organisation ref="pricing" pricing={true} readOnly={true} data={{row:this.state.customer,currencies:this.props.data.currencies,default_currency:this.props.data.default_currency}} store={this.props.store} setup={this.props.data.pricing}/>
                    <input type="hidden" name="id" value={this.models('props.data.row.id')}/>
                    <div className="text-right">
                        <button className="btn btn-primary">{trans('Enregistrer')}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    }
}

export default Modelizer(Pricing);