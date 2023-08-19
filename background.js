let lock = false;
let index = 0;
//0 = default search, 1 = YouTube, 2 = Twitch, 3 = Gmail, 4 = StackOverflow, can add more? //TODO
//when adding a new website, make sure to: change generateSuggestions() if statement, the switch statement, and the switch statement in onInputEntered()
chrome.omnibox.onInputStarted.addListener(function(text, suggest) {
  chrome.omnibox.setDefaultSuggestion({description: "Search the Web"});
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
  if (text.includes("`")) { // ` is the activation key (again)
    lock = true;
  } else {
    lock = false;
  }
  let suggestions = generateSuggestions(text, lock);
  chrome.omnibox.setDefaultSuggestion(suggestions);
  console.log("Input changed: " + text + " Lock: " + lock + " Index: " + index);
});

function generateSuggestions(text, lock) {
  let suggestions;

  text = text.toLowerCase();
  if (!lock) {
    if ("youtube".includes(text)) {
      suggestions = {description: "Search YouTube"};
      index = 1;
    }
    else if ("twitch".includes(text)) {
      suggestions = {description: "Search Twitch"};
      index = 2;
    }
    else if ("gmail".includes(text)) {
      suggestions = {description: "Search Gmail"};
      index = 3;
    }
    else if ("stackoverflow".includes(text)) {
      suggestions = {description: "Search StackOverflow"};
      index = 4;
    }
    else {
      suggestions = {description: "Search the Web"};
      index = 0;
    }
  } else {
    switch (index) {
      case 0:
        suggestions = {description: "Searching the Web"}; break;
      case 1:
        suggestions = {description: "Searching YouTube"}; break;
      case 2:
        suggestions = {description: "Searching Twitch"}; break;
      case 3:
        suggestions = {description: "Searching Gmail"}; break;
      case 4:
        suggestions = {description: "Searching StackOverflow"}; break;
      default:
        suggestions = {description: "Searching the Web"}; break;
    }
  }

  
  return suggestions;
}

chrome.omnibox.onInputEntered.addListener((text) => {
  // Encode user input for special characters , / ? : @ & = + $ #
  let newURL = "";
  let start = text.indexOf("`");

  switch (index) {
    case 1:
      newURL = 'https://www.youtube.com/results?search_query='; break;
    case 2:
      newURL = 'https://www.twitch.tv/search?term='; break;
    case 3:
      newURL = 'https://mail.google.com/mail/u/0/#search/'; break;
    case 4:
      newURL = 'https://stackoverflow.com/search?q='; break;
    default:
      newURL = 'https://www.google.com/search?q='; break;
  }
  newURL += text.substring(start + 1);
  chrome.tabs.create({ url: newURL });
});
