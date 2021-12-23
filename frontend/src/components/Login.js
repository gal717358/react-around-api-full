import React from 'react';
import { Link } from 'react-router-dom';

function Login(props) {
  return (
    <div className='form__user_container'>
      <form
        className='form form__user form__user-login'
        onSubmit={props.handleSubmitLogin}
      >
        <fieldset className='form__fieldset'>
          <h1 className='form__title-user'>Log in</h1>
          <input
            value={props.values.email}
            id='name-login-input'
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
            name='login submit button'
            className='form__submit-user'
          >
            Login
          </button>
        </fieldset>
      </form>
      <div className='form__register__signin'>
        <p className='register__login_sub-link'>
          Not a member yet?
          <Link to='/register' className='register__login_link'>
            Sign up here!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
