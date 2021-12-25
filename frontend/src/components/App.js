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
  }, [history, token]);

  //handleChanges
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };
  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        const { data } = newCard;
        setCardsData((cards) =>
          cards.map((c) => (c._id === card._id ? data : c)),
        );
      })
      .catch((err) => console.log(err));
  };

  function handleCardDelete(selectedCard) {
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
        .getAllInfo(token)
        .then(([cardArray, userInfo]) => {
          setCurrentUser(userInfo.data);
          setCardsData(cardArray.data);
        })
        .catch((err) => console.log(err));
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
    handleCardDelete(selectedCard);
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
          console.log('response: ', serverResponse);
          setCurrentUser(serverResponse.data);
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
          setCurrentUser(serverResponse.data);
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
          return setCardsData([res.data, ...cardsData]);
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
                cardsData={cardsData}
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
