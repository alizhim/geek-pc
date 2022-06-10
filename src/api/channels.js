import request from 'utils/request'

export const getChannels = () => {
  return request.get('/channels')
}
