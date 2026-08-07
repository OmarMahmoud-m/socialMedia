setupUI();

async function getUser(){
  const response = await axios.get(`${baseUrl}/users/2020`);
  console.log(response.data.data);
  const user = response.data.data;
  document.getElementById("main-info-email").innerHTML = user.email;
  document.getElementById("main-info-name").innerHTML = user.name;
  document.getElementById("main-info-username").innerHTML = user.username;
  document.getElementById("posts-count").innerHTML = user.posts_count;
  document.getElementById("comments-count").innerHTML = user.comments_count;
}
getUser();