"use strict";

/*
The majority of this work was copied from node-red-contrib-brewfather
I did add in the httpService.getWithJson function to handle posting json into a get request
https://github.com/enorfelt/node-red-contrib-brewfather/blob/master/core/brewfather-service.js
*/

const httpService = require("./http-service");
const querystring = require("querystring");

class BrewersChronicleService {
  constructor() {
    //this.baseUrl = "https://api.brewerschronicle.com/api";
    this.baseUrl = "http://192.168.0.27:51402/api";
  }

  setCredentials(apiKey) {
    const buff = Buffer.from(apiKey);
    const header = {
      Authorization: "Bearer " + buff, //.toString("base64"),
      'content-type': 'application/json'
    };
    httpService.headers = header;
  }

  async getBoilSessions(params = {}) {
    var url = this.baseUrl + "/brewLogs/GetBrewLogs"; //?" + querystring.stringify(queryParams);

    return await httpService.get(url);
  }

  async getBoilSessionInfo(brew_log_id, params = {}) {
    var url = this.baseUrl + "/brewLogs/GetBrewSessionInfo"; //?" + querystring.stringify(queryParams);

    return await httpService.getWithJson(url, "{ 'BrewingLogId' : '" + brew_log_id + "'}");
  }

  async postBoilSessionReading(brew_log_id, readingTypeId, readingValue, params = {}) {
    var url = this.baseUrl + "/brewLogs/PostReading"; //?" + querystring.stringify(queryParams);

    if (readingValue == "") {
        var json = "{ 'BrewingLogId' : '" + brew_log_id + "', 'DeviceTag' : 'Device_Node-Red Brew3', 'ReadingTypeId' : '" + readingTypeId + "' }";
        return await httpService.postWithJson(url, json);
    } else {
        var json = "{ 'BrewingLogId' : '" + brew_log_id + "', 'ReadingValue' : '" + readingValue + "', 'DeviceTag' : 'Device_Node-Red Brew3', 'ReadingTypeId' : '" + readingTypeId + "' }";
        return await httpService.postWithJson(url, json);
    }
  }

  async postFermentSessionReading(json, params = {}) {
    var url = this.baseUrl + "/fermentLogs/PostReadingByAPIId";

    return await httpService.postWithJson(url, json);
  }

  async getFermentSessionInfo(json, params = {}) {
    var url = this.baseUrl + "/fermentLogs/GetFermentLogInfo";

    return await httpService.postWithJson(url, json);
  }
}
const bcService = new BrewersChronicleService();
module.exports = bcService;
