import React, {Component} from 'react';
import {langUrl} from '../../../Ry/Core/Ry';
import Modelizer from '../../../Ry/Core/Modelizer';

class TopRight extends Component
{
    constructor(props) {
        super(props)
        this.state = {
            user : {
                logout : '/logout'
            }
        }
    }

    render() {
        let advanced_functions = null
        if(this.props.advancedFunctions) {
            advanced_functions = <React.Fragment>
                <li><a href="file-dashboard.html"
                className="icon-menu d-none d-sm-block d-md-none d-lg-block"><i
                    className="fa fa-folder-open-o"></i></a></li>
            <li><a href="#"
                className="icon-menu d-none d-sm-block d-md-none d-lg-block"><i
                    className="icon-calendar"></i></a></li>
            <li><a href="#" className="icon-menu d-none d-sm-block"><i
                    className="icon-bubbles"></i></a></li>
            <li><a href="#" className="icon-menu d-none d-sm-block"><i
                    className="icon-envelope"></i><span className="notification-dot"></span></a>
            </li>
            <li className="dropdown"><a href="#"
                className="dropdown-toggle icon-menu" data-toggle="dropdown"> <i
                    className="icon-bell"></i> <span className="notification-dot"></span>
            </a>
                <ul className="dropdown-menu notifications">
                    <li className="header"><strong>You have 4 new Notifications</strong></li>
                    <li><a href="#">
                            <div className="media">
                                <div className="media-left">
                                    <i className="icon-info text-warning"></i>
                                </div>
                                <div className="media-body">
                                    <p className="text">
                                        Campaign <strong>Holiday Sale</strong> is nearly reach
                                        budget limit.
                                    </p>
                                    <span className="timestamp">10:00 AM Today</span>
                                </div>
                            </div>
                    </a></li>
                    <li><a href="#">
                            <div className="media">
                                <div className="media-left">
                                    <i className="icon-like text-success"></i>
                                </div>
                                <div className="media-body">
                                    <p className="text">
                                        Your New Campaign <strong>Holiday Sale</strong> is
                                        approved.
                                    </p>
                                    <span className="timestamp">11:30 AM Today</span>
                                </div>
                            </div>
                    </a></li>
                    <li><a href="#">
                            <div className="media">
                                <div className="media-left">
                                    <i className="icon-pie-chart text-info"></i>
                                </div>
                                <div className="media-body">
                                    <p className="text">Website visits from Twitter is 27% higher
                                        than last week.</p>
                                    <span className="timestamp">04:00 PM Today</span>
                                </div>
                            </div>
                    </a></li>
                    <li><a href="#">
                            <div className="media">
                                <div className="media-left">
                                    <i className="icon-info text-danger"></i>
                                </div>
                                <div className="media-body">
                                    <p className="text">Error on website analytics configurations</p>
                                    <span className="timestamp">Yesterday</span>
                                </div>
                            </div>
                    </a></li>
                    <li className="footer"><a href="#" className="more">See
                            all notifications</a></li>
                </ul></li>
                <li className="dropdown"><a href="#"
                className="dropdown-toggle icon-menu" data-toggle="dropdown"><i
                    className="icon-equalizer"></i></a>
                    <ul className="dropdown-menu user-menu menu-icon">
                        {this.props.data?this.props.data.map((um, key)=><React.Fragment key={`usermenu-heading-${key}`}>
                                <li className="menu-heading text-uppercase">{um.title}</li>
                                {um.children.map((umchild, keychild)=><li key={`usermenu-heading-${key}-${keychild}`}><a href={umchild.href}><i className={umchild.icon}></i> <span>{umchild.title}</span></a></li>)}
                            </React.Fragment>):null}
                    </ul>
                </li>
            </React.Fragment>
        }
        const currentLocale = this.models('props.content.select_languages', false) ? this.cast(this.props.content.select_languages.find(it=>it.selected), 'code') : 'fr'
        return <div id="navbar-menu">
        <ul className="nav navbar-nav">
            {advanced_functions}
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
            <li><a href={this.state.user.logout} className="icon-menu"><i
                    className="icon-login"></i></a></li>
        </ul>
    </div>
    }
}

export default Modelizer(TopRight);