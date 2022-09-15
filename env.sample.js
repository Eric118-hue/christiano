import __logo from './medias/images/topmora.svg';
import Parsley from 'parsleyjs';
import 'parsleyjs/dist/i18n/fr';
import 'parsleyjs/dist/i18n/fr.extra';

const laravel = '/var/www/macentrale/gha/'

const config = {
    laravel : {
        public : `${laravel}public/`,
        root : laravel
    },
    
}


export const languages = {};

export const logo = __logo;

export default config;
