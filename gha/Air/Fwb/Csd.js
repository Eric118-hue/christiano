import React, { Component } from 'react';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import { PopupHeader, PopupBody, PopupFooter } from '../../../vendor/bs/bootstrap';
import trans from '../../translations';
import moment from 'moment';
import numeral from 'numeral';

class Detail extends Component {
    render() {
        let total = {
            nreceptacles: parseInt(this.models('props.data.data.nsetup.nreceptacles', 0)),
            wreceptacles: parseFloat(this.models('props.data.data.nsetup.wreceptacles', 0.0))
        }
        let recipients = [{
            nreceptacles: parseInt(this.models('props.data.data.nsetup.nreceptacles', 0)),
            wreceptacles: parseFloat(this.models('props.data.data.nsetup.wreceptacles', 0.0)),
            weight_unit: this.models('props.data.data.cardits.0.nsetup.weight_unit') == 'KGM' ? 'K' : 'Lb',
            Cl: 'Q'
        }]
        for (let i = 1; i < 10; i++) {
            recipients.push({})
        }
        return <React.Fragment>
            <PopupHeader>
                <h6>{trans('Consignement Security Declaration')}</h6>
            </PopupHeader>
            <PopupBody>
                <div className='d-flex justify-content-between mx-5'>
                    <h3>{this.models('props.data.data.party_identifier.name12')}</h3>
                    <h4>{trans('Consignement Security Declaration')}</h4>
                </div>
                <div className='m-5'>
                    <table className='table border table-borderless'>
                        <tbody>
                            <tr>
                                <th>{trans('Regulated agent')}</th>
                                <td>{this.models('props.data.data.party_identifier.name35')} <span dangerouslySetInnerHTML={{__html:this.models('props.data.data.party_identifier_address.complete_address')}}></span></td>
                            </tr>
                            <tr>
                                <th>{trans('Identifier')}</th>
                                <td>{this.models('props.data.data.identifier')}</td>
                            </tr>
                            <tr>
                                <th>{trans('Consignement ID')}</th>
                                <td>{this.models('props.data.data.nsetup.document_number')}</td>
                            </tr>
                            <tr>
                                <th>{trans('Commodity')}</th>
                                <td>POSTAL MAIL</td>
                            </tr>
                            <tr>
                                <th>{trans('Flight Nbr')}</th>
                                <td>{this.models('props.data.data.nsetup.transports.0.conveyence_reference')}</td>
                            </tr>
                            <tr>
                                <th>{trans('Date and time of issue')}</th>
                                <td>{moment(this.models('props.data.data.nsetup.signatory_date'), 'YYMMDDHHmm').format('DD/MM/YYYY HH:mm:00')}</td>
                            </tr>
                        </tbody>
                    </table>
                    <h5 className='border-bottom'>{trans('Security status issued by')}</h5>
                    <p>{this.models('props.data.data.nsetup.RFF.AGE')}</p>
                    <h5 className='border-bottom'>{trans('Security status')}</h5>
                    <p>{this.models('props.data.data.security_status')}</p>
                    <h5 className='border-bottom'>{trans('Screening method')}</h5>
                    <p>{this.models('props.data.data.screening_method')}</p>
                </div>
            </PopupBody>
            <PopupFooter>
                <a href={`/csdpdf?cardit_id=${this.models('props.data.data.id')}`} className="btn btn-primary" target="_blank">{trans('Télécharger')}</a>
            </PopupFooter>
        </React.Fragment>
    }
}

export default Modelizer(Detail)