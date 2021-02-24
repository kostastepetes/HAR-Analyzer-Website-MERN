import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/admin/";

class BasicInfoService {
  getBasicInfo() {
    return axios.get(API_URL + "basic-info", { headers: authHeader() });
  }

  getEntriesByReqType() {
    return axios.get(API_URL + "basic-info/by-type", { headers: authHeader() });
  }

  getEntriesByResStatus() {
    return axios.get(API_URL + "basic-info/by-status", {
      headers: authHeader(),
    });
  }

  getEntryAvgAgeByContentType() {
    return axios.get(API_URL + "basic-info/average-age", {
      headers: authHeader(),
    });
  }
}

export default new BasicInfoService();
