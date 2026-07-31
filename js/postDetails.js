const baseUrl = "https://tarmeezacademy.com/api/v1";

async function login() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  const params = {
    username,
    password,
  };
  try {
    const response = await axios.post(`${baseUrl}/login`, params);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI();
    showAlert("Logged in successfully", "success");
  } catch (error) {
    console.log("Login error:", error.response.data);
  }
}

async function register() {
  const image = document.getElementById("register-image-input").files[0];
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  try {
    const response = await axios.post(`${baseUrl}/register`, formData);
    console.log("this is register data", response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("register-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI();
    showAlert("New User Registered successfully", "success");
  } catch (error) {
    const message = error.response.data.message;
    showAlert(message, "danger");
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showAlert("Logged out successfully", "success");
}

function showAlert(customMessage, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
  appendAlert(customMessage, type);
  setTimeout(() => {
    const alertToHide = bootstrap.Alert.getOrCreateInstance("#success-alert");
    alertToHide.close();
  }, 2000);
}
function setupUI() {
  const token = localStorage.getItem("token");

  const loginDiv = document.getElementById("login-div");

  const logoutDiv = document.getElementById("logout-div");
  const addPostBtn = document.getElementById("add-post-btn");

  if (token == null) {
    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
  } else {
    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "block", "important");
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    const user = getCurrentUser();
    document.getElementById("navbar-user").innerHTML = user.username;
    document.getElementById("navbar-user-image").src = user.profile_image;
  }
}
function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}
setupUI();
