/* eslint-disable no-undef */
import Token from '../helpers/Token';
import CONFIG from '../globals/Config';

const covidBASEURL = 'https://disease.sh/v3/covid-19/countries/Indonesia';
const newsAPI = 'https://newsdata.io/api/1/news?apikey=pub_24158c526e30588218db835c18587093386b&country=us&category=health';
const { BASEURL } = CONFIG;

class fetchAPI {
  static async getCovidCase() {
    try {
      const request = await fetch(covidBASEURL);

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async getNews() {
    try {
      const request = await fetch(newsAPI);

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async PatiensSignup({
    username, fullname, password, userType, gender,
  }) {
    try {
      const request = await fetch(`${BASEURL}/users`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          username,
          fullname,
          password,
          userType,
          gender,
        }),
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async DoctorsSignup({
    username, fullname, password, userType, strNum, category, gender,
  }) {
    try {
      const request = await fetch(`${BASEURL}/users`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          username,
          fullname,
          password,
          userType,
          strNum,
          category,
          gender,
        }),
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async Signin({ username, password }) {
    try {
      const request = await fetch(`${BASEURL}/authentications`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async Signout(token) {
    try {
      const request = await fetch(`${BASEURL}/authentications`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
        body: JSON.stringify({
          refreshToken: token,
        }),
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async GenerateAccessToken(refreshToken) {
    const request = await fetch(`${BASEURL}/authentications`, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify({
        refreshToken,
      }),
    });

    return request.json();
  }

  static async UserInfo(accessToken) {
    try {
      const request = await fetch(`${BASEURL}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async GetUserInfo(accessToken, refreshToken) {
    try {
      const req = await this.UserInfo(accessToken);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        Token.Set('accessToken', newAccessToken.data.accessToken);
        const newRes = await this.UserInfo(newAccessToken.data.accessToken);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }

  static async uploadImage(data) {
    try {
      const request = await fetch(`${BASEURL}/upload/images`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        body: data,
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async updateProfile(profileUrl, accessToken) {
    const request = await fetch(`${BASEURL}/user/profile`, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'PUT',
      body: JSON.stringify({
        profileUrl,
      }),
    });

    return request.json();
  }

  static async PutUpdateProfilePhoto(profileUrl, accessToken, refreshToken) {
    try {
      const req = await this.updateProfile(profileUrl, accessToken);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        Token.Set('accessToken', newAccessToken.data.accessToken);
        const newRes = await this.updateProfile(profileUrl, newAccessToken.data.accessToken);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }

  static async doctors(accessToken) {
    try {
      const request = await fetch(`${BASEURL}/doctors`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async GetAllDoctors(accessToken, refreshToken) {
    try {
      const req = await this.doctors(accessToken);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        Token.Set('accessToken', newAccessToken.data.accessToken);
        const newRes = await this.doctors(newAccessToken.data.accessToken);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }

  static async doctorProfileInfo(accessToken, username) {
    try {
      const request = await fetch(`${BASEURL}/doctor/${username}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async GetProfileDoctor(accessToken, refreshToken, username) {
    try {
      const req = await this.doctorProfileInfo(accessToken, username);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        Token.Set('accessToken', newAccessToken.data.accessToken);
        const newRes = await this.doctorProfileInfo(newAccessToken.data.accessToken, username);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }

  static async createRoom(accessToken, username, participant) {
    const request = await fetch(`${BASEURL}/room`, {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'POST',
      body: JSON.stringify({
        username,
        participant,
      }),
    });

    return request.json();
  }

  static async PostCreateRoom({
    accessToken, refreshToken, username, participant,
  }) {
    try {
      const req = await this.createRoom(accessToken, username, participant);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        const token = newAccessToken.data.accessToken;
        Token.Set('accessToken', token);
        const newRes = await this.createRoom(token, username, participant);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }

  static async RoomsChat(accessToken) {
    try {
      const request = await fetch(`${BASEURL}/rooms`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async GetRoomsChat(accessToken, refreshToken) {
    try {
      const req = await this.RoomsChat(accessToken);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        const token = newAccessToken.data.accessToken;
        Token.Set('accessToken', token);
        const newRes = await this.RoomsChat(token);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }

  static async RoomChat(id, accessToken) {
    try {
      const request = await fetch(`${BASEURL}/room/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async GetRoomChat(id, accessToken, refreshToken) {
    try {
      const req = await this.RoomsChat(id, accessToken);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        const token = newAccessToken.data.accessToken;
        Token.Set('accessToken', token);
        const newRes = await this.createRoom(id, token);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }

  static async sendMessage(accessToken, roomId, msgType, msg, sender) {
    try {
      const request = await fetch(`${BASEURL}/room/${roomId}/message`, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify({
          sender,
          message: msg,
          messageType: msgType,
        }),
      });

      return request.json();
    } catch (error) {
      return error;
    }
  }

  static async PostMessage(accessToken, refreshToken, roomId, msgType, msg, sender) {
    try {
      const req = await this.sendMessage(accessToken, roomId, msgType, msg, sender);

      if (req.message === 'Token maximum age exceeded') {
        const newAccessToken = await this.GenerateAccessToken(refreshToken);
        if (newAccessToken.message === 'invalid refresh token') {
          throw new Error('invalid refresh token');
        }
        const token = newAccessToken.data.accessToken;
        Token.Set('accessToken', token);
        const newRes = await this.sendMessage(token, roomId, msgType, msg, sender);
        return newRes;
      }
      return req;
    } catch (error) {
      return error;
    }
  }
}

export default fetchAPI;
