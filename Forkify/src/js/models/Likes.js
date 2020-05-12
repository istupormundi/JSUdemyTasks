export default class Likes{
    constructor(){
        this.likes = [];
    }

    addLike(id, title, author, img){
        const like = {id, title, author, img};
        this.likes.push(like);

        //save in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id){
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //delete from localStorage
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumberOfLikes(){
        return this.likes.length;
    }

    //TODO: TAKE INTO ACCOUNT
    persistData(){
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    //TODO: TAKE INTO ACCOUNT
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restore likes from the local storage
        if (storage) this.likes = storage;
    }
}