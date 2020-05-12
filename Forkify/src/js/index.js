//https://forkify-api.herokuapp.com/api/search

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base';

/* Global state of the app
- Serch object
- Current recipe object
- Shopping list object
- Linked recipes
*/
const state = {};

/********* SEARCH CONTROLLER ********/
const controlSearch = async () => {
    // 1. get query from the view
    const query = searchView.getInput();

    if (query){
        // 2) new search obj and add it to state
        state.search = new Search(query);
        
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        //recipeView.clearRecipe();
        renderLoader(elements.searchRes);

        try {
            //4) Search for recipes
            await state.search.getResults();

            //5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch(e){
            alert(e.target);
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    //page reloads on search. to don't do this
    e.preventDefault();
    controlSearch();
});


//event delegation
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn){
        //shows data-goto from createButton
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/********* RECIPE CONTROLLER ********/
const controlRecipe = async () => {
    //TODO: TAKE INTO ACCOUNT
    const id = window.location.hash.replace('#', '');

    if (id){
        //prep ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight selected item
        if (state.search){
            searchView.highlightSelected(id);
        }

        //create new recipe obj
        state.recipe =  new Recipe(id);
        
        //TODO: Why do I need try catch here? it's in the class..
        try{
            //get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            
            //calc
            state.recipe.caculateTime();
            state.recipe.caculateServings();

            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        }
        catch(err){
            console.log(err);
            alert(err.target);
        }
    }
};

//TODO: TAKE INTO ACCOUNT
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/******** LIST CONTROLLER ********/
const controlList = () => {
    //create new list if none yet
    if (!state.list) state.list = new List();

    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
};

/********* LIKE CONTROLLER  ********/

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const curId = state.recipe.id;

    //not liked recipe
    if (!state.likes.isLiked(curId)) {
        //add like to state
        const newLike = state.likes.addLike(
            curId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //toggle the like button
        likesView.toggleLikeButton(true);
        //add like to UI
        likesView.renderLike(newLike);
    }
    //already liked recipe
    else{
        //remove like from the state
        state.likes.deleteLike(curId);
        //toggle the button
        likesView.toggleLikeButton(false);
        //remove from UI
        likesView.deleteLike(curId);
    }
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

//Handle delete\update list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle delete
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
    //handle count update
    else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

//restore like recipes on page load
//TODO: TAKE INTO ACCOUNT -> window
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    //restore likes
    state.likes.readStorage();

    //toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

    //render likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    //TODO: TAKE INTO ACCOUNT
    //* means any child of clicked element
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        //add ingredients to shopping list
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
        
});