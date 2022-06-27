"use strict";

//Copyright
const copyrightYear = document.querySelector(".copyright-year");
copyrightYear.textContent = new Date().getFullYear()

//TODO: Add custom sign when the form fails and what needs to be done
//Add Brewery Form
const submitButton = document.querySelector(".submitButton");

const validate = function (e) {
  const formItem = document.querySelectorAll(".form-item");
  for (let item of formItem) {
    if (item.children[0].value.length < 1) {
      item.classList.add("form-error");
    }
    if (item.children[0].value.length > 0) {
      item.classList.remove("form-error");
    }
  }
};

//IF the page does not containt the element the error prevents the rest of the script to run
try {
  submitButton.addEventListener("click", validate);
} catch {}

// Breweries.ejs: How many years ago the brewery was founded
const currentYear = new Date().getFullYear();
const yearFound = document.querySelector(".year-found");
const age = currentYear - parseInt(yearFound.textContent.slice(-4));
yearFound.textContent = `${yearFound.textContent} (${age} years ago)`;
