import * as ActionTypes from './ActionTypes';
import { baseURL } from '../shared/baseURL';
import { fixInput, fixOutput } from './FilterCharacters';

export const toggleNavbarTitle = (inView) => ({
    type: ActionTypes.TOGGLE_NAVBAR_TITLE,
    payload: inView
});

export const changeFirstLoadMarker = (value) => ({
    type: ActionTypes.CHANGE_FIRSTLOAD_MARKER,
    payload: value
});

export const fetchBlogposts = () => async (dispatch) =>  {

    dispatch(blogpostsLoading());
    try {
        const response = await fetch(baseURL + 'blogposts'); 
        if (response.ok) {
            var blogposts = await response.json();
            blogposts = blogposts.map((item) => {
                item.name = fixOutput(item.name);
                item.data.title = fixOutput(item.data.title);
                item.data.categories = item.data.categories.map((category) => {
                    category = fixOutput(category);
                    return category
                });
                item.data.content = item.data.content.map((item1) => {
                    if (item1.content) {
                        item1.content = fixOutput(item1.content);
                    }
                    return item1
                });
                if (item.data.comments !== []) {
                    item.data.comments = item.data.comments.map((item2) => {
                        item2.content = fixOutput(item2.content);
                        return item2
                    });
                }
                return item
            });
            return dispatch(addBlogposts(blogposts));
        }
        else {
            console.log(response);
            throw new Error("Failed to fetch the blogposts! " + response.status + ': ' + response.statusText)
        }
    }
    catch (err) {
        dispatch(blogpostsFailed(err.message));
    }
};

export const blogpostsLoading = () => ({
    type: ActionTypes.BLOGPOSTS_LOADING
});

export const blogpostsFailed = (errorMessage) => ({
    type: ActionTypes.BLOGPOSTS_FAILED,
    payload: errorMessage
});

export const addBlogposts = (blogposts) => ({
    type: ActionTypes.ADD_BLOGPOSTS,
    payload: blogposts
});

export const fetchImages = () => async (dispatch) =>  {

    dispatch(imagesLoading());
    
    try {
        const response = await fetch(baseURL + 'images')
        if (response.ok) {
            var images = await response.json();
            return dispatch(addImages(images));
        }
        else {
            console.log(response);
            throw new Error("Failed to fetch the images! " + response.status + ': ' + response.statusText)
        }
    }
    catch (error) {
        dispatch(imagesFailed(error.message));
    }
    
};

export const imagesLoading = () => ({
    type: ActionTypes.IMAGES_LOADING
});

export const imagesFailed = (errorMessage) => ({
    type: ActionTypes.IMAGES_FAILED,
    payload: errorMessage
});

export const addImages = (images) => ({
    type: ActionTypes.ADD_IMAGES,
    payload: images
});

export const fetchProjects = () => async (dispatch) =>  {

    dispatch(projectsLoading());
    try {
        const response = await fetch(baseURL + 'projects');
        if (response.ok) {
            var projects = await response.json();
            projects = projects.map((project) => {
                project.data.description = project.data.description.map((item) => {
                    item = fixOutput(item);
                    return item
                });
                project.data.title = fixOutput(project.data.title);
                project.data.youtube_link = fixOutput(project.data.youtube_link);
                return project
            })
            return dispatch(addProjects(projects));
        }
        else {
            console.log(response);
            throw new Error("Failed to fetch the projects! " + response.status + ': ' + response.statusText)
        }
    }
    catch (error) {
        dispatch(projectsFailed(error.message));
    }
};

export const projectsLoading = () => ({
    type: ActionTypes.PROJECTS_LOADING
});

export const projectsFailed = (errorMessage) => ({
    type: ActionTypes.PROJECTS_FAILED,
    payload: errorMessage
});

export const addProjects = (projects) => ({
    type: ActionTypes.ADD_PROJECTS,
    payload: projects
});

export const fetchHarpersBazaar = () => async (dispatch) =>  {

    dispatch(harpers_bazaarLoading());
    try {
        const response = await fetch(baseURL + 'harpers_bazaar')
        if (response.ok) {
            var harpers_bazaar = await response.json();
            harpers_bazaar.sort((a, b) => {return (new Date(b.date)) - (new Date(a.date))})
            return dispatch(addHarpersBazaar(harpers_bazaar));
        }
        else {
            console.log(response);
            throw new Error("Failed to fetch the articles! " + response.status + ': ' + response.statusText)
        }
    }
    catch (error) {
        dispatch(harpers_bazaarFailed(error.message));
    }
    
};

