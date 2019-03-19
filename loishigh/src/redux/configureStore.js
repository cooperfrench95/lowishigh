import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
//import logger from 'redux-logger';
import { ToggleNavbarTitle, changeFirstLoadMarker, images, blogposts, projects, 
        harpers_bazaar, auth, changePasswordRequest, resetPassword, 
        deleteAccount, createAccount, deleteSomethingState, uploadSomethingState, 
        usersState, galleryState, categoryState } from './Reducers';

export const ConfigureStore = () => {
    const store = createStore(combineReducers({
        ToggleNavbarTitle: ToggleNavbarTitle,
        changeFirstLoadMarker: changeFirstLoadMarker,
        images: images,
        blogposts: blogposts,
        projects: projects,
        harpers_bazaar: harpers_bazaar,
        auth: auth,
        changePasswordRequest: changePasswordRequest,
        resetPassword: resetPassword,
        deleteAccount: deleteAccount,
        createAccount: createAccount,
        deleteSomethingState: deleteSomethingState,
        uploadSomethingState: uploadSomethingState,
        usersState: usersState,
        galleryState: galleryState,
        categoryState: categoryState
    }),
        applyMiddleware(thunk/**, logger*/)
    );
    return store;
};