import { intialPostList } from '../constants/blog';
import { Post } from '../types/blog.type';
import {createReducer, createAction, createSlice, PayloadAction, nanoid, AsyncThunk, createAsyncThunk} from '@reduxjs/toolkit';
import http from 'utils/http';

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>


interface blogState {
   postList: Post[],
   editingPost: Post | null
}

const initialState: blogState = {
    postList: [],
    editingPost: null
}

// export const addPost = createAction<Post>('blog/addPost')
// export const deletePost = createAction<string>('blog/deletePost');
// export const startEditingPost = createAction<string>('blog/startEditingPost');
// export const cancelEditingPost = createAction('blog/cancelEditingPost');
// export const finishEditingPost = createAction<Post>('blog/finishEditingPost');

export const getPostList = createAsyncThunk('blog/getPostList', async (_, thunkAPI) => {
    const response = await http.get<Post[]>('posts', {
        signal: thunkAPI.signal
    });
    return response.data
});

export const addPost = createAsyncThunk('blog/addPost', async (body: Omit<Post, 'id'>, thunkAPI) => {
    try {
        const response = await http.post<Post>('posts', body, {
          signal: thunkAPI.signal
        })
        return response.data
      } catch (error: any) {
        if (error.name === 'AxiosError' && error.response.status === 422) {
          return thunkAPI.rejectWithValue(error.response.data)
        }
        throw error
      }
});

export const updatePost = createAsyncThunk("blog/updatePost", async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    try {
        const response = await http.put<Post>(`posts/${postId}`, body, {
          signal: thunkAPI.signal
        })
        return response.data
      } catch (error: any) {
        if (error.name === 'AxiosError' && error.response.status === 422) {
          return thunkAPI.rejectWithValue(error.response.data)
        }
        throw error
      }
});

export const deletePost = createAsyncThunk("blog/deletePost", async (postId: string, thunkAPI) => {
    const response = await http.delete<Post>(`posts/${postId}`, {
        signal: thunkAPI.signal
      })
      return response.data
})

const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
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
    },
    extraReducers(builder) {
        builder
          .addCase(getPostList.fulfilled, (state, action) => {
            state.postList = action.payload
          })
          .addCase(addPost.fulfilled, (state, action) => {
            state.postList.push(action.payload)
          }).addCase(updatePost.fulfilled, (state, action) => {
            state.postList.find((post, index) => {
                if(post.id === action.payload.id){
                    state.postList[index] = action.payload;
                    return true
                }
                return false
            })
            state.editingPost = null
          }).addCase(deletePost.fulfilled, (state, action) => {
            const postId = action.meta.arg
            const deletePostIndex = state.postList.findIndex((post) => post.id === postId)
            if (deletePostIndex !== -1) {
              state.postList.splice(deletePostIndex, 1)
            }
          })
          .addMatcher<PendingAction>(
            (action) => action.type.endsWith('/pending'),
            (state, action) => {
            }
          )
          .addMatcher<RejectedAction | FulfilledAction>(
            (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
            (state, action) => {
            }
          )
          .addDefaultCase((state, action) => {
            // console.log(`action type: ${action.type}`, current(state))
          })
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

export const {cancelEditingPost,startEditingPost, finishEditingPost} = blogSlice.actions;

const blogReducer = blogSlice.reducer
export default blogReducer