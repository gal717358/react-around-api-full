import PopupWithForm from "./PopupWithForm";
import React, { useState } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, props.isOpen]);

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleChangeDescription(e) {
    setDescription(e.target.value);
  }

  function handleSubmitUser(e) {
    e.preventDefault();

    props.onUpdateUser({ name, about: description });
  }

  return (
    <PopupWithForm
      /* profile */
      name="profile"
      title="Edit Profile"
      buttonTitle="save"
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmitUser}
    >
      <input
        onChange={handleChangeName}
        id="name-input"
        type="text"
        name="name"
        value={`${name}`}
        className="form__text-input form__text-input_type_name"
        minLength={2}
        maxLength={40}
        required
      />
      <span id="name-input-error" className="form__input-error">
        {" "}
      </span>
      <input
        onChange={handleChangeDescription}
        id="job-input"
        type="text"
        name="job"
        value={`${description}`}
        className="form__text-input form__text-input_type_job"
        minLength={2}
        maxLength={200}
        required
      />
      <span id="job-input-error" className="form__input-error">
        {" "}
      </span>
    </PopupWithForm>
  );
}
export default EditProfilePopup;
