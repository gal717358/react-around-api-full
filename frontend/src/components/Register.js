import React from 'react';
import { Link } from 'react-router-dom';

function Register(props) {
  return (
    <div className='form__user_container'>
      <form
        className='form form__user form__user-login'
        onSubmit={props.handleSubmitRegister}
      >
        <fieldset className='form__fieldset'>
          <h1 className='form__title-user'>Register</h1>
          <input
            value={props.values.email}
            id='name-register-input'
            type='text'
            name='email'
            className='form__text-input-user'
            placeholder='Username'
            minLength={2}
            maxLength={30}
            required
            onChange={props.handleChange}
          />
          <input
            value={props.values.password}
            id='name-password-input'
            type='password'
            name='password'
            className='form__text-input-user'
            placeholder='password'
            minLength={2}
            maxLength={30}
            required
            onChange={props.handleChange}
          />
          <button
            type='submit'
            name='login-submit-button'
            className='form__submit-user'
          >
            Register
          </button>
        </fieldset>
      </form>
      <div className='form__register__signin'>
        <p className='register__login_sub-link'>
          Not a member yet?
          <Link to='/login' className='register__login_link'>
            Log in here!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
