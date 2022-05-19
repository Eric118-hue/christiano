import ReactDOM from 'react-dom';
import React from 'react';
import Lucid, {LucidComponents, LucidWrapper, Wrapper} from '../vendor/lucid';
import './manager.scss';
import '../medias/fonts/leg2.css';
import RyManager from '../vendor/Ry/Manager';
import __OPTIONTREE from '../vendor/Ry/Core/OptionTree';
import __ADMINTOOLS from '../vendor/Ry/Admin/AdminTools';
import __NAVIGATION_BY_ROLE from '../vendor/Ry/Admin/NavigationByRole';
import __CORE from '../vendor/Ry/Core/Core';
import __TRANSLATOR, {TraductionsDialog, Languages} from '../vendor/Ry/Admin/Translator';
import __USER from '../vendor/Ry/Admin/User';
import __CHART from '../vendor/Ry/Core/Charts';
import __EMAILS from '../vendor/Ry/Profile/Emails';
import __EDITOR from '../vendor/Ry/Profile/Editor';
import __CATEGORIES from '../vendor/Ry/Categories';
import __TUTO from '../vendor/Ry/Core/Tuto';
import App from './App';
import Cardit from './Manager/Cardit';
import $ from 'jquery';
import trans from './translations';
import Ry from '../vendor/Ry/Core/Ry';
import Page from '../vendor/Ry/Admin/PageEditor';

/**
@namespace Manager

@description Manager bootstrap

*/

/**
@constant Components
@memberof Manager
@description Routing to all modules of the pages
 */

const Components = {
    App : App,
    Ry : {
        Admin : {
            User : __USER,
            Languages : Languages,
            AdminTools : __ADMINTOOLS,
            NavigationByRole : __NAVIGATION_BY_ROLE,
            Translator : __TRANSLATOR,
            Traductions : TraductionsDialog,
            Page : {
                Form : Page
            }
        },
        Categories : __CATEGORIES,
        Profile : {
            Contact : __EMAILS,
            Editor : __EDITOR
        },
        Cardit : Cardit
    },
    Core : {
        Core : __CORE,
        Tuto : __TUTO,
        OptionTree : __OPTIONTREE,
        Chart : __CHART
    },
    Lucid : LucidComponents
}

class GHALucidWrapper extends LucidWrapper
{
    render() {
        return <Wrapper data={this.props.content} style={{minWidth:960}}altLogo="GHA">
            <Ry class={this.props.content.view} content={this.props.content} components={this.props.components}/>
            <div className="ry-float-loading">
		    	<div className="ry loading-content">
		    		<i className="fa fa-2x fa-sync-alt fa-spin"></i> {trans("Patientez")}
		    	</div>
		    </div>
        </Wrapper>
    }
}

class GHALucid extends Lucid
{
    wrap() {
        const dis = this
        $("script[type='application/ld+json']").each(function(){
            let text = $(this).text()
            const content = JSON.parse(text?text:'{}');
            ReactDOM.render(<GHALucidWrapper content={content} components={dis.components}/>, $(this).parent()[0])
        });
    }
}

const lucid = new GHALucid(Components)
lucid.theme({

})
lucid.render()
const ry = new RyManager.Manager(Components)

export const instance = ry

export const version = 1.0;