import React from 'react';
import Modelizer from '../../Core/Modelizer';
import NavigableModel from '../../Core/NavigableModel';

class Invoice extends NavigableModel
{
    constructor(props) {
        super(props)
        this.model = 'cart'
        this.endpoint = '/carts'
        this.headers = []
    }
}

export default Modelizer(Invoice);