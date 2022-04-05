import { GET_ARTICLES, GET_ARTICLE, DELETE_ARTICLE, EDIT_ARTICLE, GET_ARTICLE_USERS, GET_ARTICLES_USERS } from '../actions/articleTypes'

const initialState = {
    articles: [],
};

export const articleReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ARTICLES:
            return {
                ...state,
                articles: action.payload
            }

        case EDIT_ARTICLE:
            const updateArticle = action.payload

            const updateArticles = state.articles.map(article => {
                if (article.id === updateArticle.id) {
                    return updateArticle
                }
                return article
            });

            return {
                article: updateArticles
            }
        case DELETE_ARTICLE:
            return {
                ...state,
                articles: state.articles.filter(article => article.id !== action.payload)
            };
        case GET_ARTICLE:
            const gottenArticle = action.payload

            state.articles.map(article => {
                if (article.id === gottenArticle.id) {
                    return gottenArticle
                }
                return article
            })
            return {

            }
        default: return state
    }
}
const initialStateUser = {
    articleList: [],
    selectedArticle: {}
}
export const articleUserReducer = (state = initialStateUser, action) => {
    switch (action.type) {
        case GET_ARTICLES_USERS:
            return {
                ...state,
                articleList: action.payload
            }
        case GET_ARTICLE_USERS:
            // const gottenArticle = action.payload

            // state.articles.map(article => {
            //     if (article.id === gottenArticle.id) {
            //         return gottenArticle
            //     }
            //     return article
            // })
            return {
                ...state,
                selectedArticle: action.payload
            }
        default: return state
    }
}