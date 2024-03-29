import { intialPostList } from './../constants/blog';
import { Post } from '../types/blog.type';
import {createReducer, createAction, createSlice, PayloadAction, nanoid} from '@reduxjs/toolkit';


interface blogState {
   postList: Post[],
   editingPost: Post | null
}

const initialState: blogState = {
    postList: intialPostList,
    editingPost: null
}

// export const addPost = createAction<Post>('blog/addPost')
// export const deletePost = createAction<string>('blog/deletePost');
// export const startEditingPost = createAction<string>('blog/startEditingPost');
// export const cancelEditingPost = createAction('blog/cancelEditingPost');
// export const finishEditingPost = createAction<Post>('blog/finishEditingPost');

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        deletePost: (state, action: PayloadAction<string>) => {
            const postId = action.payload;
            const foundPostIndex = state.postList.findIndex(post => post.id === postId);
            if(foundPostIndex !== -1){
                state.postList.splice(foundPostIndex, 1);
            }
        },
        startEditingPost: (state, action: PayloadAction<string>) => {
            const postId = action.payload
            const foundPost = state.postList.find((post) => post.id === postId) || null
            state.editingPost = foundPost
        },
        cancelEditingPost: (state) => {
            state.editingPost = null
        },
        finishEditingPost: (state, action: PayloadAction<Post>) => {
            const postId = action.payload.id;
            state.postList.some((post, index) => {
                if(post.id === postId){
                    state.postList[index] = action.payload;
                    return true;
                }
                return false;
            })
        },
        addPost: {
            reducer: (state, action: PayloadAction<Post>) =>  {
                const post = action.payload;
                state.postList.push(post);
            },
            prepare: (post: Omit<Post, 'id'>) => {
                return {
                    payload: {
                        ...post,
                        id: nanoid()
                    }
                }
            }
        }

    }
})

// const blogReducer = createReducer(initialState, builder => {
//     builder.addCase(addPost, (state, action) => {
//         //ImmerJS giúp chúng ta mutate một state an toàn
//         const post = action.payload
//         state.postList.push(post)
//     }).addCase(deletePost, (state, action) => {
//         const postId = action.payload;
//         const foundPostIndex = state.postList.findIndex(post => post.id === postId);
//         if(foundPostIndex !== -1){
//             state.postList.splice(foundPostIndex, 1);
//         }
//     }).addCase(startEditingPost, (state, action) => {
//         const postId = action.payload
//         const foundPost = state.postList.find((post) => post.id === postId) || null
//         state.editingPost = foundPost
//     }).addCase(cancelEditingPost, (state, action) => {
//         state.editingPost = null;
//     }).addCase(finishEditingPost, (state, action) => {
//         const postId = action.payload.id;
//         state.postList.some((post, index) => {
//             if(post.id === postId){
//                 state.postList[index] = action.payload;
//                 return true;
//             }
//             return false;
//         })
//     })
// });

export const {addPost, deletePost, cancelEditingPost,startEditingPost, finishEditingPost} = blogSlice.actions;

const blogReducer = blogSlice.reducer
export default blogReducer