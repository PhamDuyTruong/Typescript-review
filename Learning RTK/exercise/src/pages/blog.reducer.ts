import { Post } from '../types/blog.type';
import {createReducer} from '@reduxjs/toolkit';


interface blogState {
   postList: Post[]
}

const initialState: blogState = {
    postList: []
}

const blogReducer = createReducer(initialState, builder => {

});

export default blogReducer;