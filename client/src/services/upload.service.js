import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/user/";

class UploadService {
  // `getCurrentUserId` function that retrieves the current user's `id from `localStorage`:
  getCurrentUserId() {
    return JSON.parse(localStorage.getItem("user")).id;
  }

  // `uploadFile` function that sends the data to the server. The POST must be authorized:
  uploadFile(file) {
    let id = this.getCurrentUserId();
    let entries = file;

    return axios.post(
      API_URL + "upload",
      {
        id,
        entries,
      },
      {
        headers: {
          "x-access-token": authHeader()["x-access-token"],
          "x-forwarded-for": "81.212.142.236",
        },
      }
    );
  }
}

// Export class `UploadService`:
export default new UploadService();
