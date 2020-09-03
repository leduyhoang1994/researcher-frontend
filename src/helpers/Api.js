import Axios from "axios";
import { NotificationManager } from '../components/common/react-notifications';
import { isFunction } from "formik";
// Add a request interceptor
Axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('user_token');
  config.headers.Authorization = 'Bearer ' + token;

  return config;
});
const ApiController = {
  callAsync: async (method, url, data, options = {}) => {
    switch (method) {
      case 'get': case 'GET':
        return await ApiController.getAsync(url, data, options);
      case 'post': case 'POST':
        return await ApiController.postAsync(url, data, options);
      case 'put': case 'PUT':
        return await ApiController.putAsync(url, data, options);
      default:
        break;
    }
  },

  serialize: (obj, prefix) => {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          ApiController.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  },

  getAsync: async (url, data, options) => {
    let params = '';
    if (data) {
      params = '?' + ApiController.serialize(data);
    }
    const result = await Axios.get(`${url}${params}`, options);
    if (options.data) {
      return result.result[options.data]
    }
    return result;
  },

  postAsync: async (url, data, options) => {
    return await Axios.post(url, data, options);
  },

  putAsync: async (url, data, options) => {
    return await Axios.put(url, data, options);
  },

  call: (method, url, data, callback, options = {}) => {
    switch (method) {
      case 'get': case 'GET':
        ApiController.get(url, data, callback, options);
        break;
      case 'post': case 'POST':
        ApiController.post(url, data, callback, options);
        break;
      case 'put': case 'PUT':
        return ApiController.put(url, data, callback, options);
      case 'delete': case 'DELETE':
        return ApiController.delete(url, data, callback, options);
      default:
        break;
    }
  },
  get: (url, data, callback, options = {}) => {
    let params = '';
    if (data) {
      params = '?' + ApiController.serialize(data);
    }
    Axios
      .get(`${url}${params}`)
      .then(res => {
        return res.data;
      })
      .then(data => {
        if (isFunction(callback)) {
          if (data.result !== undefined) {
            callback(data.result);
          } else {
            callback(data);
          }
        }
      }).catch(error => {
        if (isFunction(options.errorCallback)) {
          options.errorCallback(error);
        } else {
          NotificationManager.error(
            error.response.data.message ? error.response.data.message : "Something wrong",
            "Error",
            3000,
            null,
            null,
            ""
          );
        }
      });
  },
  post: (url, data, callback, options = {}) => {
    Axios
      .post(url, data)
      .then(res => {
        return res.data;
      })
      .then(data => {
        callback(data.result);
      }).catch(error => {
        if (isFunction(options.errorCallback)) {
          options.errorCallback(error);
        } else {
          NotificationManager.error(
            error.response.data.message ? error.response.data.message : "Something wrong",
            "Error",
            3000,
            null,
            null,
            ""
          );
        }
      });
  },
  put: (url, data, callback, options = {}) => {
    Axios
      .put(url, data)
      .then(res => {
        return res.data;
      })
      .then(data => {
        callback(data.result);
      }).catch(error => {
        if (isFunction(options.errorCallback)) {
          options.errorCallback(error);
        } else {
          NotificationManager.error(
            error.response.data.message ? error.response.data.message : "Something wrong",
            "Error",
            3000,
            null,
            null,
            ""
          );
        }
      });
  },
  delete: (url, data, callback, options = {}) => {
    let params = '';
    if (options.urlParams) {
      params = '?' + ApiController.serialize(options.urlParams);
    }

    Axios.delete(url + params, {
      data: data
    })
      .then(res => {
        return res.data;
      })
      .then(data => {
        if (isFunction(callback)) {
          if (data.result !== undefined) {
            callback(data.result);
          } else {
            callback(data);
          }
        }
      }).catch(error => {
        if (isFunction(options.errorCallback)) {
          options.errorCallback(error);
        } else {
          NotificationManager.error(
            error.response.data.message ? error.response.data.message : "Something wrong",
            "Error",
            3000,
            null,
            null,
            ""
          );
        }
      });
  },
  upload: (url, formData, callback, options) => {
    Axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(data => {
        callback(data.result);
      }).catch(error => {
        if (isFunction(options.errorCallback)) {
          options.errorCallback(error);
        } else {
          NotificationManager.error(
            error.response.data.message ? error.response.data.message : "Something wrong",
            "Error",
            3000,
            null,
            null,
            ""
          );
        }
      });
  }
}

export default ApiController;