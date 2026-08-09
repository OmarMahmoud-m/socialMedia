setupUI();
function getCurrentUserId(){
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("userid");
  return id;
}
async function getUser(){
  const id = getCurrentUserId();
  toggleLoader(true)
  const response = await axios.get(`${baseUrl}/users/${id}`);
  toggleLoader(false);
  console.log(response.data.data)
  const user = response.data.data;
  document.getElementById("main-info-email").innerHTML = user.email;
  document.getElementById("main-info-name").innerHTML = user.name;
  document.getElementById("main-info-username").innerHTML = user.username;
  document.getElementById("posts-count").innerHTML = user.posts_count;
  document.getElementById("comments-count").innerHTML = user.comments_count;
  document.getElementById("header-img").src = user.profile_image;
  document.getElementById("name-posts").innerHTML = `${user.username}'s Posts`
}
async function getPosts() {
  const id = getCurrentUserId();
  toggleLoader(true)
  const response = await axios.get(`${baseUrl}/users/${id}/posts`);
  toggleLoader(false)
  console.log(response.data.data)
  const posts = response.data.data;
  document.getElementById("user-posts").innerHTML = "";
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

    document.getElementById("user-posts").innerHTML += `            <div class="card shadow mb-5">
              <h5 class="card-header">
                <img src="${post.author.profile_image}" onerror="this.src='./noProfileImage.jpg'" class="rounded-circle border border-2 profile-img" />
                <b>@${post.author.username}</b>
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
 async function confirmPostDelete(){
  try {
    const postId = document.getElementById("delete-post-id-input").value;
      const headers = {
    "authorization": `Bearer ${localStorage.getItem("token")}`
  }
    toggleLoader(true)
    const response = await axios.delete(`${baseUrl}/posts/${postId}`, {
      headers: headers
    });
    console.log(response)

      const modal = document.getElementById("delete-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("The Post Has Been Deleted Successfully", "success")
      getPosts();
    
  } catch (error) {
    const message = error.response.data.message;
    showAlert(message, "danger")
  }finally{
    toggleLoader(false)
  }
 }
 window.addEventListener("scroll", function () {
  const backToTopBtn = document.getElementById("back-to-top-btn");
  if (!backToTopBtn) return;
  if (window.pageYOffset > 300) {
    backToTopBtn.style.display = "block";
  } else {
    backToTopBtn.style.display = "none";
  }
});
getUser();
getPosts();