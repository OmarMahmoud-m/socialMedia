const postsHtmlContainer = document.querySelector(".posts");
const baseUrl = "https://tarmeezacademy.com/api/v1";

async function fetchPosts() {
  const response = await axios.get(`${baseUrl}/posts?limit=50`);
  console.log(response.data.data);
  response.data.data.forEach((post) => {
    postsHtmlContainer.innerHTML += `            <div class="card shadow mb-5">
              <h5 class="card-header">
                <img src="${post.author.profile_image}" onerror="this.src='./noProfileImage.jpg'" class="rounded-circle border border-2" />
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
    password,
  };
  try {
    const response = await axios.post(`${baseUrl}/login`, params);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    const modal = document.getElementById("login-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    alert("user logged in successfully");
    setupUI()
  } catch (error) {
    console.log("Login error:", error.response.data);
  }
}

function logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  alert("logged out successfully")
  setupUI()
}

 function setupUI(){
  const token = localStorage.getItem("token");

  const loginDiv = document.getElementById("login-div");
  
  const logoutDiv = document.getElementById("logout-div");
  
  if(token == null){
    loginDiv.style.setProperty("display", "flex", "important")
    logoutDiv.style.setProperty("display", "none", "important")
  }
  else{
    loginDiv.style.setProperty("display", "none", "important")
    logoutDiv.style.setProperty("display", "flex", "important")
  }

 }
fetchPosts();
setupUI();
