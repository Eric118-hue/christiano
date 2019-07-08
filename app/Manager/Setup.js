import React, {Component} from 'react';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import Options from '../../vendor/Ry/Admin/Setup';
import General from '../../vendor/Ry/Admin/GeneralSetup';

class Setup extends Component
{
    render() {
        return <div className="col-md-12">
            <div className="row">
                <div className="col-2">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-general-tab" data-toggle="pill" href="#v-pills-general" role="tab" aria-controls="v-pills-general" aria-selected="false">Général</a>
                        <a className="nav-link" id="v-pills-legal_entities-tab" data-toggle="pill" href="#v-pills-legal_entities" role="tab" aria-controls="v-pills-legal_entities" aria-selected="true">Statuts d'une entreprise</a>
                    </div>
                </div>
                <div className="col-10 border-left">
                    <div className="bg-white">
                        <div className="body">
                            <div className="tab-content" id="v-pills-tabContent">
                                <div className="tab-pane fade show active" id="v-pills-general" role="tabpanel" aria-labelledby="v-pills-general-tab">
                                    <General pkey={`setup[legal_entities]`} data={this.models('props.data.data', {})} title="Général"/>
                                </div>
                                <div className="tab-pane fade" id="v-pills-legal_entities" role="tabpanel" aria-labelledby="v-pills-legal_entities-tab">
                                    <Options pkey={`setup[legal_entities]`} items={this.models('props.data.data.legal_entities', [])} title="Statuts d'une entreprise"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default Modelizer(Setup);