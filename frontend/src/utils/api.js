const customFetch = (url, headers) =>
  fetch(url, headers).then((res) =>
    res.ok ? res.json() : Promise.reject(res.statusText)
  );

class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getInitialCards(token) {
    return customFetch(`${this.baseUrl}/cards`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getUserInfo(token) {
    return customFetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }
    });
  }

  createCard(data, token) {
    return customFetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
  }

  editProfile(profileInfo, token) {
    return customFetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileInfo),
    });
  }

  deleteCard(cardId,token) {
    return customFetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }
    });
  }

  likeCard(cardId, token) {
    return customFetch(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }
    });
  }

  deleteLike(cardId, token) {
    return customFetch(`${this.baseUrl}/cards/likes/${cardId}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }
    });
  }

  avatarImage(avatarSrc, token) {
    return customFetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify(avatarSrc),
    });
  }
}

export const api = new Api({
  baseUrl: "https://api.gal717358.students.nomoreparties.site",

});

export default api;
// const customFetch = (url, headers) =>
//   fetch(url, headers).then((res) =>
//     res.ok ? res.json() : Promise.reject(res.statusText)
//   );

// class Api {
//   constructor({ baseUrl, headers }) {
//     this.baseUrl = baseUrl;
//     this.headers = headers;
//   }

//   getInitialCards() {
//     return customFetch(`${this.baseUrl}/cards`, {
//       method: "GET",
//       headers: this.headers,
//     });
//   }

//   getUserInfo() {
//     return customFetch(`${this.baseUrl}/users/me`, {
//       method: "GET",
//       headers: this.headers,
//     });
//   }

//   createCard(data) {
//     return customFetch(`${this.baseUrl}/cards`, {
//       headers: this.headers,
//       method: "POST",
//       body: JSON.stringify(data),
//     });
//   }

//   editProfile(profileInfo) {
//     return customFetch(`${this.baseUrl}/users/me`, {
//       headers: this.headers,
//       method: "PATCH",
//       body: JSON.stringify(profileInfo),
//     });
//   }

//   deleteCard(cardId) {
//     return customFetch(`${this.baseUrl}/cards/${cardId}`, {
//       headers: this.headers,
//       method: "DELETE",
//     });
//   }

//   likeCard(cardId) {
//     return customFetch(`${this.baseUrl}/cards/likes/${cardId}`, {
//       headers: this.headers,
//       method: "PUT",
//     });
//   }

//   deleteLike(cardId) {
//     return customFetch(`${this.baseUrl}/cards/likes/${cardId}`, {
//       headers: this.headers,
//       method: "DELETE",
//     });
//   }

//   avatarImage(avatarSrc) {
//     return customFetch(`${this.baseUrl}/users/me/avatar`, {
//       headers: this.headers,
//       method: "PATCH",
//       body: JSON.stringify(avatarSrc),
//     });
//   }
// }

// export const api = new Api({
//   baseUrl: "https://around.nomoreparties.co/v1/group-12",
//   headers: {
//     authorization: "c1447c07-9b09-4ed7-9490-5ede153a83d9",
//     "Content-Type": "application/json",
//   },
// });

// export default api;