export const harpers_bazaarLoading = () => ({
    type: ActionTypes.HARPERS_BAZAAR_LOADING
});

export const harpers_bazaarFailed = (errorMessage) => ({
    type: ActionTypes.HARPERS_BAZAAR_FAILED,
    payload: errorMessage
});

export const addHarpersBazaar = (harpers_bazaar) => ({
    type: ActionTypes.ADD_HARPERS_BAZAAR,
    payload: harpers_bazaar
});

export const setCurrentBreadCrumb = (category) => ({
    type: ActionTypes.SET_CURRENT_BREADCRUMB,
    payload: category
})

export const login = (loginDetails) => async (dispatch) =>  {
    
    try {

        dispatch(loginLoading());

        var response = await fetch(baseURL + 'users/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginDetails) });
        if (response.ok) {
            response = await response.json();
            if (response.jwt && response.admin === true && response.username) {
                localStorage.setItem('token', JSON.stringify({ token: response.jwt, username: response.username, admin: response.admin, inbox: response.inbox }));
                return dispatch(addLoginTokenAdmin({ token: response.jwt, username: response.username, inbox: response.inbox }));
            }
            else if (response.jwt && response.username) {
                localStorage.setItem('token', JSON.stringify({ token: response.jwt, username: response.username, admin: response.admin, inbox: response.inbox }));
                return dispatch(addLoginToken({ token: response.jwt, username: response.username, inbox: response.inbox }));
            }
            else if (response.err) {
                throw new Error(response.err);
            }
            else {
                throw new Error("There seems to be something wrong with the response")
            }
        }
        else {
            throw new Error(response);
        }
    }

    catch (err) {
        return dispatch(loginFailed(err.message));
    }

};

const checkIfTokenIsStillValid = async (token) => {
    try {
        var response = await fetch(baseURL + 'verify', { headers: { 'Authorization': 'Bearer ' + token.token } });
        if (response.ok) {
            return true
        }
        else {
            return false
        }
    }
    catch (err) {
        return false
    }
};

export const checkForTokenInLocalStorage = () => async (dispatch) => {
    
    try {
        var token = await JSON.parse(localStorage.getItem('token'));
        if (token) {
            dispatch(loginLoading());
        }
        var tokenIsValid = await checkIfTokenIsStillValid(token);
        if (tokenIsValid) {
            if (token.token && token.admin === true) {
                return dispatch(addLoginTokenAdmin(token))
            }
            else if (token.token && token.admin === false) {
                return dispatch(addLoginToken(token))
            }
            else {
                throw new Error('Token is wrong');
            }
        }
        else {
            throw new Error('Token is invalid');
        }
    }
    catch (err) {
        console.log(err);
        dispatch(deleteLoginToken());
        localStorage.removeItem('token');
    }

};

export const logout = (token) => async (dispatch) =>  {
    
    try {

        dispatch(logoutLoading());

        var response = await fetch(baseURL + 'users/logout', { method: 'POST', headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            } });
        if (response.ok) { 
            response = await response.json();
            if (response.success) {
                localStorage.removeItem('token');
                return dispatch(deleteLoginToken(token));
            }
            else if (response.error) { 
                throw new Error(response.err);
            }
        }
        else {
            throw new Error(response);
        }
    }

    catch (err) {
        dispatch(logoutFailed(err.message));
    }

};

export const loginLoading = () => ({
    type: ActionTypes.LOGIN_LOADING
});

export const logoutLoading = () => ({
    type: ActionTypes.LOGOUT_LOADING
});

export const logoutFailed = (errorMessage) => ({
    type: ActionTypes.LOGOUT_FAILED,
    payload: errorMessage
});

export const loginFailed = (errorMessage) => ({
    type: ActionTypes.LOGIN_FAILED,
    payload: errorMessage
});

export const addLoginToken = (token) => ({
    type: ActionTypes.ADD_LOGIN_TOKEN,
    payload: token
});

export const addLoginTokenAdmin = (token) => ({
    type: ActionTypes.ADD_LOGIN_TOKEN_ADMIN,
    payload: token
});

