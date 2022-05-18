import React, {Component} from 'react';
import trans from './translations';

class Footernav extends Component
{
    render() {
        return <div className="footer m-5 text-center">
            © 2022 - Macentrale - <a href="/mentions-legales.html">{trans('Mentions légales')}
            </a> - <a href="/cookies.html">{trans('Cookies')}
            </a> - <a href="/charte-rgpd.html">{trans('Charte RGPD')}
            </a> - <a href="/cgu.html">{trans('CGU')}</a>
        </div>
    }
}

export default Footernav;