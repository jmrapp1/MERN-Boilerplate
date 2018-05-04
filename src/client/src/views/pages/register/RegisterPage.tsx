import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Actions as UserActions } from '../../../redux/modules/user/';
import './RegisterPage.scss';
import PrimaryButton from '../../common/components/buttons/PrimaryButton';
import TextInput from '../../common/components/inputs/TextInput';
import Container from '../../common/components/containers/Container';
import { toast } from 'react-toastify';
import UserRegisterResource from '../../../../../shared/resources/user/UserRegisterResource';
import { Link } from 'react-router-dom';

class RegisterPage extends React.Component<{ register }, { username, email, firstName, lastName, phone, password, confirmPassword }> {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
    }

    onSuccess(message) {
        toast.success('You have registered successfully.', {
            position: toast.POSITION.TOP_CENTER
        });
    }

    onError(error) {
        toast.error(error.getError(), {
            position: toast.POSITION.TOP_CENTER
        });
    }

    onChange(e) {
        this.setState({ [ e.target.name ]: e.target.value })
    }

    onSubmit() {
        this.props.register(new UserRegisterResource(
            this.state.username, this.state.email, this.state.firstName,
            this.state.lastName, this.state.phone, this.state.password, this.state.confirmPassword
        ), this.onSuccess, this.onError);
    }

    render() {
        return (
            <div id='register-page'>
                <div className='col-sm-12 col-md-4 col-md-offset-4 vertical-center'>
                    <Container className='register-container'>
                        <form className='register'>
                            <h1 className='register-title'>Register</h1>

                            <div className='form-group'>
                                <TextInput
                                    value={ this.state.email }
                                    onChange={ this.onChange }
                                    name='email'
                                    placeholder='Email'
                                />

                                <TextInput
                                    value={ this.state.username }
                                    onChange={ this.onChange }
                                    name='username'
                                    placeholder='Username'
                                />

                                <TextInput
                                    value={ this.state.firstName }
                                    onChange={ this.onChange }
                                    name='firstName'
                                    placeholder='First Name'
                                />

                                <TextInput
                                    value={ this.state.lastName }
                                    onChange={ this.onChange }
                                    name='lastName'
                                    placeholder='Last Name'
                                />

                                <TextInput
                                    value={ this.state.phone }
                                    onChange={ this.onChange }
                                    type='number'
                                    name='phone'
                                    placeholder='Phone Number'
                                />

                                <TextInput
                                    value={ this.state.password }
                                    onChange={ this.onChange }
                                    type='password'
                                    name='password'
                                    placeholder='Password'
                                />

                                <TextInput
                                    value={ this.state.confirmPassword }
                                    onChange={ this.onChange }
                                    type='password'
                                    name='confirmPassword'
                                    placeholder='Confirm Password'
                                />
                            </div>
                        </form>
                        <p>Already have an account? <Link to='/login'>Login.</Link></p>

                        <div className='btn-group' id='button'>
                            <PrimaryButton text='Register' onClick={ this.onSubmit }/>
                        </div>
                    </Container>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ( {} ),
    dispatch => ( {
        register: bindActionCreators(UserActions.register, dispatch)
    } )
)(RegisterPage);
