/*===============================================
Elements
===============================================*/
const previews = document?.querySelectorAll(".blog-post-preview");
const previewButtons = document?.querySelectorAll(".blog-post-preview__button");
const navigationElements = document?.querySelectorAll(".nav__link");
const subNavElements = document?.querySelectorAll(".sub-nav__link");
const lightSwitch = document?.getElementById("light-switch");

const blogPostBody = document?.querySelectorAll(".blog-post-preview__body");


/*===============================================
Highlight navigation link 
===============================================*/
// Grab the current pathname
const pathname = window.location.pathname;
const indexRoute = "";
const namedRouteFirstDegree = pathname.split("/")[1];
const namedRouteSecondDegree = pathname.split("/")[2];

// Check each navigation link in the header and see if 
// one matches the current pathname. If so, highlight it
navigationElements.forEach(element => {
  // The href is the same as the pathname
  if (namedRouteFirstDegree === element.getAttribute("href").split("/")[1] || namedRouteFirstDegree === element.getAttribute("href").split("/")[2]) {
    element.classList.add("active");
  } else {
    element.classList.remove("active");
  };
});

subNavElements.forEach(element => {
  if (namedRouteSecondDegree === element.getAttribute("href").split("/")[2]) {
    element.classList.add("active");
  } else {
    element.classList.remove("active");
  };
});

/*===============================================
Event listeners
===============================================*/
/*==============================
Showing blog preview description
==============================*/
// Give each preview button an event listener
previewButtons?.forEach(button => {
  button.addEventListener("click", handleExpansion);
});

function handleExpansion(e) {
  const previewBtn = e.target;
  const previewElement = previewBtn.previousElementSibling;
  const showSummary = "Visa sammanfattning";
  const hideSummary = "Göm sammanfattning";

  // Check if the previewElement has the class "expanded"
  if (previewElement.classList.contains("expanded")) {
    previewElement.classList.remove("expanded");

    // Change the preview button inner text
    previewBtn.innerText = showSummary;
  } else {
    // close open previewElements
    for (const preview of blogPostBody) {
      preview.classList.remove("expanded");
    };

    // Change the closed preview buttons' inner text
    for (const button of previewButtons) {
      button.innerText = showSummary;
    };

    // Add the expanded class to target previewElement
    previewElement.classList.add("expanded");

    // Conditional rendering of the btn text
   previewBtn.innerText = hideSummary; 
  };
};

/*===============================================
Get cookies from the client side
===============================================*/
function getCookie(name) {
  var match = document.cookie.match(RegExp('(?:^|;\\s*)' + name + '=([^;]*)')); 
  return match ? match[1] : null;
}

/*===============================================
Light switch dark/light mode
===============================================*/
const body = document.body;
const currentTheme = localStorage?.getItem("theme");

// Check if the user has the theme "dark" stored in localStorage
if (currentTheme === "dark") {
  body.classList.add("dark-mode");

  // Remove transition - otherwise it will trigger every time the DOM reloads
  body.style.transition = "unset";
} else {
  body.style.transition = "background-color 0.75s ease-out";
}

lightSwitch.addEventListener("click", () => {
  lightSwitch.classList.add("triggered");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    localStorage.setItem("theme","light");
    
    // Add transition for nice transition between dark to light mode
    body.style.transition = "background-color 0.75s ease-out";
  } else {
    body.classList.add("dark-mode");
    localStorage.setItem("theme","dark");
  }


  setTimeout(() => {
    lightSwitch.classList.remove("triggered"); 
  }, 1000);
});
