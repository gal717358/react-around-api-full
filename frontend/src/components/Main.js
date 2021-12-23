import React, { useContext } from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";

function Main(props) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main>
      <div className="profile">
        <button
          onClick={props.onEditAvatarClick}
          className="profile__change-avatar"
          aria-label="edit picture"
          name="edit picture"
          type="button"
        >
          <img
            className="profile__avatar"
            src={`${currentUser.avatar}`}
            alt={`${currentUser.alt}`}
          />
        </button>
        <div className="profile__info">
          <div className="profile__info-top">
            <h1 className="profile__title">{`${currentUser.name}`}</h1>
            <button
              onClick={props.onEditProfileClick}
              className="profile__edit-btn"
              aria-label="edit button"
              name="edit button"
              type="button"
            />
          </div>
          <p className="profile__job">{`${currentUser.about}`}</p>
        </div>
        <button
          onClick={props.onAddPlaceClick}
          className="profile__add-btn"
          aria-label="add button"
          name="add button"
          type="button"
        />
      </div>
      <div className="elements">
        {props.cards.map((data) => {
          return (
            <Card
              card={data}
              onCardClick={props.onCardClick}
              onDeleteCardClick={props.onDeleteCardClick}
              onCardLike={props.onCardLike}
              key={data._id}
              imagePopupOpen={props.onImagePopupClick}
            />
          );
        })}
      </div>
    </main>
  );
}
export default Main;
