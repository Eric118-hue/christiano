import React, {Component} from 'react';
import moment from 'moment';
import Ry from '../../Core/Ry';
import Countdown from './Countdown';
import trans from '../../../../app/translations';

class Assignation extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            select_transports : this.props.selectTransports
        }
        this.handleReceptacleTransportChange = this.handleReceptacleTransportChange.bind(this)
        this.handleAllReceptacleTransportChange = this.handleAllReceptacleTransportChange.bind(this)
    }

    handleReceptacleTransportChange(receptacle, status) {
        this.setState(state=>{
            let found_receptacle = this.state.receptacles.find(item=>item.id==receptacle.id)
            if(found_receptacle)
                found_receptacle.status = status
            return state
        })
    }

    handleAllReceptacleTransportChange(status) {
        this.setState(state=>{
            let found_cardit = state.items.find(item=>item.id==cardit.id)
            if(found_cardit) {
                found_cardit.receptacles.map(item=>{
                    item.status = status
                })
            }
            return state
        })
    }

    render() {
        return <div className="row">
            <div className="col-lg-3">
                <div className="blockTemps">
                    <h3>{trans('Temps restant pour assigner les récipients')} :</h3>
                    <div className="skillContainer d-flex align-items-center justify-content-around">
                        <Countdown from={moment.utc('2019-08-22 09:00:00').local()} to={moment.utc('2019-08-27 09:00:00').local()}/>
                    </div>
                    <ul className="info">
                        <li>
                            {trans('Numéro du container')} :
                            <span>{this.props.data.nsetup.container_id}</span>
                        </li>
                        <li>
                            {trans('Container Journey ID')} :
                            <span>{this.props.data.nsetup.cjid}</span>
                        </li>
                        <li>
                            {trans('Nombre de récipient')} :
                            <span>{this.props.data.nsetup.nreceptacles}</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-lg-9">
                <div className="table-responsive">
                    <form name={`frm_cardit${this.props.data.id}`} action={`/resdit`} method="post">
                        <Ry title="ajaxform"/>
                        <input type="hidden" name="ry"/>
                        <input type="hidden" name="id" value={this.props.data.id}/>
                        <table className="table tableRecap">
                            <thead>
                                <tr>
                                    <th rowSpan="2" colSpan="3"
                                        className="noBor colorVert"></th>
                                    <th rowSpan="2" colSpan="2"
                                        className="noBor"></th>
                                    <th colSpan={this.state.select_transports.length} className="thTop">Assignation</th>
                                    <th rowSpan="2" className="thModal">
                                        <button className="btn btn-primary js-sweetalert"
                                                data-type="with-custom-icon">+
                                        </button>
                                    </th>
                                </tr>
                                <tr className="thLeft">
                                    {this.state.select_transports.map(select_transport=><th key={`cardit-${this.props.data.id}-select-transport-${select_transport.id}`}>{select_transport.conveyence_reference}</th>)}
                                </tr>
                                <tr>
                                    <th>Numéro du récipient</th>
                                    <th>Flag <i className="icon-info"></i></th>
                                    <th>Container Journey ID</th>
                                    <th>Type de récipient</th>
                                    <th>Poids (Kg)</th>
                                    <th>
                                        <label className="fancy-radio custom-color-green m-auto">
                                            <input type="radio" name="checkall" onChange={()=>this.handleAllReceptacleTransportChange(this.props.data, 1)}/>
                                            <span><i className="m-0"></i></span>
                                        </label>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.data.receptacles.map((receptacle, index)=><tr key={`content-${receptacle.id}`}>
                                    <td>
                                        {receptacle.nsetup.receptacle_id}
                                    </td>
                                    <td>{receptacle.nsetup.handling}</td>
                                    <td>{receptacle.nsetup.nesting}</td>
                                    <td>{receptacle.nsetup.type.interpretation}</td>
                                    <td>{receptacle.nsetup.weight}</td>
                                    {this.state.select_transports.map(select_transport=><td className="text-center">
                                        <label className="fancy-radio m-auto custom-color-green">
                                            <input name={`receptacles[${receptacle.id}]`} type="radio" value="1" checked={receptacle.status==1} onChange={()=>this.handleReceptacleTransportChange(receptacle, 1)}/>
                                            <span><i className="mr-0"></i></span>
                                        </label>
                                    </td>)}
                                </tr>)}
                                <tr>
                                    <td colSpan="3" className="border-right-0 noBg"></td>
                                    <td colSpan="5" className="border-left-0 border-right-0">
                                        <button className="btn btn-orange rounded-0">STEP 1 :
                                            Valider</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>
        </div>
    }
}

export default Assignation;