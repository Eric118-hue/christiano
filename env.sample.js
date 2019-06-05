import __fr from '/mnt/hgfs/empire/var/www/macentrale/leg2/resources/lang/fr.json';
import __en from '/mnt/hgfs/empire/var/www/macentrale/leg2/resources/lang/en.json';
import __es from '/mnt/hgfs/empire/var/www/macentrale/leg2/resources/lang/es.json';
import __languages from '/mnt/hgfs/empire/var/www/macentrale/leg2/storage/app/languages.json';
import __logo from '/mnt/hgfs/empire/var/www/macentrale/leg2/public/android-chrome-512x512.png';
import Parsley from 'parsleyjs';
import 'parsleyjs/dist/i18n/fr';
import 'parsleyjs/dist/i18n/fr.extra';

const laravel = '/mnt/hgfs/empire/var/www/macentrale/leg2/'

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