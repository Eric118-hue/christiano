import Lucid, {LucidComponents} from '../vendor/lucid';
import './manager.scss';
import RyAdmin from '../vendor/Ry/Admin';
import __OPTIONTREE from '../vendor/Ry/Core/OptionTree';
import __ADMINTOOLS from '../vendor/Ry/Admin/AdminTools';
import __NAVIGATION_BY_ROLE from '../vendor/Ry/Admin/NavigationByRole';
import __CORE from '../vendor/Ry/Core/Core';
import __TRANSLATOR from '../vendor/Ry/Admin/Translator';
import __USER from '../vendor/Ry/Admin/User';
import __CHART from '../vendor/Ry/Core/Charts';
import __EMAILS from '../vendor/Ry/Profile/Emails';
import __EDITOR from '../vendor/Ry/Profile/Editor';
import __CATEGORIES from '../vendor/Ry/Categories';
import __TUTO from '../vendor/Ry/Core/Tuto';
import Admin from '../vendor/Ry/Admin';

const Components = {
    Ry : {
        Admin : Admin,
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
    Lucid : LucidComponents
}

const ry = new RyAdmin.Admin(Components)
const lucid = new Lucid(Components)
lucid.theme({

})
lucid.render()

export const instance = ry

export const version = 1.0;