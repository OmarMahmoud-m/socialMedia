const postsHtmlContainer = document.querySelector(".posts");
async function fetchPosts(){
  const response = await axios.get("https://tarmeezacademy.com/api/v1/posts?limit=50");
  console.log(response.data.data)
  response.data.data.forEach(post => {
    postsHtmlContainer.innerHTML += `            <div class="card shadow mb-5">
              <h5 class="card-header">
                <img src="${post.author.profile_image}" onerror="this.src='./noProfileImage.jpg'" class="rounded-circle border border-2" />
                <b>@${post.author.username}</b>
              </h5>
              <div class="card-body">
                <img src="${post.image}" onerror="this.style.display='none'" class="w-100 mb-1" />
                <h6>${post.created_at}</h6>
                <h5>${post.title  ? post.title : ""}</h5>
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
            </div>`
  });
  
}
fetchPosts();