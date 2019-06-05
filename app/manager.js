import Lucid from '../vendor/lucid';
import './manager.scss';
import RyManager from '../vendor/Ry/Manager';
import __OPTIONTREE from '../core/OptionTree';
import __ADMINTOOLS from '../vendor/Ry/Admin/AdminTools';
import __NAVIGATION_BY_ROLE from '../vendor/Ry/Admin/NavigationByRole';
import __CORE from '../core/Core';
import __TRANSLATOR, {TraductionsDialog, Languages} from '../vendor/Ry/Admin/Translator';
import __USER from '../vendor/Ry/Admin/User';
import __CHART from '../core/Charts';
import __EMAILS from '../vendor/Ry/Profile/Emails';
import __EDITOR from '../vendor/Ry/Profile/Editor';
import __CATEGORIES from '../vendor/Ry/Categories';
import __TUTO from '../core/Tuto';

const Components = {
    Ry : {
        Admin : {
            User : __USER,
            Languages : Languages,
            AdminTools : __ADMINTOOLS,
            NavigationByRole : __NAVIGATION_BY_ROLE,
            Translator : __TRANSLATOR,
            Traductions : TraductionsDialog
        },
        Categories : __CATEGORIES,
        Profile : {
            Contact : __EMAILS,
            Editor : __EDITOR
        }
    },
    Core : {
        Core : __CORE,
        Tuto : __TUTO,
        OptionTree : __OPTIONTREE,
        Chart : __CHART
    },
    Lucid : Lucid.COMPONENTS
}

const ry = new RyManager(Components)
const lucid = new Lucid(Components)
lucid.theme({

})
lucid.render()

export const instance = ry

export const version = 1.0;