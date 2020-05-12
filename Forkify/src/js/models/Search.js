//npm install axios --save
//axios instead of fetch, cause the last in NA ES<6
import axios from 'axios';

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
        try{
            //API https://forkify-api.herokuapp.com
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            //res has lot of data. we need only recipes
            this.result = res.data.recipes;
            //console.log(this.result);
        }
        catch(e)
        {
            alert(e);
        }
    }
}
