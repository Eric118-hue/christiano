import __languages from '/home/admin/www/macentrale/gha/storage/app/languages.json';
import __logo from './medias/images/topmora.svg';
import Parsley from 'parsleyjs';
import 'parsleyjs/dist/i18n/fr';
import 'parsleyjs/dist/i18n/fr.extra';

const laravel = '/home/admin/www/macentrale/gha/'

const config = {
    laravel : {
        public : `${laravel}public/`,
        root : laravel
    }
}

export const languages = __languages;

export const logo = __logo;

export default config;
