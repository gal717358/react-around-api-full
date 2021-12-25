import React from 'react';

function PopupWithForm(props) {
  return (
    <div
      className={`modal modal_type_${props.name} ${
        props.isOpen && 'modal_opened'
      }`}
    >
      <div className='modal__container'>
        <button
          onClick={props.onClose}
          type='button'
          className='modal__close-btn'
          aria-label='close button'
          name='close button'
        />
        <form className='form' name={`${props.name}`} onSubmit={props.onSubmit}>
          <fieldset className='form__fieldset'>
            <h2 className='form__title'>{`${props.title}`}</h2>
            {props.children}
            <button
              type='submit'
              name='submit button'
              className='form__submit-btn'
            >
              {`${props.buttonTitle}`}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
