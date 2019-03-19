import * as ActionTypes from './ActionTypes';

export const ToggleNavbarTitle = (state = {
    homeHeaderInView: true
}, action) => {
    switch (action.type) {
        case ActionTypes.TOGGLE_NAVBAR_TITLE:
            return {...state, homeHeaderInView: action.payload}
        default:
            return state;
    }
};

export const changeFirstLoadMarker = (state = {
    firstLoadMarker: true
}, action) => {
    switch (action.type) {
        case ActionTypes.CHANGE_FIRSTLOAD_MARKER:
            return {...state, firstLoadMarker: action.payload}
        default:
            return state
    }
};

export const images = (state = {
    isLoading: true,
    errorMessage: null,
    images: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_IMAGES:
            return {...state, isLoading: false, errorMessage: null, images: action.payload}
        case ActionTypes.IMAGES_LOADING:
            return {...state, isLoading: true, errorMessage: null, images: []}
        case ActionTypes.IMAGES_FAILED:
            return {...state, isLoading: false, errorMessage: action.payload, images: []}
        default:
            return state
    }
};

export const blogposts = (state = {
    isLoading: true,
    errorMessage: null,
    blogposts: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_BLOGPOSTS:
            return {...state, isLoading: false, errorMessage: null, blogposts: action.payload}
        case ActionTypes.BLOGPOSTS_LOADING:
            return {...state, isLoading: true, errorMessage: null, blogposts: []}
        case ActionTypes.BLOGPOSTS_FAILED:
            return {...state, isLoading: false, errorMessage: action.payload, blogposts: []}
        default:
            return state
    }
};

export const projects = (state = {
    isLoading: true,
    errorMessage: null,
    projects: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_PROJECTS:
            return {...state, isLoading: false, errorMessage: null, projects: action.payload}
        case ActionTypes.PROJECTS_LOADING:
            return {...state, isLoading: true, errorMessage: null, projects: []}
        case ActionTypes.PROJECTS_FAILED:
            return {...state, isLoading: false, errorMessage: action.payload, projects: []}
        default:
            return state
    }
};

export const harpers_bazaar = (state = {
    isLoading: true,
    errorMessage: null,
    harpers_bazaar: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_HARPERS_BAZAAR:
            return {...state, isLoading: false, errorMessage: null, harpers_bazaar: action.payload}
        case ActionTypes.HARPERS_BAZAAR_LOADING:
            return {...state, isLoading: true, errorMessage: null, harpers_bazaar: []}
        case ActionTypes.HARPERS_BAZAAR_FAILED:
            return {...state, isLoading: false, errorMessage: action.payload, harpers_bazaar: []}
        default:
            return state
    }
};

export const breadcrumb = (state = {
    breadcrumb: undefined
}, action) => {
    switch (action.type) {
        case ActionTypes.SET_CURRENT_BREADCRUMB:
            return {...state, breadcrumb: action.payload}
        default:
            return state
    }
}

export const auth = (state = {
    loginLoading: false,
    logoutLoading: false,
    loggedIn: false,
    token: false,
    admin: false,
    errorMessage: false,
    username: false,
    inbox: []
}, action) => {
    switch (action.type) {
        case ActionTypes.LOGOUT_LOADING:
            return {...state, logoutLoading: true}
        case ActionTypes.LOGIN_LOADING:
            return {...state, token: false, inbox: [], loggedIn: false, admin: false, errorMessage: false, loginLoading: true, username: false, logoutLoading: false}
        case ActionTypes.ADD_LOGIN_TOKEN:
            return {...state, token: action.payload.token, loggedIn: true, admin: false, errorMessage: false, loginLoading: false,
                    username: action.payload.username, logoutLoading: false, inbox: action.payload.inbox}
        case ActionTypes.DELETE_LOGIN_TOKEN:
            return {...state, token: false, inbox: [], loggedIn: false, admin: false, errorMessage: false, loginLoading: false, username: false, logoutLoading: false}
        case ActionTypes.LOGIN_FAILED:
            return {...state, token: false, inbox: [], loggedIn: false, admin: false, errorMessage: action.payload, loginLoading: false, username: false, logoutLoading: false}
        case ActionTypes.ADD_LOGIN_TOKEN_ADMIN:
            return {...state, token: action.payload.token, loggedIn: true, admin: true, errorMessage: false, loginLoading: false, 
                    username: action.payload.username, logoutLoading: false, inbox: action.payload.inbox}
        case ActionTypes.LOGOUT_FAILED:
            return {...state, errorMessage: action.payload, loginLoading: false, logoutLoading: false}
        case ActionTypes.UPDATE_INBOX:
            return {...state, inbox: action.payload}
        default:
            return state
    }
}

