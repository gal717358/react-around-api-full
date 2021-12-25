const customFetch = (url, headers) =>
  fetch(url, headers).then((res) =>
    res.ok ? res.json() : Promise.reject(res.statusText)
  );

class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }

  getAllInfo(token) {
    return Promise.all([this.getInitialCards(token), this.getUserInfo(token)]);
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
  changeLikeCardStatus(cardId, isLiked, token) {
    return customFetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: !isLiked ? 'DELETE' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
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


