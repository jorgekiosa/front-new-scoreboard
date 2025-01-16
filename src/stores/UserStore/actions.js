import { storeToRefs } from "pinia";
import useAuthStore from "@/stores/auth";
import { $api } from "@/service/api";

function getAuthToken() {
  const authStore = useAuthStore(); // Isso será executado quando o Pinia estiver ativo
  const { token } = storeToRefs(authStore);
  return token.value;
}

function propsAsStringParamsUrl(obj) {
  if (obj) {
    return Object.keys(obj)
      .map(function (k) {
        return k + '=' + obj[k]
      })
      .join('&')
  } else {
    return ''
  }
}
function cleanObjectNull(obj) {
  for (const propName in obj) {
    if (obj[propName] === '' || obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
  return obj
}
export default {
  async listUsers(payload) {
    const token = getAuthToken(); 
    return new Promise(async (resolve, reject) => {
      const paramsUrl = propsAsStringParamsUrl(cleanObjectNull(payload))
      try {
        $api
          .get(`/users?${paramsUrl}`,{
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Allow-Methods": "*",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(({ data, status }) => {
            this._users = data.data;
            this._pageSize = data.pageSize,
            this._totalPage = data.totalPage,
            this._totalItems = data.totalItems,
            resolve({ code: 1, data: data, message: 'Operação realizada com sucesso!!' })
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status === 400)
                resolve({ code: 4, message: error.response.data.Message });
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

  async listOneUser(payload) {
    return new Promise(async (resolve, reject) => {
      const paramsUrl = propsAsStringParamsUrl(cleanObjectNull(payload))
      try {
        $api
          .get(`/users/${payload}`,{
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Allow-Methods": "*",
              Authorization: `Bearer ${authStore.token.value}`,
            },
          })
          .then(({ data, status }) => {
            this._detailsEvents = data.data;
            resolve({ code: 1, data: data, message: 'Operação realizada com sucesso!!' })
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status === 400)
                resolve({ code: 4, message: error.response.data.Message });
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


  async addUser(payload) {
    const token = getAuthToken(); 
    return new Promise(async (resolve, reject) => {
      try {
        $api
          .post("/register", payload,{
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Allow-Methods": "*",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(({ data, status }) => {
            if (data.status == 1 || data.status == '1') {
              resolve({
                code: 1,
                message: data && data.message,
                data,
              });
            } else {
              resolve({
                code: 2,
                data: data,
                message: data && data.message,
              });
            }
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status === 400)
                resolve({ code: 4, message: error.response.data.Message });
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

  async updateUser(payload) {
    console.log("payload", payload)
    const token = getAuthToken(); 
    return new Promise(async (resolve, reject) => {
      try {
        $api
          .put(`/users/${payload.id}`, payload, {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Allow-Methods": "*",
              Authorization: `Bearer ${token}`,
            },
          })
          .then(({ data, status }) => {
            if (data.status == 1 || data.status == '1') {
              resolve({
                code: 1,
                message: data && data.message,
                data,
              });
            } else {
              resolve({
                code: 2,
                data: data,
                message: data && data.message,
              });
            }
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status === 400){
                const errorData = error.response.data;
              if (errorData.errors) {
                const errorMessages = Object.entries(errorData.errors).map(([key, messages]) => {
                  return messages.map(message => `${key}: ${message}`).join('\n');
                });
                  resolve({ code: 4, message: errorMessages });
                }
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
  async deleteUser(payload) {
    const token = getAuthToken(); 
    return new Promise(async (resolve, reject) => {
      try {
        $api.delete(`/users/${payload}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "*",
            Authorization: `Bearer ${token}`,
          },
        })
          .then(({ data, status }) => {
            if (data.status == 1 || data.status == '1') {
              resolve({
                code: 1,
                message: data && data.message,
                data,
              });
            } else {
              resolve({
                code: 2,
                data: data,
                message: data && data.message,
              });
            }
          })
          .catch(function (error) {
            if (error.response) {
              if (error.response.status === 400)
                resolve({ code: 4, message: error.response.data.Message });
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
          message: error,
        });
      }
    });
  },

}