export const deleteLoginToken = () => ({
    type: ActionTypes.DELETE_LOGIN_TOKEN,
});

export const changePasswordLoading = () => ({
    type: ActionTypes.CHANGE_PASSWORD_LOADING
});

export const changePasswordFromWithinAccount = (token) => async (dispatch) =>  {
    
    try {

        dispatch(changePasswordLoading());

        var response = await fetch(baseURL + 'users/changepassword', { method: 'POST', headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }});
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                return dispatch(changePasswordFromWithinAccountSuccess());
            }
            else if (response.error) { 
                throw new Error(response.err);
            }
        }
        else {
            throw new Error(response);
        }
    }

    catch (err) {
        dispatch(changePasswordFromWithinAccountFailed(err.message));
    }

};

export const changePasswordFromWithinAccountSuccess = () => ({
    type: ActionTypes.CHANGE_PASSWORD_SUCCESS
});

export const changePasswordFromWithinAccountFailed = (errorMessage) => ({
    type: ActionTypes.CHANGE_PASSWORD_FAILED,
    payload: errorMessage
});

export const changePasswordFromOutsideAccount = (email) => async (dispatch) =>  {
    
    try {

        dispatch(changePasswordLoading());

        var response = await fetch(baseURL + 'users/forgotpassword', { method: 'POST', headers: { 
                'Content-Type': 'application/json'
            }, body: JSON.stringify({ email: fixInput(email) }) });
        if (response.ok) {
            dispatch(changePasswordFromOutsideAccountAll());
        }
        else {
            throw new Error(response);
        }
    }

    catch (err) {
        console.log(err);
    }

};

export const changePasswordFromOutsideAccountAll = () => ({
    type: ActionTypes.FORGOT_PASSWORD_ALL
});

export const resetPasswordLoading = () => ({
    type: ActionTypes.RESET_PASSWORD_LOADING
});

export const requestResetPassword = (values) => async (dispatch) =>  {
    
    try {

        dispatch(resetPasswordLoading());

        var response = await fetch(baseURL + 'users/resetpassword', { method: 'POST', headers: { 
                'Content-Type': 'application/json'
            }, body: JSON.stringify(values) });
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                dispatch(requestResetPasswordSuccess());
            }
            else if (response.error) {
                throw new Error(response.error)
            }
        }
        else {
            throw new Error(response);
        }
    }

    catch (err) {
        dispatch(requestResetPasswordFailed(err));
    }

};

export const requestResetPasswordFailed = (error) => ({
    type: ActionTypes.RESET_PASSWORD_FAILED,
    payload: error
});

export const requestResetPasswordSuccess = () => ({
    type: ActionTypes.RESET_PASSWORD_SUCCESS
});


export const deleteAccountLoading = () => ({
    type: ActionTypes.DELETE_ACCOUNT_LOADING
});

export const deleteAccount = (values, token) => async (dispatch) =>  {
    
    try {

        dispatch(deleteAccountLoading());

        var response = await fetch(baseURL + 'users/signup', { method: 'DELETE', headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }, body: JSON.stringify(values) });
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                dispatch(deleteAccountSuccess());
                localStorage.removeItem('token');
                dispatch(deleteLoginToken(token));
            }
            else if (response.error) {
                throw new Error(response.error)
            }
        }
        else {
            throw new Error(response);
        }
    }

    catch (err) {
        dispatch(deleteAccountFailed(err));
    }

};

export const deleteAccountFailed = (error) => ({
    type: ActionTypes.DELETE_ACCOUNT_FAILED,
    payload: error
});

export const deleteAccountSuccess = () => ({
    type: ActionTypes.DELETE_ACCOUNT_SUCCESS
});

export const createAccountLoading = () => ({
    type: ActionTypes.CREATE_ACCOUNT_LOADING
});

export const createAccount = (values) => async (dispatch) =>  {
    
    try {

        dispatch(createAccountLoading());

        values.email = fixInput(values.email);
        values.recovery_email = fixInput(values.recovery_email);

        var response = await fetch(baseURL + 'users/signup', { method: 'POST', headers: { 
                'Content-Type': 'application/json'
            }, body: JSON.stringify(values) });
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                dispatch(createAccountSuccess());
            }
            else if (response.error) {
                throw new Error(response.error)
            }
        }
        else {
            throw new Error(response);
        }
    }

    catch (err) {
        dispatch(createAccountFailed(err));
    }

};

