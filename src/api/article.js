import request from 'utils/request'

export const getArticles = (params) => {
  return request({
    method: 'GET',
    url: '/mp/articles',
    params
  })
}

export const delArticles = (id) => {
  return request.delete(`/mp/articles/${id}`)
}

export const addArticle = (data, draft=false) => {
  return request.post(`/mp/articles?draft=${draft}`, data)
}

export const getArticleById = (id) => {
  return request.get(`/mp/articles/${id}`)
}