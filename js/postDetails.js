const baseUrl = "https://tarmeezacademy.com/api/v1";
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("postId");

async function login() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  const params = {
    username,
    password,
  };
  try {
    toggleLoader(true);
    const response = await axios.post(`${baseUrl}/login`, params);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    setupUI();
    showAlert("Logged in successfully", "success");
  } catch (error) {
    const message = error.response.data.message;
    showAlert(message, "danger");
  } finally{
    toggleLoader(false);
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
    toggleLoader(true);
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
  } finally{
    toggleLoader(false);
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
  const addCommentDiv = document.getElementById("add-comment-div");

  if (token == null) {
    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "none", "important");
    }
    loginDiv.style.setProperty("display", "flex", "important");
    logoutDiv.style.setProperty("display", "none", "important");
    document.getElementById("profile-nav").style.setProperty("display", "none", "important")
    if (addCommentDiv != null) {          
      addCommentDiv.style.display = "none";
    }
  } else {
    if (addPostBtn != null) {
      addPostBtn.style.setProperty("display", "block", "important");
    }
    if (addCommentDiv != null) {          
      addCommentDiv.style.display = "flex";
    }
    loginDiv.style.setProperty("display", "none", "important");
    logoutDiv.style.setProperty("display", "flex", "important");
    document.getElementById("profile-nav").style.setProperty("display", "flex", "important")
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
async function fetchPost() {
  toggleLoader(true);
  const response = await axios.get(`${baseUrl}/posts/${id}`);
  toggleLoader(false)
  const post = response.data.data;
  const comments = post.comments;
  const author = post.author;

  document.getElementById("username-h1").innerHTML = `${author.username}'s Post`;
  let commentsContent = ``;

  for (comment of comments) {
    commentsContent += `<!-- COMMENT -->
          <div class="comments p-3">
            <!-- PFP + USERNAME -->
            <div class= "d-flex align-items-center gap-2">
              <img src="${comment.author.profile_image}" onerror="this.src='./noProfileImage.jpg'" class="comment-pfp rounded-circle" alt="">
              <b>${comment.author.username}</b>
            </div>
            <!--// PFP + USERNAME //-->

            <!-- COMMENTS BODY -->
            <div class="mt-1">
              ${comment.body}
            </div>
            <!--// COMMENTS BODY //-->
          </div>
          <!--// COMMENT //-->`;
  }
  const postContent = `<div class="card shadow mb-5">
              <h5 class="card-header">
                <span onclick="userClicked(${post.author.id})" style="cursor: pointer;">
                  <img src="${post.author.profile_image}" onerror="this.src='./noProfileImage.jpg'" class="rounded-circle border border-2 profile-img" />
                  <b>@${post.author.username}</b>
              </span>
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
        
        <div id="comments">
          ${commentsContent}
        </div>

        <div class="input-group mb-3" id="add-comment-div">
          <input id="comment-input" type="text" placeholder="Add Comment" class="form-control">
          <button class="btn btn-outline-primary" type="button" onClick="addComment()">send</button>
        </div>
        
            </div>
            `;
  document.getElementById("post").innerHTML = postContent;
  setupUI();
}
 function userClicked(userId){
  window.location = `./profile.html?userid=${userId}`
 }
async function addComment(){
  try {
  let commentBody = document.getElementById("comment-input").value;
  let params = {
    "body": commentBody
  }
  let token = localStorage.getItem("token");
  toggleLoader(true);
  const response = await axios.post(`${baseUrl}/posts/${id}/comments`, params, {
    headers: {
      "authorization": `Bearer ${token}`
    }
  })
  console.log(response.data)
  showAlert("Comment has been added successfully", "success")
  fetchPost();
} catch(error){
  const errorMessage = error.response.data.message;
  showAlert(errorMessage, "danger")
} finally{
  toggleLoader(false)
}
 }
 function toggleLoader(show = true){
  if(show){
    document.getElementById("loader").style.visibility = 'visible';
  }
  else{
    document.getElementById("loader").style.visibility = 'hidden';
  }
 }
  function profileClicked(){
  const user = getCurrentUser()
  const userId = user.id
  window.location = `./profile.html?userid=${userId}`
 }
setupUI();
fetchPost();
