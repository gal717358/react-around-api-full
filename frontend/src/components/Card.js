import React, { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Card(props) {
  const currentUser = useContext(CurrentUserContext);
  const isOwn = props.card.owner._id === currentUser._id;
  const isLiked = props.card.likes.some((i) => i._id === currentUser._id);

  function handleClick() {
    props.onCardClick(props.card);
    props.imagePopupOpen();
  }

  const handleLikeClick = () => {
    props.onCardLike(props.card);
  };

  function handleDeleteClick() {
    props.onDeleteCardClick(props.card);

  }

  return (
    <div className="element">
      <button
        onClick={handleDeleteClick}
        type="button"
        className={`element__delete ${
          isOwn ? "element__delete" : "element__delete_hidden"
        }`}
        name="delete button"
      />
      <img
        onClick={handleClick}
        className="element__image"
        alt={props.card.alt}
        src={props.card.link}
      />
      <div className="element__description">
        <h2 className="element__title"> {props.card.name}</h2>
        <div className="element__like-container">
          <button
            onClick={handleLikeClick}
            type="button"
            className={`element__like-btn ${
              isLiked ? "element__like-btn_active" : ""
            }`}
            aria-label="like-button"
          />
          <span className="element__likes-count">
            {props.card.likes.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Card;
