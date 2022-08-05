import React, {Component} from 'react';
import trans from '../../../../app/translations';
import $ from 'jquery';

class Login extends Component
{
    render() {
        return <main className="py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        <div className="card border-0">
                            <div className="card-header login-header">
                                <h2 className="m-0">{this.props.data.page.title}</h2>
                            </div>

                            <div className="card-body p-0">
                                <form method="POST" action="/login">
                                    <input type="hidden" name="_token" value={$('meta[name=csrf-token]').attr('content')}/>
                                    <div className="p-4 bg-light">
                                        <div className="form-group">
                                            <input id="email" type="email" className="form-control border-0" name="email" required placeholder="E-Mail Address" autoFocus=""/>

                                                                        </div>

                                        <div className="form-group">
                                            <input id="password" type="password" className="form-control border-0" name="password" placeholder="Password" required/>

                                                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" name="remember" id="remember" data-parsley-multiple="remember"/>
                                                        <label className="form-check-label" htmlFor="remember">
                                                            {trans('Se souvenir de moi')}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <a className="btn btn-link p-0" href="/password/reset">
                                                        {trans('Mot de passe oublié?')}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary btn-block btn-login btn-lg">
                                                {trans('Se connecter')}
                                            </button>
                                        </div>
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    }
}

export default Login;