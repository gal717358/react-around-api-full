function InfoTooltip(props) {
  return (
    <div
      className={`modal modal_type_${props.name} ${props.isOpen && 'modal_opened'}`}
    >
      <div className='modal__container'>
      <button
        onClick={props.onClose}
        type='button'
        className='modal__close-btn'
        aria-label='close button'
        name='close button'
      />
        <img className='modal__infoToolTip_image'  src={props.path} alt='info-toolTip' />
        <h1 className='modal__infoToolTip_title'>
          {props.message}
        </h1>
      </div>
    </div>
  );
}

export default InfoTooltip;
