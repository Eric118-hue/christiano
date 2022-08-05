import React, {Component} from 'react';
import Modelizer from '../../Core/Modelizer';
import NavigableModel from '../../Core/NavigableModel';
import trans from '../../../../app/translations';

class Invoice extends NavigableModel
{
    constructor(props) {
        super(props)
        this.model = 'invoice'
        this.endpoint = '/invoices'
        this.headers = []
    }
}

export default Modelizer(Invoice);