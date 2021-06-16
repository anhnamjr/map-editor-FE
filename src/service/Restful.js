import { isEmpty } from "lodash";
import { AXIOS_INSTANCE } from "../config/requestInterceptor";

const handle = async (method, url, body) => {
  try {
    let newUrl = "";
    if (["GET", "DELETE"].includes(method) && !isEmpty(body)) {
      let query = "";
      for (const [key, value] of Object.entries(body)) {
        query += `${key}=${value}&`;
      }
      query = query.slice(0, query.length - 1);
      newUrl = `${url}?${query}`;
    }
    let data, statusCode;
    switch (method) {
      case "GET":
        await AXIOS_INSTANCE.get(newUrl)
          .then((respond) => (data = respond))
          .catch((err) => (statusCode = err.response.status));
        break;
      case "POST":
        await AXIOS_INSTANCE.post(url, body)
          .then((respond) => (data = respond))
          .catch((err) => (statusCode = err.response.status));
        break;
      case "PUT":
        await AXIOS_INSTANCE.put(url, body)
          .then((respond) => (data = respond))
          .catch((err) => (statusCode = err.response.status));
        break;
      case "DELETE":
        await AXIOS_INSTANCE.delete(newUrl)
          .then((respond) => (data = respond))
          .catch((err) => (statusCode = err.response.status));
        break;
      default:
        break;
    }
    switch (statusCode) {
      case 400:
        return { msg: "Không thành công", method };
      default:
        return data.data;
    }
    // return data.data
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  get: (url, body) => handle("GET", url, body),
  post: (url, body) => handle("POST", url, body),
  put: (url, body) => handle("PUT", url, body),
  delete: (url, body) => handle("DELETE", url, body),
};
