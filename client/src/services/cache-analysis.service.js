import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/admin/";

class CacheAnalysisService {
  getTTL() {
    return axios.get(API_URL + "cache-analysis/time-to-live", {
      headers: authHeader(),
    });
  }

  getMinMaxDirectivePercentages() {
    return axios.get(
      API_URL + "cache-analysis/max-stale-min-fresh-directive-percentages",
      { headers: authHeader() }
    );
  }

  getCacheabilityDirectivePercentages() {
    return axios.get(
      API_URL + "cache-analysis/cacheability-directive-percentages",
      { headers: authHeader() }
    );
  }
}

export default new CacheAnalysisService();
