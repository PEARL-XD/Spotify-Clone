const emaillInput = document.getElementById("emailinput");
const passInput = document.getElementById("passwordinput");
const login = document.getElementById("loginbtn");
const currenttime = new Date().getTime();
let user = localStorage.getItem("userData");
passInput.type='password'

let loggedin = false;
if (user) {
  function isloggedin() {
      console.log("running....");
    user = localStorage.getItem("userData");
    let userdata = JSON.parse(user);
    let timediff = currenttime - userdata.time;
    if (timediff < 10 * 24 * 60 * 60 * 1000) {
      loggedin = true
    }
    if (loggedin = true) {
      console.log('logged in'); 
      window.location.href='../index.html'
  
    }
    else{
      console.log('You are not logged in. Please sign up.');
    }
  }
  isloggedin();
}

login.addEventListener("click", () => {
  let email = emaillInput.value.trim();
  let pass = passInput.value.trim();
  if (user) {
  user = localStorage.getItem("userData");
  let userdata = JSON.parse(user);
  let timediff = currenttime - userdata.time;
  
  if (
    email === userdata.email &&
    pass === userdata.password &&
    timediff < 10 * 24 * 60 * 60 * 1000
  ) {
    console.log("ok");
    loggedin = true;
    window.location.href='../index.html'
  } else if(!email==='') {
    alert("Email or Password is Invalid");
  }
}
if(!user){
  if (!email ===''&&pass==='') {
    
  }
    alert('Email is not registerd ')
}
});
