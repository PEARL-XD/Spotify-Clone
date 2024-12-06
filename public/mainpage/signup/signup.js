// document.addEventListener("DOMContentLoaded", function () {
const nextbtn = document.getElementById("nextButton");
const emailInput = document.getElementById("emailInput");
const emailH5 = document.querySelector(".email h5");
const signup = document.getElementById("signButton");
const restBtn = document.getElementsByClassName(".butt button");
const homebtn = document.querySelector(".home-btn");


// storing useremail for for next step also changing the innerhtm from enter email to enter password

nextbtn.addEventListener("click", function () {
  const email = emailInput.value.trim();
  if (email) {
    localStorage.setItem("userEmail", email);
    emailH5.innerHTML = "Password";
    emailInput.placeholder = "Enter your password";
    nextbtn.style.display = "none";
    signup.style.display = "block";
    emailInput.type = "password";
    emailInput.value = "";
  } else {
    alert("Please enter a valid email address");
  }
});

// now collecting password using the older email add to store a user with validity of 10 days

signup.addEventListener("click", function () {
  const password = emailInput.value.trim();
  if (
    password.length > 7 &&
    /[A-Z]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password)
  ) {
    const useremail = localStorage.getItem("userEmail");
    let currtime = new Date().getTime();
    let user = {
      email: useremail,
      password: password,
      time: currtime,
    };
    localStorage.setItem("userData", JSON.stringify(user));
    emailInput.value = "";
    localStorage.removeItem("userEmail");
    window.location.href='../index.html'
  } else {
    alert(
      "Password must be 8 characters long, including at least one special character and one uppercase letter."
    );
  }
});
// });
