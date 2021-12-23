import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import PopupWithForm from './PopupWithForm.js';
import EditProfilePopup from './EditProfilePopup.js';
import { useState, useEffect } from 'react';
import ImagePopup from './ImagePopup.js';
import api from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import EditAvatarPopup from './EditAvatarPopup.js';
import AddPlacePopup from './AddPlacePopup';
import { Route, Switch, useHistory } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute.js';
import * as auth from '../utils/auth';
import InfoTooltip from './InfoTooltip.js';
import successPath from '../images/infoToolTip-black.svg';
import failPath from '../images/error-simbol.svg';

function App() {
  const history = useHistory();
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cardsData, setCardsData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [toolTip, setToolTip] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  //logout
  const handleLogOut = (e) => {
    e.preventDefault();
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };
  // register

  const handleSubmitRegister = (e) => {
    e.preventDefault();

    auth
      .register(values)
      .then(() => {
        handleIsRegistered();
      })
      .catch((err) => {
        console.log(`...Error: ${err.message}`);
      })
      .finally(() => handleToolTip());
  };

  //login
  const handleSubmitLogin = (e) => {
    e.preventDefault();
    if (!values.email || !values.password) {
      return;
    }
    auth
      .login(values)
      .then((res) => {
        setToken(res.token);
        handleIsLoggedIn();
        history.push('/');
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      if (token) {
        auth
          .checkToken(token)
          .then(() => {
            setToken(token);
            setIsLoggedIn(true);
            history.push('/');
          })
          .catch((err) => {
            console.log(`...Error: ${err}`);
          });
      }
    }
  }, [history, token]);

  //handleChanges
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };


  function handleCardLike(cardData) {
      const isLiked = cardData.likes.some(
        (item) => item._id === currentUser._id,
      );
      if (!isLiked)
        api
          .likeCard(cardData._id, token)
          .then((newCard) => {
            setCardsData((cards) =>
              cards.map((card) => (card._id === cardData._id ? newCard : card)),
            );
          })
          .catch((err) => console.log(`${err}`));
      else
        api
          .deleteLike(cardData._id, token)
          .then((newCard) => {
            setCardsData((cards) =>
              cards.map((card) => (card._id === cardData._id ? newCard : card)),
            );
          })
          .catch((err) => console.log(`${err}`));
  }
console.log(token)

  function handleCardDelete() {
      api
        .deleteCard(selectedCard._id, token)
        .then(() => {
          setCardsData((cards) =>
            cards.filter((card) => card._id !== selectedCard._id),
          );
          closeAllPopups();
        })
        .catch((err) => console.log(`${err}`));
  }

  useEffect(() => {
    if (token) {
      api
        .getInitialCards(token)
        .then((cardArray) => {
          return setCardsData(cardArray);
        })
        .catch((err) => console.log(`${err}`));
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      api
        .getUserInfo(token)
        .then((res) => {
          const userData = res;
          setCurrentUser(userData);
        })
        .catch((err) => console.log(`${err}`));
    }
  }, [token]);

  const handleIsLoggedIn = () => {
    setIsLoggedIn(true);
  };
  const handleIsRegistered = () => {
    setIsRegistered(true);
  };
  const handleDeleteClick = (e) => {
    e.preventDefault();
    handleCardDelete(selectedCard._id);
  };

  const handleToolTip = () => {
    setToolTip(true);
  };

  const imagePopupOpen = () => {
    setIsImagePopupOpen(true);
  };

  const handleCardClick = (props) => {
    setSelectedCard(props);
  };

  const handleDeleteCardClick = (card) => {
    setIsDeletePopupOpen(true);
    setSelectedCard(card);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  function toolTipClose() {
    setToolTip(false);
    history.push('/login');
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsDeletePopupOpen(false);
    setIsImagePopupOpen(false);
    setToolTip(false);
    setSelectedCard({});
  }

  useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);

    return () => document.removeEventListener('keydown', closeByEscape);
  }, []);

  const handleUpdateUser = (newData) => {
    if (token) {
      api
        .editProfile(newData, token)
        .then((serverResponse) => {
          return setCurrentUser(serverResponse);
        })
        .then(() => {
          closeAllPopups();
        })
        .catch((err) => console.log(`${err}`));
    }
  };

  const handleUpdateAvatar = (newData) => {
    if (token) {
      api
        .avatarImage(newData, token)
        .then((serverResponse) => {
          return setCurrentUser(serverResponse);
        })
        .then(() => {
          closeAllPopups();
        })
        .catch((err) => console.log(`${err}`));
    }
  };

  const handleAddPlaceSubmit = (newCard) => {
    if (token) {
      api
        .createCard(newCard, token)
        .then((res) => {
          console.log('createUSer', token);
          return setCardsData([res, ...cardsData]);
        })
        .then(() => {
          closeAllPopups();
        })
        .catch((err) => console.log(`${err}`));
    }
  };

  return (
    <div className='page'>
      <div className='page__container'>
        <CurrentUserContext.Provider value={currentUser}>
          <Switch>
            <ProtectedRoute exact path='/' isLoggedIn={isLoggedIn}>
              <Header
                values={values}
                isLoggedIn={isLoggedIn}
                handleLogOut={handleLogOut}
              />
              <Main
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddPlaceClick={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onImagePopupClick={imagePopupOpen}
                onDeleteCardClick={handleDeleteCardClick}
                cards={cardsData}
                onCardLike={handleCardLike}
              />
            </ProtectedRoute>

            <Route path='/login'>
              <Header
                values={values}
                isLoggedIn={isLoggedIn}
                link='/register'
                linkName='Sign Up'
              />
              <Login
                handleSubmitLogin={handleSubmitLogin}
                values={values}
                handleChange={handleChange}
              />
            </Route>
            <Route path='/register'>
              <Header
                values={values}
                isLoggedIn={isLoggedIn}
                link='/login'
                linkName='Sign in'
              />
              <Register
                values={values}
                handleSubmitRegister={handleSubmitRegister}
                handleChange={handleChange}
              />
            </Route>
          </Switch>
          <Footer />
          <InfoTooltip
            name='infoToolTip'
            message={
              isRegistered
                ? 'Success! You have now been logged in.'
                : 'Oops, something went wrong! Please try again.'
            }
            path={isRegistered ? successPath : failPath}
            isOpen={toolTip}
            handleToolTip={handleToolTip}
            onClose={isRegistered ? toolTipClose : closeAllPopups}
          />

          <ImagePopup
            name='pop-up'
            isOpen={isImagePopupOpen}
            onClose={closeAllPopups}
            card={selectedCard}
          />

          <EditProfilePopup
            /* profile */
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />

          <AddPlacePopup
            /* Add Element */
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            handleChange={handleChange}
          />

          <EditAvatarPopup
            /* change avatar */
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <PopupWithForm
            /* delete */
            name='delete-card'
            title='Are you sure?'
            buttonTitle='Yes'
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onSubmit={handleDeleteClick}
          />
        </CurrentUserContext.Provider>
      </div>
    </div>
  );
}

export default App;
