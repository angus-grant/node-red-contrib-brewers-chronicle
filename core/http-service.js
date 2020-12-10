"use strict";

const bent = require("bent");

class HttpService {
  constructor() {
    this._headers = {};
  }

  get headers() {
    return this._headers;
  }

  set headers(value) {
    this._headers = value;
  }

  get(url) {
    return bent("json", "GET", 200, this._headers)(url);
  }

  async getWithJson(url, body) {
    const put = bent("json", "GET", 200);
    return await put(url, body, this._headers);
  }

  async postWithJson(url, body) {
    const put = bent("json", "POST", 200);
    return await put(url, body, this._headers);
  }

  patch(url) {
    return bent("PATCH", 200, this._headers)(url);
  }
}

const httpService = new HttpService();

module.exports = httpService;