import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:5000/api/test/user/";

class EditService {
  // `getCurrentUserId` function that retrieves the current user's `id from `localStorage`:
  getCurrentUserId() {
    return JSON.parse(localStorage.getItem("user")).id;
  }

  // `editUsername` function that sends the new username to the server. The POST request is authorized:
  editUsername(username) {
    let id = this.getCurrentUserId();
    return axios.post(
      API_URL + "edit-username",
      {
        id,
        username,
      },
      {
        headers: authHeader(),
      }
    );
  }

  // `editPassword` function that sends the new password to the server. The POST request must be authorized:
  editPassword(password) {
    let id = this.getCurrentUserId();
    return axios.post(
      API_URL + "edit-password",
      {
        id,
        password,
      },
      {
        headers: authHeader(),
      }
    );
  }
}

// Export class `EditService`:
export default new EditService();
