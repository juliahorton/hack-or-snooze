"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  /** If the user is logged in, show the favorite/unfavorite star on all stories and the delete button on stories the user has added */

  const showStarIcon = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteButton ? createDeleteButton() : ""}
        ${showStarIcon ? createStarIcon(currentUser, story) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <p class="story-author">by ${story.author}</p>
        <p class="story-user">posted by ${story.username}</p>
      </li>
      <hr>
    `);
}

/** Makes the favorite/unfavorite star for story using Font Awesome */

function createStarIcon(user, story) {
  const isFavorite = user.isFavorite(story);
  const starClass = isFavorite ? "fas" : "far";
  return `
    <span class="star">
      <i class="${starClass} fa-star"></i>
    </span>`
}


/** Makes the trash can delete button for story using Font Awesome */

function createDeleteButton() {
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>`
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handle new story form submission */

async function putNewStoryOnPage() {
  console.debug("putNewStoryOnPage");
  // evt.preventDefault();
  const title = $storyTitle.val();
  const author = $storyAuthor.val();
  const url = $storyUrl.val();
  const username = currentUser.username;
  const newStoryData = {title, url, author, username};

  const newStory = await storyList.addStory(currentUser, newStoryData);

  const $newStoryMarkup = generateStoryMarkup(newStory);

  $allStoriesList.prepend($newStoryMarkup);

  $newStoryForm.trigger("reset");

}

$newStoryForm.on("submit", putNewStoryOnPage);

/** Functionality for favorites list */

function putFavoritesListOnPage() {
  $userFavoritesList.empty();

  if (currentUser.favorites.length === 0) {
    $userFavoritesList.append("<h4>No favorites yet!</h4>");
  } else {
    for (let story of currentUser.favorites) {
      const $favoritedStory = generateStoryMarkup(story);
      $userFavoritesList.append($favoritedStory);
    }
  }

  $userFavoritesList.show();
}

/** Functionality for list of user-submitted stories */

function putUserStoriesOnPage() {

  $userStories.empty();

  if (currentUser.ownStories.length === 0) {
    $userStories.append("<h4>You haven't yet added any stories!</h4>");
  } else {
    for (let story of currentUser.ownStories) {
      let $userStory = generateStoryMarkup(story, true);
      $userStories.append($userStory)
    }
  }

  $userStories.show();
}

/** Handle a user favoriting/unfavoriting a story */

async function toggleFavoriteStatus(evt) {
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  /** Check whether the item is already favorited. If favorited, remove from the user's favorites list and change the star icon. If not favorited, add it to favorites list and change the star icon. */

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$allStoriesList.on("click", ".star", toggleFavoriteStatus);

$userFavoritesList.on("click", ".star", toggleFavoriteStatus);

$userStories.on("click", ".star", toggleFavoriteStatus);

/** Handle a user deleting a story */

async function removeStory (evt) {
  console.debug("removeStory");
  const $closestLi = $(evt.target).closest("li");
  const storyID = $closestLi.attr("id");
  const story = storyList.stories.filter( s => s.storyId === storyID).pop();

  await storyList.deleteStory(story);

  // Regenerate the story list

  putUserStoriesOnPage();
}

$userStories.on("click", ".trash-can", removeStory);

