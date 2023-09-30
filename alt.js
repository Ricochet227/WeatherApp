const searchResultButtons = document.querySelectorAll('.search-result-button');

searchResultButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Perform desired action when a search result button is clicked
    console.log("Search result button clicked for city:", button.textContent);
  });
});