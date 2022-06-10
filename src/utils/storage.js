const Token_key = 'token_geek_pc'

export const setToken = (token) => localStorage.setItem(Token_key, token)

export const getToken = () => localStorage.getItem(Token_key)

export const removeToken = () => localStorage.removeItem(Token_key)

export const hasToken = () => !!getToken()