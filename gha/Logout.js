import React, { Component } from 'react';
import Modelizer from '../vendor/Ry/Core/Modelizer';
import $ from 'jquery';

class Logout extends Component
{
    render() {
        const currentLocale = this.models('props.content.select_languages', false) ? this.cast(this.props.content.select_languages.find(it=>it.selected), 'code') : 'fr'
        return <div id="navbar-menu">
        <ul className="nav navbar-nav">
            {this.models('props.content.select_languages', false)?<li>
                <div className="dropdown show">
                    <a className="btn dropdown-toggle" href="#" role="button" id="language-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className={`flag-icon flag-icon-${currentLocale!='en'?currentLocale:'gb'}`}></span>
                    </a>
                    <div className="dropdown-menu" style={{minWidth:24}} aria-labelledby="dropdownMenuLink">
            {this.models('props.content.select_languages', []).map(language=><a key={`language-select-${language.code}`} className="dropdown-item p-0 text-capitalize" href={langUrl(language.code)}><span className={`flag-icon flag-icon-${language.code!='en'?language.code:'gb'}`}></span></a>)}
                    </div>
                </div>
            </li>:null}
            <li><form method='post' action='/logout' id='logout_form'>
                <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')}/>
                <button className="btn icon-menu"><i
                    className="icon-login"></i></button></form></li>
        </ul>
    </div>
    }
}

export default Modelizer(Logout)