import { auth, db, rtdb } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Add these event listeners for the login/signup buttons
document.getElementById('loginBtn').addEventListener('click', (e) => {
  e.preventDefault();
  const modal = document.getElementById('authModal');
  const loginContainer = document.getElementById('loginContainer');
  const signupContainer = document.getElementById('signupContainer');
  
  modal.style.display = 'flex';
  loginContainer.style.display = 'block';
  signupContainer.style.display = 'none';
});

document.addEventListener('DOMContentLoaded', () => {

  const metrics = document.querySelectorAll('.metric');
  metrics.forEach(metric => {
      metric.addEventListener('mouseenter', () => {
          metric.style.transform = 'translateX(5px)';
      });
      metric.addEventListener('mouseleave', () => {
          metric.style.transform = 'translateX(0)';
      });
  });
});

document.getElementById('signupBtn').addEventListener('click',async (e) => {
  e.preventDefault();
  const modal = document.getElementById('authModal');
  const loginContainer = document.getElementById('loginContainer');
  const signupContainer = document.getElementById('signupContainer');
  
  modal.style.display = 'flex';
  loginContainer.style.display = 'none';
  signupContainer.style.display = 'block';
});

// Close modal when clicking outside
document.getElementById('authModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('authModal')) {
      e.target.style.display = 'none';
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")
  const refreshCaptchaButton = document.getElementById("refreshCaptcha")
  const captchaInput = document.getElementById("captcha")
  const captchaCanvas = document.getElementById("captchaCanvas")
  const ctx = captchaCanvas.getContext("2d")
  const showSignupLink = document.getElementById("showSignup")
  const showLoginLink = document.getElementById("showLogin")
  const loginContainer = document.getElementById("loginContainer")
  const signupContainer = document.getElementById("signupContainer")
  const mobileNumberInput = document.getElementById("mobileNumber")
  const authModal = document.getElementById("authModal");
  const pincodeInput = document.getElementById("pincode")
  const fetchBranchesButton = document.getElementById("fetchBranches")
  const branchSelectGroup = document.getElementById("branchSelectGroup")
  const branchSelect = document.getElementById("branchSelect")
  const locationInfo = document.getElementById("locationInfo")

  let currentCaptcha = generateCaptcha()
  drawCaptcha(currentCaptcha)
 

  function generateCaptcha() {
    return Math.random().toString(36).substr(2, 5).toUpperCase()
  }

  function drawCaptcha(captcha) {
    ctx.clearRect(0, 0, captchaCanvas.width, captchaCanvas.height)
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, captchaCanvas.width, captchaCanvas.height)
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#4b5563"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Add some noise
    for (let i = 0; i < 50; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * captchaCanvas.width, Math.random() * captchaCanvas.height, 1, 0, 2 * Math.PI)
      ctx.fillStyle = "#9ca3af"
      ctx.fill()
    }

    // Draw captcha text with slight rotation for each character
    for (let i = 0; i < captcha.length; i++) {
      ctx.save()
      ctx.translate(20 + i * 20, captchaCanvas.height / 2)
      ctx.rotate((Math.random() - 0.5) * 0.4)
      ctx.fillText(captcha[i], 0, 0)
      ctx.restore()
    }

    // Add some lines
    ctx.strokeStyle = "#9ca3af"
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(0, Math.random() * captchaCanvas.height)
      ctx.lineTo(captchaCanvas.width, Math.random() * captchaCanvas.height)
      ctx.stroke()
    }
  }

  refreshCaptchaButton.addEventListener("click", () => {
    currentCaptcha = generateCaptcha()
    drawCaptcha(currentCaptcha)
    captchaInput.value = ""
  });

   // Login Form Handler
   loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const captcha = captchaInput.value;

      
    if (captcha.toUpperCase() !== currentCaptcha) {
      alert("Invalid captcha. Please try again.")
      return
    }


      try {
          await signInWithEmailAndPassword(auth, email, password);
          alert('Logged in successfully!');
          authModal.style.display = 'none';
          window.location.href = '/dashboard'; 
      } catch (error) {
          alert('Error: ' + error.message);
      }
      
  });

    
  fetchBranchesButton.addEventListener("click", async () => {
    const pincode = pincodeInput.value
    if (pincode && pincode.length === 6) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        const data = await response.json()
        if (data[0].Status === "Success") {
          const branches = data[0].PostOffice
          populateBranchSelect(branches)
          branchSelectGroup.style.display = "block"
        } else {
          alert("No branches found for this pincode. Please check and try again.")
        }
      } catch (error) {
        console.error("Error fetching branches:", error)
        alert("Error fetching branches. Please try again.")
      }
    } else {
      alert("Please enter a valid 6-digit pincode")
    }
  })

  function populateBranchSelect(branches) {
    branchSelect.innerHTML = '<option value="">Select a branch</option>'
    branches.forEach((branch) => {
      const option = document.createElement("option")
      option.value = JSON.stringify(branch)
      option.textContent = branch.Name
      branchSelect.appendChild(option)
    })
  }

  branchSelect.addEventListener("change", () => {
    const selectedBranch = JSON.parse(branchSelect.value)
    if (selectedBranch) {
      document.getElementById("branchInfo").innerHTML = `<strong>Branch:</strong> ${selectedBranch.Name}`
      document.getElementById("cityInfo").innerHTML = `<strong>City:</strong> ${selectedBranch.Block}`
      document.getElementById("districtInfo").innerHTML = `<strong>District:</strong> ${selectedBranch.District}`
      document.getElementById("stateInfo").innerHTML = `<strong>State:</strong> ${selectedBranch.State}`
      locationInfo.style.display = "block"
    } else {
      locationInfo.style.display = "none"
    }
  })

  signupForm.addEventListener("submit", async(e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value
    const lastName = document.getElementById("lastName").value
    const email = document.getElementById("email").value
    const mobileNumber = mobileNumberInput.value
    const pincode = pincodeInput.value
    const selectedBranch = branchSelect.value ? JSON.parse(branchSelect.value).Name : ""
    const password = document.getElementById("signupPassword").value
    const confirmPassword = document.getElementById("confirmPassword").value

    

    if (!selectedBranch) {
      alert("Please select a branch")
      return
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 8 characters long!")
      return
    }

    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobileNumber:mobileNumber,
          Zipcode:pincode,
          Address:selectedBranch,
          createdAt: new Date()
      });

      alert('Account created successfully!');
      authModal.style.display = 'none';
      window.location.href = '/dashboard'; 
  } catch (error) {
      alert('Error: ' + error.message);
  }
});

  showSignupLink.addEventListener("click", (e) => {
    e.preventDefault()
    showSignupContainer()
  })

  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault()
    showLoginContainer()
  })

  function showSignupContainer() {
    loginContainer.style.opacity = "0"
    loginContainer.style.transform = "translateX(-20px)"
    setTimeout(() => {
      loginContainer.style.display = "none"
      signupContainer.style.display = "block"
      setTimeout(() => {
        signupContainer.style.opacity = "1"
        signupContainer.style.transform = "translateX(0)"
      }, 50)
    }, 300)
  }

  function showLoginContainer() {
    signupContainer.style.opacity = "0"
    signupContainer.style.transform = "translateX(20px)"
    setTimeout(() => {
      signupContainer.style.display = "none"
      loginContainer.style.display = "block"
      setTimeout(() => {
        loginContainer.style.opacity = "1"
        loginContainer.style.transform = "translateX(0)"
      }, 50)
    }, 300)
  }

  
})


