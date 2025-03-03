/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import games from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(games)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    games.forEach(game => {
        // create a new div element, which will become the game card
        const gameCard = document.createElement('div');

        // add the class game-card to the list
        gameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `<p>${game.name}</p> 
                              <p>${game.description}</p> 
                              <img src="${game.img}" class="game-img"/>
                              `

         // append the game to the games-container
         gamesContainer.append(gameCard);
    });
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON)

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `${totalContributions.toLocaleString('en-US')}`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// set inner HTML using template literal
const totalPledged = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged;
}, 0);

raisedCard.innerHTML = `${totalPledged.toLocaleString('en-US')}`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const gamesTotal = GAMES_JSON.length;

gamesCard.innerHTML = `${gamesTotal}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unfundedGames = GAMES_JSON.filter((game) => {
        return game.goal > game.pledged;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unfundedGames);
    console.log(unfundedGames.length);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter((game) => {
        return game.goal <= game.pledged;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames);
    console.log(fundedGames.length);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
    console.log(GAMES_JSON.length);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', () => {
    filterUnfundedOnly();
});
fundedBtn.addEventListener('click', () => {
    filterFundedOnly();
});
allBtn.addEventListener('click', () => {
    showAllGames();
});

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGames = GAMES_JSON.filter((game) => {
    return game.goal > game.pledged;
}, 0);
let fundedGames = GAMES_JSON.filter((game) => {
    return game.goal <= game.pledged;
}, 0);

let countUnfundedGames = unfundedGames.length;
let countFundedGames = fundedGames.length;
const totalFunded = fundedGames.reduce((acc, game) => {
    return acc + game.pledged;
}, 0);
// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalFunded.toLocaleString('en-US')} has been raised for ${countFundedGames} games. Currently, ${countUnfundedGames === 1 ? `${countUnfundedGames} game` : `${countUnfundedGames} games`} remains unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
let description = document.createElement('div');
description.innerHTML = displayStr;
descriptionContainer.append(description);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...restOfGames] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameName = document.createElement('div');
firstGameName.innerHTML = `${firstGame.name}`;
firstGameContainer.append(firstGameName);
// do the same for the runner up item
const secondGameName = document.createElement('div');
secondGameName.innerHTML = `${secondGame.name}`;
secondGameContainer.append(secondGameName);

/************************************************************************************
 * MAKING THE SEARCH BAR FUNCTIONAL
 */

const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');

function searchGames(){
    const searchTerm = searchBar.value.toLowerCase().trim();
    const filteredGames = GAMES_JSON.filter((game) => {
        return game.name.toLowerCase().trim().includes(searchTerm);
    })
    deleteChildElements(gamesContainer);
    addGamesToPage(filteredGames);

    if(filteredGames.length === 0){
        const noResultMessage = document.createElement('div');
        noResultMessage.innerHTML = `<p>No games found for "${searchBar.value}".</p>`;
        gamesContainer.append(noResultMessage);
        gamesContainer.scrollIntoView({ behavior: 'smooth' });
    }
    else gamesContainer.scrollIntoView({ behavior: 'smooth' });
}

// Add event listener for the search button
searchBtn.addEventListener('click', () => {
    searchGames()
});

// Add event listener for the Enter key in the search bar
searchBar.addEventListener('keypress', (event) => {
    if(event.key === 'Enter') searchGames();
});