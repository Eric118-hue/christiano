import React, {Component} from 'react';
import Modelizer from '../../vendor/Ry/Core/Modelizer';
import Options from '../../vendor/Ry/Admin/Setup';
import trans from '../translations';

class Setup extends Component
{
    render() {
        return <Options pkey={`setup[charges]`} items={this.models('props.data.data.charges', [])} title={trans("Fonctions")}/>
    }
}

export default Modelizer(Setup);