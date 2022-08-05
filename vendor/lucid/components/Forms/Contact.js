import React, {Component} from 'react';
import {PopupHeader, PopupBody, PopupFooter} from '../../../bs/bootstrap';
import trans from '../../../../app/translations';

class Contact extends Component
{
    render() {
        return <form>
            <PopupHeader>
                <h3 className="mb-0">{trans('Contactez-nous')}</h3>
            </PopupHeader>
            <PopupBody>
                <div className="form-group">
                    <label className="control-label">{trans('Sujet')}</label>
                    <select className="form-control">
                        <option value="subscribe">{trans("Demande d'inscription")}</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="control-label">{trans('Message')}</label>
                    <textarea className="form-control"></textarea>
                </div>
            </PopupBody>
            <PopupFooter>
                <button className="btn btn-primary">{trans('Envoyer')}</button>
            </PopupFooter>
        </form>
    }
}

export default Contact;