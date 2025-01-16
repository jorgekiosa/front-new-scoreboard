/* import useAppStore from "@/stores/app"; */
import useAuthStore from "@/stores/auth";
import { $api } from "@/service/api";
import { storeToRefs } from "pinia";
import { io } from 'socket.io-client';
const USER_SESSION = "DO_USER_SESSION";
const USER_REMEMBER_ME = "DO_USER_REMEMBER_ME";
const EMPTY_AVATAR = "/assets/img/gen_user.png";
const TOKEN_EXPIRE = 30;
const TOKENS = "DO_TOKENS";

/**
 * Set the token on the local storage for 30 days.
 * If it is not in the local storage, then save the token on the backend.
 * @param token
 * @param type
 * @return {Promise<void>}
 */
async function _updateToken({ token, type }, session) {
  const sTokens = window.localStorage.getItem(TOKENS);
  let tokens = {};
  try {
    tokens = JSON.parse(sTokens) || {};
    const tokenData = tokens[token];
    if (tokenData) {
      // check expiration
      const timestamp = tokenData.timestamp;
      const hasElapsed = utils.date.hasElapsed(timestamp, TOKEN_EXPIRE);
      if (hasElapsed) {
        delete tokenData[token];
        window.localStorage.setItem(TOKENS, JSON.stringify(tokenData));
      }
    } else {
      _saveToken(tokens, token, type, session);
    }
  } catch (ex) {
    _saveToken(tokens, token, type, session);
  }
}

export default {
  setToken(token, type) {
    this._token = { token, type };
  },
  async updateToken() {
    await _updateToken(this._token, this.session);
  },
  isLogged() {
    let sessionExists =
      this.session !== "" &&
      this.session !== undefined &&
      this.session !== null;
    if (!sessionExists) {
      sessionExists = this.recoverSession();
    }
    return sessionExists;
  },
  recoverSession() {
    let sessionData = window.sessionStorage.getItem(USER_SESSION);
    if (!sessionData) {
      sessionData = window.localStorage.getItem(USER_SESSION);
    }

    if (sessionData) {
      try {
        const user = JSON.parse(sessionData);
        this._userData = user;
        this._session = user.sessionId;
        const appStore = useAppStore();
        user.rememberMe = rememberMe;
        appStore.recoverSession();
        return true;
      } catch (ex) { }
    }
    return false;
  },
  cleanSession() {
    this._userData = null;
    this._session = null;
    this._token = {};
    window.localStorage.removeItem(USER_SESSION);
    window.localStorage.removeItem("Authorization");
    window.sessionStorage.removeItem(USER_SESSION);
  },
  async login(payload) {
    return new Promise(async (resolve, reject) => {
      try {
        $api
          .post("/login", payload)
          .then(({ data, status }) => {
            if (data.status == 1 || data.status == '1') {
/*               if (!data.data.initialStatus) {
                this.setContext(data);

                resolve({ code: 0, message: "Acesso Permitido!", data });
              } else {
                resolve({ code: 6, message: "Necessario Alterar a Senha!", data });
              } */
              const token = data.data&&data.data.token 
              // Envia o token para o servidor WebSocket
                  const socket = io(import.meta.env.VITE_WEBSOCKT_BASE_URL || 'http://localhost:3007', {
                  auth: { token }
              });
              socket.emit('sendToken', token);
              this.setContext(data.data);
              resolve({ code: 1, message: "Acesso Permitido!!" });
            } else if(data.status == 0 || data.status == '0'){

            }else {
              resolve({ code: 6, message: "Necessario Alterar a Senha!", data });
              resolve({
                code: 1,
                message: "Ops!! Este utilizador está inativo (desativado).",
              });

            }

          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status === 400) {
                resolve({ code: 4, message: error.response.data.message });
              } else if (error.response.status === 500) {
                resolve({ code: 4, message: error.response.data.message });
              }
            } else {
              resolve({
                code: 5,
                message: "Ocorreu um erro, verifique a sua conexão.",
              });
            }
          });
      } catch (error) {
        resolve({
          code: 4,
          message: "Ops! Verifique a sua conexão, ocorreu um erro. ",
        });
      }
    });
  },
  async logout() {
    const loginUrl = this.loginUrl;
    if (!this._session) {
      this.cleanSession();
      return loginUrl;
    }
    this.cleanSession();

    const authStore = useAuthStore();
    authStore.cleanSession();

    return loginUrl;
  },
  setContext(context = {}) {
    const userData = context;
    this._userData = userData.data;
    this._token = userData.token;
    window.localStorage.setItem("Authorization", userData.token);
    window.localStorage.setItem(USER_SESSION, JSON.stringify(this._userData?.[0]));
    window.sessionStorage.setItem(
      USER_SESSION,
      JSON.stringify(this._userData?.[0])
    );
  },
  setAvatar(avatar = "") {
    if (avatar === "") {
      avatar = EMPTY_AVATAR;
    }
    this._userData.avatar = avatar;
  },
};
