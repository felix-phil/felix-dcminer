import { GET_ARTICLES, GET_ARTICLE, DELETE_ARTICLE, EDIT_ARTICLE, GET_ARTICLES_USERS, GET_ARTICLE_USERS } from './articleTypes'
import { LOADING, STOP_LOADING } from './loadingTypes'
import { createMessage, returnErrors } from './messages'
import axios from 'axios'

export const getArticles = (pageNo) => async dispatch => {
    if (localStorage.getItem('access')) {
        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `JWT ${localStorage.getItem('access')}`,
                "Accept": "application/json",
            }
        };

        await axios.get(`${process.env.REACT_APP_API_URL}/article/api/article/`, config)
            .then(response => {
                dispatch({
                    type: GET_ARTICLES,
                    payload: response.data.results
                });
                console.log(response.data)
                dispatch(createMessage({ articleload: 'Article was successfully loaded' }));
            }).catch(err => {
                dispatch(returnErrors(err.response.data, err.response.status))
            })
    } else {
        dispatch(createMessage({ articleloadperm: 'Please login to continue!' }));
    }
}
// export const getArticlesUsers = (pageNo) => async dispatch => {
//     try {
//         dispatch({
//             type: LOADING
//         })
//         await axios.get(`${process.env.REACT_APP_API_URL}/article/api/article/user/`)
//             .then(response => {
//                 dispatch({
//                     type: GET_ARTICLES_USERS,
//                     payload: response.data.results
//                 });
//                 console.log(response.data)
//                 dispatch(createMessage({ articleload: 'Article was successfully loaded' }));
//                 dispatch({
//                     type: STOP_LOADING
//                 })
//             }).catch(err => {
//                 dispatch(returnErrors(err.response.data, err.response.status))
//                 dispatch({
//                     type: STOP_LOADING
//                 })
//             })
//     } catch (err) {
//         dispatch(createMessage({ getAtError: 'unable to fetch data' }))
//         dispatch({
//             type: STOP_LOADING
//         })
//     }
// }

// export const fetchArticle = (id) => async dispatch => {
//     try{
//         dispatch({
//             type: LOADING
//         })
//     await axios.get(`${process.env.REACT_APP_API_URL}/article/api/article/user/1`)
//         .then(response => {
//             console.log(response)
//             dispatch({
//                 type: GET_ARTICLE_USERS,
//                 payload: response.data
//             })
//             dispatch(createMessage({ articleload: 'Article was successfully loaded' }));

//             dispatch({
//                 type: STOP_LOADING
//             })
//         }).catch(err => {
//             dispatch(returnErrors(err.response.data, err.response.status))
//             dispatch({
//                 type: STOP_LOADING
//             })
//         })
//     }catch(err){
//         dispatch(createMessage({ getAtError: 'unable to fetch article' }))
//         dispatch({
//             type: STOP_LOADING
//         }) 
//     }
// }