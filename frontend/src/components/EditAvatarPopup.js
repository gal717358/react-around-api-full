import React from "react";
import PopupWithForm from "./PopupWithForm";
import { useRef } from "react";

function EditAvatarPopup(props) {
  const avatarElement = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    props.onUpdateAvatar({avatar:avatarElement.current.value});
  }

  return (
    <PopupWithForm
      /* change avatar */
      name="change-picture"
      title="Change profile picture"
      buttonTitle="Save"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
    >
      <input
        ref={avatarElement}
        id="change-picture-input"
        type="url"
        name="link"
        className="form__text-input form__text-input_type_change-picture"
        placeholder="profile Url"
        required
      />
      <span id="change-picture-input-error" className="form__input-error">
        {" "}
      </span>
    </PopupWithForm>
  );
}
export default EditAvatarPopup;
