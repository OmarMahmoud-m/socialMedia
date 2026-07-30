const postsHtmlContainer = document.querySelector(".posts");
const baseUrl = "https://tarmeezacademy.com/api/v1";

async function fetchPosts() {
  const response = await axios.get(`${baseUrl}/posts?limit=50`);
  console.log(response.data.data);
  postsHtmlContainer.innerHTML = "";
  response.data.data.forEach((post) => {
    postsHtmlContainer.innerHTML += `            <div class="card shadow mb-5">
              <h5 class="card-header">
                <img src="${post.author.profile_image}" onerror="this.src='./noProfileImage.jpg'" class="rounded-circle border border-2 profile-img" />
                <b>@${post.author.username}</b>
              </h5>
              <div class="card-body">
                <img src="${post.image}" onerror="this.style.display='none'" class="w-100 mb-1" />
                <h6>${post.created_at}</h6>
                <h5>${post.title ? post.title : ""}</h5>
                <p>
                  ${post.body}
                </p>
                <hr />
                <div>
                  <i
                    class="fa-solid fa-message"
                    style="color: rgb(128, 131, 131)"
                  ></i>
                  <span>(${post.comments_count}) comments</span>
                </div>
              </div>
            </div>`;
  });
}
async function login() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  const params = {
    username,
    password
  };
  try {
    const response = await axios.post(`${baseUrl}/login`, params);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI()
    showAlert("Logged in successfully", "success");
    
  } catch (error) {
    console.log("Login error:", error.response.data);
  }
}

async function register(){
  const name = document.getElementById("register-name-input").value; 
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-password-input").value;
  const params = {
    username,
    password,
    name
  };
  try {
    const response = await axios.post(`${baseUrl}/register`, params);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("register-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI()
    showAlert("New User Registered successfully", "success");
    
  } catch (error) {
    const message = error.response.data.message;
    showAlert(message, "danger")
  } 
}

function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showAlert("Logged out successfully", "success")
  
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
    const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
    alertToHide.close()
  }, 2000)

}
 function setupUI(){
  const token = localStorage.getItem("token");
  
  
  const loginDiv = document.getElementById("login-div");
  
  const logoutDiv = document.getElementById("logout-div");
  const addPostBtn = document.getElementById("add-post-btn");
  
  
  if(token == null){
    loginDiv.style.setProperty("display", "flex", "important")
    logoutDiv.style.setProperty("display", "none", "important")
    addPostBtn.style.setProperty("display", "none", "important")
  }
  else{
    loginDiv.style.setProperty("display", "none", "important")
    logoutDiv.style.setProperty("display", "flex", "important")
    addPostBtn.style.setProperty("display", "block", "important")
  }

 }
 async function createPost(){
  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];

  let formData = new FormData();
  formData.append("body",body)
  formData.append("title",title)
  formData.append("image",image)

  const headers = {
    "Content-type": "multipart/form-data",
    "authorization": `Bearer ${localStorage.getItem("token")}`
  }

  try {
    const response = await axios.post(`${baseUrl}/posts`, formData, {
      headers
    });
    console.log(response)
    const modal = document.getElementById("create-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("New Post Has Been Created", "success")
    fetchPosts();
    
  } catch (error) {
    const message = error.response.data.message;
    showAlert(message, "danger")
  }
 }
fetchPosts();
setupUI();
