import React, {Component} from 'react';
import Modelizer from '../Core/Modelizer';
import Organisation from '../../../app/Air/Organisation';

class Orga extends Component
{
    render() {
        return <div className="col-md-12">
        <div className="card">
            <div className="card-body">
                <Organisation readOnly={true} data={{row:{
                type : this.models('props.data.row.type'),
                facturable : this.models('props.data.row.facturable'),
                companies : this.models('props.data.row.companies', [])
            },currencies:this.props.data.currencies,default_currency:this.props.data.default_currency}} store={this.props.store} setup={this.props.data.pricing}/>
            </div>
        </div>
    </div>
    }
}

export default Modelizer(Orga);