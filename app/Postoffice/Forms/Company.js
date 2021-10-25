import React, {Component} from 'react';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import {PopupHeader, PopupBody, PopupFooter} from 'ryvendor/bs/bootstrap';
import trans from 'ryapp/translations';
import Autocomplete from 'ryvendor/Ry/Core/LiveSearchAutocomplete';

class Company extends Component
{
	render() {
		return <form name="frm_company" action="/company" method="post">
			<PopupHeader><h5 className="align-center flex-fill">{trans('Airline')}</h5></PopupHeader>
			<PopupBody>
				<div className="form-group">
					<Autocomplete name="company_id" optionSubtext={it=>it.iata_code} placeholder={trans('Entrez le code IATA')} endpoint="/companies" optionLabel={it=>it.name}/>
				</div>
			</PopupBody>
			<PopupFooter>
				<button className="btn btn-primary">{trans('Enregistrer')}</button>
			</PopupFooter>
		</form>
	}
}

export default Modelizer(Company)