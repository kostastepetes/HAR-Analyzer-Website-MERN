import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/user/";

class StatsService {
  // `getCurrentUserId` function that retrieves the current user's `id from `localStorage`:
  getCurrentUserId() {
    return JSON.parse(localStorage.getItem("user")).id;
  }

  getStats() {
    let id = this.getCurrentUserId();
    return axios.post(API_URL + "stats", { id }, { headers: authHeader() });
  }
}

export default new StatsService();
