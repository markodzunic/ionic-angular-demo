import { Injectable } from '@angular/core';
import {Recipe} from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  recipes: Recipe[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imgUrl: 'https://natashaskitchen.com/wp-content/uploads/2016/02/Pork-Schnitzel-Recipe-7.jpg',
      ingredients: [
        'testingr1',
        'test ingr2'
      ]
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imgUrl: 'https://coolinarika.azureedge.net/images/_variations/2/e/2ea746e355f2cb4a7fb2572e551bdc2d_view_l.jpg?v=2',
      ingredients: [
        'testingr1',
        'test ingr2'
      ]
    }
  ];
  constructor() { }

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe(recipeId: string) {
    return {...this.recipes.find(recipe => {
        return recipe.id === recipeId;
      })};
  }

  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter(recipe => {
      return recipe.id !== recipeId;
    });
  }
}
