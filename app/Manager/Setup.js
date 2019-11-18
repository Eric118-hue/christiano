import React, {Component} from 'react';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import Options from '../../vendor/Ry/Admin/Setup';
import General from '../../vendor/Ry/Admin/GeneralSetup';
import Currency from '../../vendor/Ry/Shop/Currency';
import trans from '../translations';

class Setup extends Component
{
    render() {
        return <div className="col-md-12">
            <div className="row">
                <div className="col-2">
                    <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a className="nav-link active" id="v-pills-general-tab" data-toggle="pill" href="#v-pills-general" role="tab" aria-controls="v-pills-general" aria-selected="true">{trans("Général")}</a>
                        <a className="nav-link" id="v-pills-legal_entities-tab" data-toggle="pill" href="#v-pills-legal_entities" role="tab" aria-controls="v-pills-legal_entities" aria-selected="false">{trans("Statuts d'une entreprise")}</a>
                        <a className="nav-link" id="v-pills-charges-tab" data-toggle="pill" href="#v-pills-charges" role="tab" aria-controls="v-pills-charges" aria-selected="false">{trans("Rôles d'utilisateurs")}</a>
                        <a className="nav-link" id="v-pills-currencies-tab" data-toggle="pill" href="#v-pills-currencies" role="tab" aria-controls="v-pills-currencies" aria-selected="false">{trans("Devises")}</a>                    </div>
                </div>
                <div className="col-10 border-left">
                    <div className="bg-white">
                        <div className="body">
                            <div className="tab-content" id="v-pills-tabContent">
                                <div className="tab-pane fade show active" id="v-pills-general" role="tabpanel" aria-labelledby="v-pills-general-tab">
                                    <General pkey={`setup[general]`} data={this.models('props.data.data', {})} title={trans("Général")}/>
                                </div>
                                <div className="tab-pane fade" id="v-pills-legal_entities" role="tabpanel" aria-labelledby="v-pills-legal_entities-tab">
                                    <Options pkey={`setup[legal_entities]`} items={this.models('props.data.data.legal_entities', [])} title={trans("Statuts d'une entreprise")}/>
                                </div>
                                <div className="tab-pane fade" id="v-pills-charges" role="tabpanel" aria-labelledby="v-pills-charges-tab">
                                    <Options pkey={`setup[charges]`} items={this.models('props.data.data.charges', [])} title={trans("Rôles d'utilisateurs")}/>
                                </div>
                                <div className="tab-pane fade" id="v-pills-currencies" role="tabpanel" aria-labelledby="v-pills-currencies-tab">
                                    <Currency pkey={`currencies`} store={this.props.store} data={{data:{data:this.models('props.data.data.currencies', [])}}} title={trans("Devises")}/>
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