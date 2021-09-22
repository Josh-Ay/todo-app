const toggleBtn = document.querySelector("button.toggle-switch");
const toggleBtnImg = document.querySelector("button.toggle-switch img");
const topContainer = document.querySelector(".top-container");
const toggleImgList = ["./images/icon-sun.svg", "./images/icon-moon.svg"]
const body = document.body;
const listContainer = document.querySelector(".box");
const inputBox = document.querySelector(".input-box");
const customRadioBtns = document.querySelectorAll(".circle");
const links = document.querySelectorAll(".todo-lists a");
const linksSmallScreen = document.querySelectorAll(".todo-lists-small-screen a");
let userHasPreference = false;

const userStorage = window.localStorage;

// Check local storage for preferredd theme settings which on first load will be none so default to user's system settings.
if (userStorage.getItem("theme")) {
    const savedThemePreference = userStorage.getItem("theme");
    setTheme(savedThemePreference);
    userStorage.setItem("theme", savedThemePreference);
} else {
    console.log("using computer settings");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches){
        userStorage.setItem("theme", "dark");
        setTheme("dark");
    }else{
        userStorage.setItem("theme", "light");
        setTheme("light");
    }        
}


function setTheme(theme) {
    if (theme === "dark")  {
        body.classList.remove("light-mode");
        toggleBtnImg.src = toggleImgList[0];
    } else {
        body.classList.add(theme+"-mode");
        toggleBtnImg.src = toggleImgList[1];
    }
}

// Toggle on 'dark' or 'light' mode
toggleBtn.addEventListener("click", function () {
    const currentTheme = userStorage.getItem("theme");
    updateLocalStorageAndSetTheme(currentTheme);
});
function updateLocalStorageAndSetTheme(currentThemeSetting) {
    if (currentThemeSetting === "light") {
        userStorage.setItem("theme", "dark");
        setTheme("dark");
    } else {
        setTheme("light");
        userStorage.setItem("theme", "light");
    }
}

// Shows the delete icon of the element that triggered it
function showDeleteIcon(e) {
    const crossIcon = e.querySelector(".cross-icon");
    crossIcon.style.display = "block";
};

// Hides the delete icon of the element that triggered it
function hideDeleteIcon(e) {
    const crossIcon = e.querySelector(".cross-icon");
    crossIcon.style.display = "none";
};

// Function that submits the parent element(form) of the element that triggered it
function submitForm(e) {
    const currentForm = e.parentElement;
    currentForm.submit();
};

// Changes the form posting route from "/delete" to "/remove"
function removeItem(e) {
    const form = e.parentElement.parentElement;
    form.action = "/remove";

    form.submit();
};

// Uncheck done todo item
function uncheckTodo(e) {
    const form = e.closest("form");
    form.action = "/uncheck";

    form.submit();
}


// Reorder todos by drag and drop
$(".box").sortable();


// Change the color of the current link('All', 'Active' or 'Completed') to blue
const currentPath = window.location.pathname;

changeLinkColor(links);  // for larger devices
changeLinkColor(linksSmallScreen);  //  for smaller devices

function changeLinkColor(currentNodeList) {
    currentNodeList.forEach(link=>{
        if (link.getAttribute("href") === currentPath){
            link.classList.add("current-page");
        };
    }); 
};