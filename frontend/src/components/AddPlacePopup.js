import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {
  const [values, setValues] = React.useState({ name: '', link: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  function handleSubmitAddPlace(e) {
    e.preventDefault();

    props.onAddPlaceSubmit({
      name: values.name,
      link: values.link,
    });
  }
  React.useEffect(() => setValues({ name: '', link: '' }), [props.isOpen]);

  return (
    <PopupWithForm
      /* Add Ele,emt */
      name='add-element'
      title='New place'
      buttonTitle='Create'
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmitAddPlace}
    >
      <input
        value={values.name}
        id='name-element-input'
        type='text'
        name='name'
        className='form__text-input form__text-input_type_name-element'
        placeholder='Title'
        minLength={1}
        maxLength={30}
        required
        onChange={handleChange}
      />
      <span id='name-element-input-error' className='form__input-error'>
        {' '}
      </span>
      <input
        value={values.link}
        id='img-element-input'
        type='url'
        name='link'
        className='form__text-input form__text-input_type_img-element'
        placeholder='Image Url'
        required
        onChange={handleChange}
      />
      <span id='img-element-input-error' className='form__input-error'>
        {' '}
      </span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
