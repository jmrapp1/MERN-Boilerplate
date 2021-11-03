import * as React from 'react';
import './LoginPage.scss';
import { Link } from 'react-router-dom';
import PrimaryButton from '../../common/components/buttons/PrimaryButton';
import TextInput from '../../common/components/inputs/TextInput';
import { Actions as UserActions } from '../../../redux/modules/user';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Container from '../../common/components/containers/Container';
import { toast } from 'react-toastify';
import UserLoginResource from '../../../../../shared/resources/user/UserLoginResource';
import JwtResource from '../../../../../shared/resources/user/JwtResource';
import HttpError from '../../../../../shared/errors/HttpError';

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
        this.setState({ [ e.target.name ]: e.target.value } as any)
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
