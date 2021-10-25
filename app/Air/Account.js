import React from 'react';
import BaseAccount, {TYPELABELS} from 'ryvendor/Ry/Admin/User/Account';
import Modelizer from 'ryvendor/Ry/Core/Modelizer';
import trans from 'ryapp/translations';

class Account extends BaseAccount
{
	header() {
		if(this.models('props.data.user.customer_account.company_restricted')) {
			return <div className="border-bottom header text-large">
	        <i className="fa fa-user-edit"></i> {this.models("props.data.user.name")}<span className="mx-3">-</span>{trans('Statut')} : <span className="text-orange">{this.models("props.data.user.account_type")}</span><span className="mx-3">-</span>{this.models("props.data.user.account_type")} : <span className="text-orange">{this.models("props.data.user.customer_account.facturable.name")}</span><span className="mx-3">-</span><span className="text-orange">{this.models("props.data.user.customer_account.company_restricted.name")}</span>
	    </div>
		}
		return super.header()
	}
}

export default Modelizer(Account);