export const changePasswordRequest = (state = {
    emails_sent: false,
    errorMessage: false,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.CHANGE_PASSWORD_LOADING:
            return {...state, loading: true}
        case ActionTypes.CHANGE_PASSWORD_SUCCESS:
            return {...state, emails_sent: true, errorMessage: false, loading: false}
        case ActionTypes.CHANGE_PASSWORD_FAILED:
            return {...state, emails_sent: false, errorMessage: action.payload, loading: false}
        case ActionTypes.FORGOT_PASSWORD_ALL:
            return {...state, emails_sent: true, errorMessage: false, loading: false}
        default:
            return state
    }
}

export const resetPassword = (state = {
    success: false,
    errorMessage: false,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.RESET_PASSWORD_LOADING:
            return {...state, loading: true, errorMessage: false, success: false}
        case ActionTypes.RESET_PASSWORD_SUCCESS:
            return {...state, loading: false, success: true, errorMessage: false}
        case ActionTypes.RESET_PASSWORD_FAILED:
            return {...state, loading: false, success: false, errorMessage: action.payload}
        default:
            return state
    }
}

export const deleteAccount = (state = {
    success: false,
    errorMessage: false,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.DELETE_ACCOUNT_LOADING:
            return {...state, loading: true, errorMessage: false, success: false}
        case ActionTypes.DELETE_ACCOUNT_SUCCESS:
            return {...state, loading: false, success: true, errorMessage: false}
        case ActionTypes.DELETE_ACCOUNT_FAILED:
            return {...state, loading: false, success: false, errorMessage: action.payload}
        default:
            return state
    }
}

export const createAccount = (state = {
    success: false,
    errorMessage: false,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.CREATE_ACCOUNT_LOADING:
            return {...state, loading: true, errorMessage: false, success: false}
        case ActionTypes.CREATE_ACCOUNT_SUCCESS:
            return {...state, loading: false, success: true, errorMessage: false}
        case ActionTypes.CREATE_ACCOUNT_FAILED:
            return {...state, loading: false, success: false, errorMessage: action.payload}
        default:
            return state
    }
}

export const deleteSomethingState = (state = {
    success: false,
    errorMessage: false,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.DELETE_SOMETHING_LOADING:
            return {...state, loading: true, errorMessage: false, success: false}
        case ActionTypes.DELETE_SOMETHING_SUCCESS:
            return {...state, loading: false, success: true, errorMessage: false}
        case ActionTypes.DELETE_SOMETHING_FAILED:
            return {...state, loading: false, success: false, errorMessage: action.payload}
        default:
            return state
    }
}


export const uploadSomethingState = (state = {
    success: false,
    errorMessage: false,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.UPLOAD_SOMETHING_LOADING:
            return {...state, loading: true, errorMessage: false, success: false}
        case ActionTypes.UPLOAD_SOMETHING_SUCCESS:
            return {...state, loading: false, success: true, errorMessage: false}
        case ActionTypes.UPLOAD_SOMETHING_FAILED:
            return {...state, loading: false, success: false, errorMessage: action.payload}
        default:
            return state
    }
}

export const usersState = (state = {
    users: undefined,
    errorMessage: false,
    loading: false
}, action) => {
    switch (action.type) {
        case ActionTypes.USERS_LOADING:
            return {...state, loading: true, errorMessage: false, users: undefined}
        case ActionTypes.ADD_USERS:
            return {...state, loading: false, users: action.payload, errorMessage: false}
        case ActionTypes.USERS_FAILED:
            return {...state, loading: false, users: undefined, errorMessage: action.payload}
        default:
            return state
    }
};

export const galleryState = (state = {
    isLoading: false,
    errorMessage: null,
    gallery: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_GALLERY:
            return {...state, isLoading: false, errorMessage: null, gallery: action.payload}
        case ActionTypes.GALLERY_LOADING:
            return {...state, isLoading: true, errorMessage: null, gallery: []}
        case ActionTypes.GALLERY_FAILED:
            return {...state, isLoading: false, errorMessage: action.payload, gallery: []}
        default:
            return state
    }
};

export const categoryState = (state = {
    isLoading: false,
    errorMessage: null,
    categories: []
}, action) => {
    switch (action.type) {
        case ActionTypes.ADD_CATEGORIES:
            return {...state, isLoading: false, errorMessage: null, categories: action.payload}
        case ActionTypes.CATEGORIES_LOADING:
            return {...state, isLoading: true, errorMessage: null, categories: []}
        case ActionTypes.CATEGORIES_FAILED:
            return {...state, isLoading: false, errorMessage: action.payload, categories: []}
        default:
            return state
    }
};