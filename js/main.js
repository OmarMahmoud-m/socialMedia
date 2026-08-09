const postsHtmlContainer = document.querySelector(".posts");
const baseUrl = "https://tarmeezacademy.com/api/v1";
let currentPage = 1;
let lastPage = 1;

//=====INFINITE SCROLL=====//
window.addEventListener("scroll", function(){
  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
  if(endOfPage && currentPage < lastPage){
    fetchPosts(false,++currentPage)
  }
})

async function fetchPosts(reload = true, page = 1) {
  const response = await axios.get(`${baseUrl}/posts?limit=2&page=${page}`);
  lastPage = response.data.meta.last_page;
  if(reload){
    postsHtmlContainer.innerHTML = "";
  }
  
  response.data.data.forEach((post) => {
    let user = getCurrentUser();
    let isMyPost = user != null && post.author.id == user.id;
    let editButtonContent = ``;
    if(isMyPost){
      editButtonContent = `
      <button class="delete-btn btn btn-danger " onClick='deletePost("${encodeURIComponent(JSON.stringify(post))}")'>Delete</button>
      <button class="edit-btn btn btn-secondary" onClick='editPost("${encodeURIComponent(JSON.stringify(post))}")'>Edit</button>
      `
    }

    postsHtmlContainer.innerHTML += `            <div class="card shadow mb-5">
              <h5 class="card-header">
              <span onclick="userClicked(${post.author.id})" style="cursor: pointer;">
                  <img src="${post.author.profile_image}" onerror="this.src='./noProfileImage.jpg'" class="rounded-circle border border-2 profile-img" />
                  <b>@${post.author.username}</b>
              </span>
                ${editButtonContent}
              </h5>
              <div class="card-body" onClick="postClicked(${post.id})">
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
    console.log("this is register data", response.data)
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

function showAlert(customMessage, type = "success") {
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
    const user = getCurrentUser();
    document.getElementById("navbar-user").innerHTML = user.username;
    document.getElementById("navbar-user-image").src = user.profile_image
  }

 }
 async function createPost(){
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";
  
  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;
  const image = document.getElementById("post-image-input").files[0];

  let formData = new FormData();
  formData.append("body",body)
  formData.append("title",title)
  formData.append("image",image)

  const headers = {
    "authorization": `Bearer ${localStorage.getItem("token")}`
  }
  if(isCreate){
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
  }else{
    formData.append("_method","put");
    try {
    const response = await axios.post(`${baseUrl}/posts/${postId}`, formData, {
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
  
 }
 function getCurrentUser(){
  let user = null;
  const storageUser = localStorage.getItem("user");
  if(storageUser != null){
    user = JSON.parse(storageUser);
  }
  return user;
 }
 function postClicked(postId){
  window.location = `postDetails.html?postId=${postId}`
 }
 function editPost(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  document.getElementById("post-modal-submit-btn").innerHTML = "Update"
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post"
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
  postModal.toggle();
 }
 function deletePost(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  document.getElementById("delete-post-id-input").value = post.id;
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {});
  postModal.toggle();
 }
 function addButtonClicked(){

  document.getElementById("post-modal-submit-btn").innerHTML = "Create"
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post"
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {});
  postModal.toggle();
 }
 async function confirmPostDelete(){
  try {
    const postId = document.getElementById("delete-post-id-input").value;
      const headers = {
    "authorization": `Bearer ${localStorage.getItem("token")}`
  }
    const response = await axios.delete(`${baseUrl}/posts/${postId}`, {
      headers: headers
    });
    console.log(response)

      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("The Post Has Been Deleted Successfully", "success")
      fetchPosts();
    
  } catch (error) {
    const message = error.response.data.message;
    showAlert(message, "danger")
  }
 }
 function userClicked(userId){
  window.location = `./profile.html?userid=${userId}`
 }
 function profileClicked(){
  const user = getCurrentUser()
  const userId = user.id
  window.location = `./profile.html?userid=${userId}`
 }
fetchPosts();
setupUI();
