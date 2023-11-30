"use strict";


let currTab;

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  currTab = "main";
}

$body.on("click", "#nav-all", navAllStories);

/** Show new story form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newStoryForm.show();
  currTab = "submit";
}

$navSubmit.on("click", navSubmitClick);

/** Show user's favorited stories on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
  currTab = "favorites";
}

$navFavorites.on("click", navFavoritesClick);

/** Show user's submitted stories on click on "my stories" */

function navStoriesClick(evt) {
  console.debug("navStoriesClick", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  currTab = "stories"
}

$navUserStories.on("click", navStoriesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
  currTab = "login";
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $loginForm.hide();
  $signupForm.hide();
  $navUserProfile.text(`${currentUser.username}`).show();
  currTab = "main";
}
