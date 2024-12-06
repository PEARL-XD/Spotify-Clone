const emaillInput = document.getElementById("emailinput");
const passInput = document.getElementById("passwordinput");
const login = document.getElementById("loginbtn");
const currenttime = new Date().getTime();
let user = localStorage.getItem("userData");
passInput.type = "password";

let loggedin = false;
if (user) {
  function isloggedin() {
    console.log("running....");
    user = localStorage.getItem("userData");
    let userdata = JSON.parse(user);
    let timediff = currenttime - userdata.time;
    if (timediff < 10 * 24 * 60 * 60 * 1000) {
      loggedin = true;
    }
    if ((loggedin = true)) {
      console.log("logged in");
      window.location.href = "../index.html";
    } else {
      console.log("You are not logged in. Please sign up.");
    }
  }
  isloggedin();
}

login.addEventListener("click", () => {
  let email = emaillInput.value.trim();
  let pass = passInput.value.trim();
  let user = localStorage.getItem("userData");
  let userdata = user ? JSON.parse(user) : null; // Safely parse user data

  if (userdata) {
    let timediff = currenttime - userdata.time;

    if (
      email === userdata.email &&
      pass === userdata.password &&
      timediff < 10 * 24 * 60 * 60 * 1000
    ) {
      console.log("Login successful");
      window.location.href = '../index.html';
    } else {
      alert("Email or Password is Invalid");
    }
  } else {
    alert("Email is not registered");
  }
});

