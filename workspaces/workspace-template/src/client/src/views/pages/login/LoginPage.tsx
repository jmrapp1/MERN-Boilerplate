import * as React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { UserLoginResource, JwtResource } from '@modulfy/shared-resources-user';
import { HttpError } from '@modulfy/shared-core-resources';
import { Actions as UserActions } from '@modulfy/client-user';
import PrimaryButton from '../../common/components/buttons/PrimaryButton';
import TextInput from '../../common/components/inputs/TextInput';
import Container from '../../common/components/containers/Container';

import './LoginPage.scss';

class LoginPage extends React.Component<{ login, history }, { username, password }> {
    constructor( props ) {
        super(props);

        this.state = {
            username: '',
            password: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    }

    onChange( e ) {
        this.setState(({ [ e.target.name ]: e.target.value }) as any)
    }

    onSubmit( e ) {
        e.preventDefault();
        this.props.login(new UserLoginResource().init(this.state.username, this.state.password), this.onSuccess, this.onError);
    }

    onError(err: HttpError) {
        toast.error(err.getError(), {
            position: toast.POSITION.TOP_CENTER
        });
    }

    onSuccess(data: JwtResource) {
        toast.success('You have logged in.', {
            position: toast.POSITION.TOP_CENTER
        });
    }

    render() {
        return (
            <div id='login-page'>
                <div className='col-sm-12 col-md-4 col-md-offset-4 vertical-center'>
                    <Container className='login-container'>

                        <form className='login' onSubmit={ this.onSubmit }>
                            <h1 className='login-title'>Login</h1>

                            <div id='login-form' className='form-group'>
                                <TextInput
                                    value={ this.state.username }
                                    onChange={ this.onChange }
                                    name='username'
                                    placeholder='Username'
                                />
                                <br />
                                <TextInput
                                    value={ this.state.password }
                                    onChange={ this.onChange }
                                    type='password'
                                    name='password'
                                    placeholder='Password'
                                />

                                <p>Don't have an account? <Link to='/register'>Register.</Link></p>

                            </div>


                            <div className='btn-group' id='button'>
                                <PrimaryButton text='Login' onClick={ () => {} } />
                            </div>

                        </form>
                    </Container>
                </div>
            </div>
        );
    }

}

export default connect(
    store => ( {
    } ),
    dispatch => ( {
        login: bindActionCreators(UserActions.login, dispatch)
    } )
)(LoginPage);