export const createAccountFailed = (error) => ({
    type: ActionTypes.CREATE_ACCOUNT_FAILED,
    payload: error
});

export const createAccountSuccess = () => ({
    type: ActionTypes.CREATE_ACCOUNT_SUCCESS
});

export const deleteSomething = (values, type, token, blogposts, gallery, categories) => async (dispatch) =>  {
    
    try {

        dispatch(deleteSomethingLoading());
        switch (type) {
            case 'image':
                // Delete it from the images collection on the server
                values.src = fixInput(values.src);
                values.alt = fixInput(values.alt);
                var response = await fetch(baseURL + 'images/?_id=' + values._id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                if (response.ok) {
                    response = await response.json();
                    if (response.success) {
                        // Delete the actual image from the server
                        var response2 = await fetch(baseURL + 'uploadImages', { method: 'DELETE', headers: { 
                            'Authorization': 'Bearer ' + token, 
                            'Content-Type': 'application/json' }, 
                            body: JSON.stringify(values) });
                        if (response2.ok) {
                            response2 = await response2.json();
                            if (response2.success) {
                                // Search for the image in the gallery and delete it from there.
                                var gallery_to_update = false;
                                gallery.map(gal => {
                                    if (gal._id === values._id) {
                                        gallery_to_update = true;
                                    }
                                    return gal;
                                });


                                // Search for the image in categories and delete it from there.
                                var category_to_update_contains_something = false;
                                var category_to_update = [];
                                categories.map(cat =>  {
                                    if (cat.image._id === values._id) {
                                        category_to_update_contains_something = true;
                                        category_to_update.push(cat);
                                    }
                                    return cat;
                                });

                                // Search for the image in blogposts and delete it from there. Finally, update those blogposts on the server.
                                var blogposts_to_update;
                                var blogposts_to_update_contains_something = false;
                                blogposts.map((post, index) => {
                                    var newPost = {...post};
                                    var changed = false;
                                    // Delete the title photo if it's the same
                                    if (post.data.hasOwnProperty('title_photo')) {
                                        if (post.data.title_photo === values.src) {
                                            delete newPost.data.title_photo;
                                            changed = true;
                                            blogposts_to_update_contains_something = true;
                                        }
                                    }
                                    // Delete any references to the image in the blogpost itself
                                    newPost.data.content = post.data.content.filter(e => {
                                        if (e.type !== 'img') {
                                            return true
                                        }
                                        else if (e.type === 'img' && e.image !== values.src) {
                                            return true
                                        }
                                        else {
                                            changed = true;
                                            blogposts_to_update_contains_something = true;
                                            return false
                                        }
                                    });
                                    if (changed) {
                                        blogposts_to_update.push(newPost);
                                    }
                                    return null
                                });

                                // Update the blogposts/gallery/category on the server.
                                if (blogposts_to_update_contains_something === true || gallery_to_update === true || category_to_update_contains_something === true) {
                                    if (blogposts_to_update_contains_something === true) {
                                        for (let i = 0; i < blogposts_to_update.length; i++) {
                                            blogposts_to_update[i].name = fixInput(blogposts_to_update[i].name);
                                            blogposts_to_update[i].data.title = fixInput(blogposts_to_update[i].data.title);
                                            blogposts_to_update[i].data.content = blogposts_to_update[i].data.content.map((item) => {
                                                if (item.data.content) {
                                                    item.content = fixInput(item.content);
                                                }
                                                return item
                                            });
                                            blogposts_to_update[i].data.categories = blogposts_to_update[i].data.categories.map((category) => {
                                                category = fixInput(category);
                                                return category
                                            });
                                            if (blogposts_to_update[i].data.comments.length !== 0) {
                                                blogposts_to_update[i].data.comments = blogposts_to_update[i].data.comments.map((item) => {
                                                    item.content = fixInput(item.content);
                                                    return item
                                                });
                                            }
                                            var current_response = await fetch(baseURL + 'blogposts', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token,
                                                                                                            'Content-Type': 'application/json' },
                                                                                                            body: JSON.stringify(blogposts_to_update[i]) });
                                            if (!current_response.ok) {
                                                throw new Error(current_response);
                                            }
                                        }
                                    }
                                    if (gallery_to_update === true) {
                                        current_response = await fetch(baseURL + 'galleryimages/?_id=' + values._id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                                        if (!current_response.ok) {
                                            throw new Error(current_response);
                                        }
                                    }
                                    if (category_to_update_contains_something === true) {
                                        current_response = await fetch(baseURL + 'categories/?_id=' + category_to_update._id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                                        if (!current_response.ok) {
                                            throw new Error(current_response);
                                        }
                                    }
                                    dispatch(fetchCategories());
                                    dispatch(fetchGallery());
                                    dispatch(fetchBlogposts());
                                    dispatch(fetchImages());
                                    dispatch(deleteSomethingSuccess());
                                }
                                else {
                                    dispatch(fetchImages());
                                    dispatch(deleteSomethingSuccess());
                                }
                            }
                            else if (response2.error) {
                                throw new Error(response2.error)
                            }
                        }
                        else {
                            throw new Error(response);
                        }
                        
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break
            case 'blogpost':
                response = await fetch(baseURL + 'blogposts/?_id=' + values._id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                if (response.ok) {
                    response = await response.json();
                    if (response.success) {
                        dispatch(deleteSomethingSuccess());
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break
            case 'article':
                response = await fetch(baseURL + 'harpers_bazaar/?_id=' + values._id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                if (response.ok) {
                    response = await response.json();
                    if (response.success) {
                        dispatch(deleteSomethingSuccess());
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break
            case 'project':
                response = await fetch(baseURL + 'projects/?_id=' + values._id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                if (response.ok) {
                    response = await response.json();
                    if (response.success) {
                        dispatch(deleteSomethingSuccess());
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break
            case 'user':
                response = await fetch(baseURL + 'users/signup', { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token,
                                                                                                "Content-Type": 'application/json' },
                                                                                        body:  JSON.stringify(values)});
                if (response.ok) {
                    response = await response.json(); 
                    if (response.success) {
                        dispatch(deleteSomethingSuccess());
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break         
            default:
                return new Error('Wrong type')
        }
    }

    catch (err) {
        console.log(err);
        dispatch(deleteSomethingFailed(err));
    }

};

export const deleteSomethingFailed = (error) => ({
    type: ActionTypes.DELETE_SOMETHING_FAILED,
    payload: error
});

export const deleteSomethingSuccess = () => ({
    type: ActionTypes.DELETE_SOMETHING_SUCCESS
});

export const deleteSomethingLoading = () => ({
    type: ActionTypes.DELETE_SOMETHING_LOADING
});

export const uploadSomething = (values, type, token) => async (dispatch) =>  {
    
    try {

        dispatch(uploadSomethingLoading());

        switch (type) {
            case 'comment':

                values.newComment.content = fixInput(values.newComment.content);
                var response = await fetch(baseURL + 'comments', { method: 'POST', 
                                                                    headers: { 
                                                                                'Content-Type':'application/json', 
                                                                                'Authorization': 'Bearer ' + token 
                                                                            },
                                                                    body: JSON.stringify(values) });
                if (response.ok) {
                    response = await response.json();
                    if (response.success) {
                        dispatch(uploadSomethingSuccess());
                        dispatch(fetchBlogposts());
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break
            case 'blogpost':
                values.name = fixInput(values.name);
                values.data.title = fixInput(values.data.title);
                values.data.content = values.data.content.map((item) => {
                    if (item.content) {
                        item.content = fixInput(item.content);
                    }
                    else if (item.image) {
                        item.image = fixInput(item.image);
                    }
                    item.type = fixInput(item.type);
                    return item
                });
                values.data.categories = values.data.categories.map((category) => {
                    category = fixInput(category);
                    return category
                });
                if (!values.data.comments) {
                    values.data.comments = [];
                }
                else {
                    values.data.comments = values.data.comments.map((item) => {
                        item.content = fixInput(item.content);
                        return item
                    });
                }
                if (!values.data.subscribers) {
                    values.data.subscribers = [];
                }
                response = await fetch(baseURL + 'blogposts', { method: 'POST', 
                                                                    headers: { 
                                                                                'Content-Type':'application/json', 
                                                                                'Authorization': 'Bearer ' + token 
                                                                            },
                                                                    body: JSON.stringify(values) });
                if (response.ok) {
                    response = await response.json();
                    if (response.success) {
                        dispatch(uploadSomethingSuccess());
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break
            case 'images': 
                for (let i = 0; i < values.length; i++) {
                    var formData = new FormData();
                    var name = fixInput(values[i].name)
                    formData.append('file', values[i].file, name);
                    
                    response = await fetch(baseURL + 'uploadImages', {  method: 'POST', 
                                                                        headers: { 'Authorization': 'Bearer ' + token }, 
                                                                        body: formData });
                    if (response.ok) {
                        response = await response.json();
                        if (response.success) {
                            values[i].success = true;
                            var error = false;
                            if (name.match(/\.(jpeg)$/)) {
                                var alt = name.slice(0, -5)
                            }
                            else if (name.match(/\.(jpg|png)$/)) {
                                alt = name.slice(0, -4)
                            }
                            var response2 = await fetch(baseURL + 'images/', { method: "POST", headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, 
                                                                        body: JSON.stringify({ src: alt + '.png', alt: alt })});
                            if (response2.ok) {
                                response2 = await response2.json();
                                if (response2.success) {
                                    values[i].success = true;
                                    error = false;
                                }
                                else {
                                    values[i].success = new Error(response);
                                    error = true;
                                }
                            }
                            else if (response.error) {
                                values[i].success = new Error(response);
                                error = true;
                            }
                        }
                        else if (response.error) {
                            values[i].success = new Error(response);
                            error = true;
                        }
                    }
                    else {
                        values[i].success = new Error(response);
                        error = true;
                    }
                }
                if (error === true) {
                    for (let i = 0; i < values.length; i++) {
                        if (values[i].success !== true) {
                            return dispatch(uploadSomethingFailed(values[i].success));
                        }
                    }
                }
                else {
                    dispatch(uploadSomethingSuccess());
                }
                break
            case 'project':
                values.data.description = values.data.description.map((item) => {
                    item = fixInput(item);
                    return item
                })
                values.data.title = fixInput(values.data.title);
                values.data.youtube_link = fixInput(values.data.youtube_link);
                response = await fetch(baseURL + 'projects', { method: 'POST', 
                                                                headers: {  'Content-Type':'application/json', 
                                                                            'Authorization': 'Bearer ' + token },
                                                                body: JSON.stringify(values) });
                if (response.ok) {
                    response = await response.json();
                    if (response.success) {
                        dispatch(uploadSomethingSuccess());
                    }
                    else if (response.error) {
                        throw new Error(response.error)
                    }
                }
                else {
                    throw new Error(response);
                }
                break         
            default:
                return new Error('Wrong type')
        }
    }

    catch (err) {
        dispatch(uploadSomethingFailed(err));
    }

};

export const uploadSomethingFailed = (error) => ({
    type: ActionTypes.UPLOAD_SOMETHING_FAILED,
    payload: error
});

export const uploadSomethingSuccess = () => ({
    type: ActionTypes.UPLOAD_SOMETHING_SUCCESS
});

export const uploadSomethingLoading = () => ({
    type: ActionTypes.UPLOAD_SOMETHING_LOADING
});

export const fetchUsers = (token) => async (dispatch) =>  {

    try {
        dispatch(usersLoading());
        const response = await fetch(baseURL + 'users/signup', { method: "GET", headers: { 'Authorization': "Bearer " + token }});
        if (response.ok) {
            var users = await response.json();
            return dispatch(addUsers(users));
        }
        else {
            console.log(response);
            throw new Error("Failed to fetch the users! " + response.status + ': ' + response.statusText)
        }
    }
    catch (err) {
        dispatch(usersFailed(err.message));
    }
};

export const usersLoading = () => ({
    type: ActionTypes.USERS_LOADING
});

export const usersFailed = (errorMessage) => ({
    type: ActionTypes.USERS_FAILED,
    payload: errorMessage
});

export const addUsers = (users) => ({
    type: ActionTypes.ADD_USERS,
    payload: users
});

export const setMessageReadToTrue = (message, token, inbox) => async (dispatch) => {
    try {
        var response = await fetch(baseURL + 'comments/read', { method: 'POST', headers: { 'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token}, body: JSON.stringify({ message: message }) })
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                dispatch(updateInbox(message, inbox));
            }
            else {
                throw new Error('Bad response')
            }
        }
        else {
            throw new Error('Bad response')
        }
    }
    catch (err) {
        console.log(err);
    }
};

export const updateInbox = (message, inbox) => ({
    type: ActionTypes.UPDATE_INBOX,
    payload: inbox.map((oldmessage, id) => {
        if (oldmessage._id === message.id) {
            return { ...oldmessage, read: true }
        }
        else {
            return oldmessage
        }
    })
})

export const deleteComment = (comment, blogpost, token) => async (dispatch) => {
    try {
        var response = await fetch(baseURL + 'comments', { method: 'DELETE', headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token}, body: JSON.stringify({ blogpost: blogpost, comment: comment })});
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                dispatch(fetchBlogposts());
            }
            else {
                throw new Error('Bad response')
            }
        }
        else {
            throw new Error('Bad response')
        }
    }
    catch (err) {
        console.log(err);
    }
};

export const fetchGallery = () => async (dispatch) =>  {

    dispatch(galleryLoading());
    try {
        const response = await fetch(baseURL + 'galleryimages');
        if (response.ok) {
            var gallery = await response.json();
            gallery = gallery.map((i, index) => {i.id = index; return i});
            gallery = gallery.filter(i => i.image !== null);
            return dispatch(addGallery(gallery));
        }
        else {
            console.log(response);
            throw new Error("Failed to fetch the images! " + response.status + ': ' + response.statusText)
        }
    }
    catch (error) {
        dispatch(galleryFailed(error.message));
    }
    
};

export const galleryLoading = () => ({
    type: ActionTypes.GALLERY_LOADING
});

export const galleryFailed = (errorMessage) => ({
    type: ActionTypes.GALLERY_FAILED,
    payload: errorMessage
});

export const addGallery = (gallery) => ({
    type: ActionTypes.ADD_GALLERY,
    payload: gallery
});

export const changeGallery = (newGallery, token, imagesToDelete) => async (dispatch) => {
    try {

        if (imagesToDelete) {
            for (let i = 0; i < imagesToDelete.length; i++) {
                var deleteResponse = await fetch(baseURL + 'galleryimages/?_id=' + imagesToDelete[i]._id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + token }});
                if (deleteResponse.ok) {
                    continue
                }
                else {
                    throw new Error('Problem deleting the images');
                }
            }
        }
        var response = await fetch(baseURL + 'galleryimages', { method: 'POST', headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token }, body: JSON.stringify({ gallery: newGallery })});
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                response.gallery = response.gallery.map((i, index) => {
                    i.id = index;
                    return i
                });
                response.gallery = response.gallery.filter(i => i.image !== null);
                dispatch(addGallery(response.gallery));
            }
            else {
                throw new Error('Bad response')
            }
        }
        else {
            throw new Error('Bad response')
        }
    }
    catch (err) {
        console.log(err);
    }
};

export const fetchCategories = () => async (dispatch) =>  {

    dispatch(categoriesLoading());
    try {
        const response = await fetch(baseURL + 'categories');
        if (response.ok) {
            var categories = await response.json();
            return dispatch(addCategories(categories));
        }
        else {
            console.log(response);
            throw new Error("Failed to fetch the categories! " + response.status + ': ' + response.statusText)
        }
    }
    catch (error) {
        dispatch(categoriesFailed(error.message));
    }
    
};

export const categoriesLoading = () => ({
    type: ActionTypes.CATEGORIES_LOADING
});

export const categoriesFailed = (errorMessage) => ({
    type: ActionTypes.CATEGORIES_FAILED,
    payload: errorMessage
});

export const addCategories = (categories) => ({
    type: ActionTypes.ADD_CATEGORIES,
    payload: categories
});

export const changeCategories = (newCategories, token) => async (dispatch) => {
    try {
        for (let i = 0; i < newCategories.length; i ++) {
            if (newCategories[i].category === '') {
                newCategories.splice(i, 1);
            }
        }
        console.log(JSON.stringify({ categories: newCategories }));
        var response = await fetch(baseURL + 'categories', { method: 'POST', headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token }, body: JSON.stringify({ categories: newCategories })});
        if (response.ok) {
            response = await response.json();
            if (response.success) {
                dispatch(addCategories(response.categories));
            }
            else {
                throw new Error('Bad response')
            }
        }
        else {
            throw new Error('Bad response')
        }
    }
    catch (err) {
        console.log(err);
    }
};