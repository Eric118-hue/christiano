import React, {Component} from 'react';
import Modelizer from '../../../vendor/Ry/Core/Modelizer';
import {PopupHeader, PopupBody, PopupFooter} from '../../../vendor/bs/bootstrap';
import trans from '../../translations';
import moment from 'moment';
import numeral from 'numeral';

class Detail extends Component
{
  render() {
    let total = {
      nreceptacles : parseInt(this.models('props.data.data.cardit.nsetup.nreceptacles', 0)),
      wreceptacles : parseFloat(this.models('props.data.data.cardit.nsetup.wreceptacles', 0.0))
    }
    let recipients = [{
      nreceptacles : parseInt(this.models('props.data.data.cardit.nsetup.nreceptacles', 0)),
      wreceptacles : parseFloat(this.models('props.data.data.cardit.nsetup.wreceptacles', 0.0)),
      weight_unit : this.models('props.data.data.cardit.nsetup.weight_unit')=='KGM' ? 'K' : 'Lb',
      Cl : 'Q'
    }]
    for(let i=1; i<10; i++) {
      recipients.push({})
    }
    return <React.Fragment>
      <PopupHeader>
        <h6>{trans('AWB')} {this.models('props.data.data.customer.nsetup.lta.prefix')} {this.models('props.data.data.code', '').substr(0,4)} {this.models('props.data.data.code', '').substr(4,4)}</h6>
      </PopupHeader>
      <PopupBody>
        <div className="font-weight-bold justify-content-around row">
			    <div className="row h-100">
            <div className="border-left border-right h-100 px-2">{this.models('props.data.data.cardit.departure.airport.iata')}</div>
            <div className="px-2">{this.models('props.data.data.customer.facturable.name')}</div>
          </div>
			    <div>{trans('AWB')} : {this.models('props.data.data.customer.nsetup.lta.prefix')} {this.models('props.data.data.code', '').substr(0,4)} {this.models('props.data.data.code', '').substr(4,4)}</div>
			    <div>{trans('DOSSIER Nº')}</div>
		    </div>
        <table className="table table-bordered bg-white">
          <tbody>
            <tr className="bg-light text-center">
              <td colSpan="2" className="p-0" style={{width:'25%'}}>Shipper's name and Address</td>
              <td colSpan="4" className="p-0" style={{width:'25%'}}>Shipper's Account Number</td>
              <td colSpan="6" rowSpan="3" style={{width:'25%'}}>
                Not negociable AIR WAYBILL Issued By
              </td>
              <td colSpan="2" rowSpan="3" style={{width:'25%'}}>
                <h3>{this.models('props.data.data.customer.facturable.name')}</h3>
                {this.models('props.data.data.customer.facturable.adresse.raw')} {this.models('props.data.data.customer.facturable.adresse.ville.cp')} // {this.models('props.data.data.customer.facturable.adresse.ville.country.nom')}
              </td>
            </tr>
            <tr>
  <td colSpan="2" className="border-bottom-0">{this.models('props.data.data.cardit.departure.organisation_name12')}</td>
              <td colSpan="4">
                
              </td>
            </tr>
            <tr>
              <td colSpan="6" className="border-top-0 text-wrap">
                {this.models('props.data.data.cardit.departure.adresse.raw')}<br/>
                {this.models('props.data.data.cardit.departure.adresse.ville.nom')}<br/>
                {this.models('props.data.data.cardit.departure.adresse.ville.cp')} {this.models('props.data.data.cardit.departure.adresse.raw2')}<br/>
                {this.models('props.data.data.cardit.departure.adresse.ville.country.nom')}
              </td>
            </tr>
            <tr className="bg-light text-center">
              <td colSpan="2" className="p-0">
                Consigneer's Name, Address
              </td>
              <td colSpan="4" className="p-0">
                Consigneer's Account Number
              </td>
              <td colSpan="8" rowSpan="3" className="text-wrap">
                It is agreed that the goods
                describedherein are accepted in apparent good order and condition
                (except as noted) to carrier SUBJECT TO THE CONDITIONS OF CONTRACT
                ON THE REVERSE HEREOF. THE SHIPPER'S ATTENTION IS DRAWN OF THE
                NOTICE CONCERNING CARRIER'S LIMITATION OF LIABILITY. Shipper may
                increase such limitation of liability by declaring a higher value
                for carriage and paying a supplemental charge if required.
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="border-bottom-0">
              {this.models('props.data.data.cardit.destination.organisation_name12')}
              </td>
              <td colSpan="4"></td>
            </tr>
            <tr>
              <td colSpan="6" className="border-top-0 text-wrap">
                {this.models('props.data.data.cardit.destination.adresse.raw')}<br/>
                {this.models('props.data.data.cardit.destination.adresse.ville.nom')}<br/>
                {this.models('props.data.data.cardit.destination.adresse.ville.cp')} {this.models('props.data.data.cardit.destination.adresse.raw2')}<br/>
                {this.models('props.data.data.cardit.destination.adresse.ville.country.nom')}
              </td>
            </tr>
            <tr className="bg-light text-center">
              <td colSpan="6" className="p-0">
                Issuing Carrier's Agent, Name, City
              </td>
              <td colSpan="8" className="p-0">
                Accounting information
              </td>
            </tr>
            <tr>
              <td colSpan="6">
                <p>{this.models('props.data.data.cardit.departure.organisation_name12')}</p>
                <p>{this.models('props.data.data.cardit.departure.adresse.raw')}<br/>
                  {this.models('props.data.data.cardit.departure.adresse.ville.nom')}<br/>
                  {this.models('props.data.data.cardit.departure.adresse.ville.cp')} {this.models('props.data.data.cardit.departure.adresse.raw2')}<br/>
                  {this.models('props.data.data.cardit.departure.adresse.ville.country.nom')}</p>
              </td>
              <td colSpan="8" rowSpan="3">
                {this.models('props.data.data.cardit.departure.nsetup.account.info')}
              </td>
            </tr>
            <tr className="bg-light text-center">
              <td colSpan="2" className="p-0">
                Agent's IATA Code
              </td>
              <td colSpan="4" className="p-0">
                Account number
              </td>
            </tr>
            <tr>
              <td colSpan="2"></td>
              <td colSpan="4"></td>
            </tr>
            <tr className="bg-light text-center">
              <td colSpan="6" className="p-0">
                Aeroport of Departure (Address of 1st Carrier)
              </td>
              <td colSpan="6" className="p-0">
                Reference Number
              </td>
              <td colSpan="2" className="p-0">
                Optionnal Shipping Information
              </td>
            </tr>
            <tr>
              <td colSpan="6">
                {this.models('props.data.data.cardit.departure.airport.name')}
              </td>
              <td colSpan="6">

              </td>
              <td>

              </td>
              <td>

              </td>
            </tr>
            <tr className="bg-light text-center">
              <td rowSpan="2" className="p-0">to</td>
              <td rowSpan="2" className="p-0">By first Carrier</td>
              <td rowSpan="2" className="p-0" style={{width:46}}>to</td>
              <td rowSpan="2" className="p-0" style={{width:46}}>by</td>
              <td rowSpan="2" className="p-0" style={{width:46}}>to</td>
              <td rowSpan="2" className="p-0" style={{width:46}}>by</td>
              <td rowSpan="2" className="p-0">Currency</td>
              <td rowSpan="2" className="p-0">Chgs Code</td>
              <td colSpan="2" className="p-0">WT / VAL</td>
              <td colSpan="2" className="p-0">Other</td>
              <td rowSpan="2" className="p-0">Declared Value for Carriage</td>
              <td rowSpan="2" className="p-0">Declared Value for Customs</td>
            </tr>
            <tr className="bg-light text-center">
              <td className="p-0" style={{width:46}}>PPD</td>
              <td className="p-0" style={{width:46}}>Coll</td>
              <td className="p-0" style={{width:46}}>PPD</td>
              <td className="p-0" style={{width:46}}>Coll</td>
            </tr>
            <tr>
              <td>
                {this.models('props.data.data.cardit.nsetup.handover_destination_location.iata')}
              </td>
              <td>
                {this.models('props.data.data.customer.facturable.name')}
              </td>
              <td>
                {this.models('props.data.data.cardit.nsetup.transports', []).length>1?this.models('props.data.data.cardit.nsetup.transports.1.departure_location.iata'):''}
              </td>
              <td>
                {this.models('props.data.data.cardit.nsetup.transports', []).length>1?this.models('props.data.data.cardit.nsetup.transports.1.reference', '').substr(0,2):''}
              </td>
              <td>
                {this.models('props.data.data.cardit.nsetup.transports', []).length>1?this.models('props.data.data.cardit.nsetup.transports.2.departure_location.iata'):''}
              </td>
              <td>
                {this.models('props.data.data.cardit.nsetup.transports', []).length>1?this.models('props.data.data.cardit.nsetup.transports.2.reference', '').substr(0,2):''}
              </td>
              <td>
                {this.models('props.data.data.cardit.departure.currency.iso_code')}
              </td>
              <td></td>
              <td>X</td>
              <td></td>
              <td>X</td>
              <td></td>
              <td>NVD</td>
              <td>NVC</td>
            </tr>
            <tr className="bg-light text-center">
              <td colSpan="2" className="p-0">
                Airport of destination
              </td>
              <td colSpan="4" className="p-0">
                Report Flight/Date
              </td>
              <td colSpan="6" className="p-0">
                Amount of Insurance
              </td>
              <td colSpan="2" rowSpan="2" className="text-wrap">
                INSURANCE : if carrier
                      offers insurance, and such insurance is requested in
                      accordance with the conditions thereof, indicate amount to be
                      insured in figures in box marked "Amount of insurance".
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="text-wrap">
                {this.models('props.data.data.cardit.nsetup.handover_destination_location.name')}
              </td>
              <td colSpan="2" className="text-wrap">
                {moment(this.models('props.data.data.cardit.transports.0.departure_datetime_lt')).format('DD/MM/YYYY HH:mm')}
              </td>
              <td colSpan="2">
                {this.models('props.data.data.cardit.transports.1.departure_datetime_lt', false)?moment(this.models('props.data.data.cardit.transports.1.departure_datetime_lt')).format('DD/MM/YYYY HH:mm'):null}
              </td>
              <td colSpan="6"></td>
            </tr>
            <tr className="bg-light text-center">
              <td colSpan="14" className="p-0">
                Handling Information
              </td>
            </tr>
            <tr>
              <td colSpan="13" rowSpan="3" className="border-right-0"></td>
              <td className="border-left-0"></td>
            </tr>
            <tr>
              <td className="p-0 bg-light text-center">
                SCI
              </td>
            </tr>
            <tr className="text-center">
              <td>
                
              </td>
            </tr>
            <tr>
              <td colSpan="12" rowSpan="2" className="p-0">
                <table className="table table-bordered m-0">
                  <tbody>
                    <tr className="bg-light text-center">
                      <td className="p-0">RCP</td>
                      <td className="p-0">Gr. Weight</td>
                      <td className="p-0">lb</td>
                      <td className="p-0">Cl.</td>
                      <td className="p-0">Item Nº</td>
                      <td className="p-0">Char. Weight</td>
                      <td className="p-0">Rate/Charge</td>
                      <td className="p-0">Total</td>
                    </tr>
                    {recipients.map((recipient, key)=><tr className="text-center" key={`recip-${key}`}>
                      <td>{recipient.nreceptacles}</td>
                      <td>{recipient.nreceptacles?numeral(recipient.wreceptacles).format('0,0.00'):null}</td>
                      <td>{recipient.weight_unit}</td>
                      <td>{recipient.Cl}</td>
                      <td></td>
                      <td>{recipient.wreceptacles?numeral(recipient.wreceptacles).format('0,0.00'):null}</td>
                      <td>{recipient.nreceptacles?0.00:null}</td>
                      <td>{recipient.nreceptacles?0:null}</td>
                    </tr>)}
                    <tr className="text-center">
                      <td className="bg-stone">{total.nreceptacles}</td>
                      <td className="bg-stone">{numeral(total.wreceptacles).format('0,0.00')}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td className="bg-stone"></td>
                      <td className="bg-stone"></td>
                      <td className="bg-stone">0,00</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colSpan="2" className="bg-light text-center p-0 text-wrap" style={{height:12}}>
                Nature and quality of Goods (incl. Dimensions)
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="align-baseline">
                <p>POSTAL MAIL</p>
                MAL
              </td>
            </tr>
            <tr>
              <td colSpan="4" rowSpan="6" className="p-0" style={{height:260}}>
                <table className="table table-bordered m-0 h-100 text-center">
                  <tbody>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td className="p-0" style={{width:'50%'}}>Prepaid</td>
                      <td className="p-0" style={{width:'50%'}}>Collect</td>
                    </tr>
                    <tr>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td colSpan="2" className="p-0">Valuation Charge</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td colSpan="2" className="p-0">Tax</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td colSpan="2" className="p-0">Total Others Charges Due Agent</td>
                    </tr>
                    <tr>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td colSpan="2" className="p-0">Total Others Charges Due to Carrier</td>
                    </tr>
                    <tr>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                    <tr>
                      <td colSpan="2" className="bg-stone"></td>
                    </tr>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td className="p-0">Total Prepaid</td>
                      <td className="p-0">Total Collect</td>
                    </tr>
                    <tr>
                      <td>0</td>
                      <td>0</td>
                    </tr>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td className="p-0 text-wrap">Currency Conversion Rates</td>
                      <td className="p-0 text-wrap">Collect Charges in</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr className="bg-light text-center" style={{height:24}}>
                      <td className="p-0 text-wrap">For Carrier's use only at destination</td>
                      <td className="p-0 text-wrap">Charges at destination</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colSpan="10" className="bg-light text-center p-0" style={{height:24}}>
                Other Charges
              </td>
            </tr>
            <tr>
              <td colSpan="10" style={{height:76}}></td>
            </tr>
            <tr className="text-center bg-light">
              <td colSpan="10" className="text-wrap">
              Shipper's certifies that the particulars
						on the face hereof are correct and that insofar as any part of the
						consignment contains dangerous goods, such as is properly
						described by name and is proper condition for carriage by air
						according to the applicable Dangerous Goods Regulations.
              </td>
            </tr>
            <tr>
              <td colSpan="10" style={{height:142}}>

              </td>
            </tr>
            <tr className="text-center bg-light" style={{height:24}}>
              <td colSpan="10" className="p-0">
                Signature of Shipper or his agent
              </td>
            </tr>
            <tr>
              <td colSpan="7" className="align-baseline">
                <span className="text-muted">Executed on (Date)</span><br/>
                {moment(this.models('props.data.data.cardit.created_at')).format('DD/MM/YYYY')}
              </td>
              <td colSpan="3" className="align-baseline">
                <span className="text-muted">At (Place) Signature of Carrier</span><br/>
                {this.models('props.data.data.customer.facturable.name')}
              </td>
            </tr>
          </tbody>
        </table>
      </PopupBody>
      <PopupFooter>
        <a href={`/ltapdf?cardit_id=${this.models('props.data.data.cardit_id')}`} className="btn btn-primary" target="_blank">{trans('Télécharger')}</a>
      </PopupFooter>
    </React.Fragment>
  }
}

export default Modelizer(Detail)