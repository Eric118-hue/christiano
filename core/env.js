import __fr from '/mnt/hgfs/empire/var/www/macentrale/centrale/resources/lang/fr.json';
import __en from '/mnt/hgfs/empire/var/www/macentrale/centrale/resources/lang/en.json';
import __es from '/mnt/hgfs/empire/var/www/macentrale/centrale/resources/lang/es.json';
import __languages from '/mnt/hgfs/empire/var/www/macentrale/centrale/storage/app/languages.json';
import __logo from '/mnt/hgfs/empire/var/www/macentrale/centrale/public/android-chrome-512x512.png';
import Parsley from 'parsleyjs';
import 'parsleyjs/dist/i18n/fr';
import 'parsleyjs/dist/i18n/fr.extra';

const laravel = '/mnt/hgfs/empire/var/www/macentrale/centrale/'

const config = {
    laravel : {
        public : `${laravel}public/`,
        root : laravel
    }
}

export const frtranslations = __fr;
export const entranslations = __en;
export const estranslations = __es;

export const languages = __languages;

export const logo = __logo;

export default config;