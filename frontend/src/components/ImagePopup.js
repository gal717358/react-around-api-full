function ImagePopup(props) {
  return (
    <div
      className={`modal modal_type${props.name} ${
        props.isOpen && "modal_opened" 
      }`}
    >
      <div className="modal__container modal__container_type_popup">
        <button
          onClick={props.onClose}
          type="button"
          className="modal__close-btn"
          aria-label="close button popup"
          name="popup close button"
        />
        <img
          className="modal__img"
          alt={props.card.name}
          src={props.card.link}
        />
        <h2 className="modal__title">{props.card.name}</h2>
      </div>
    </div>
  );
}

export default ImagePopup;
