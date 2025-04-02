import axios from 'axios'
import storage from './storage'

const baseUrl = '/api/blogs'

const getConfit = () => ({
  headers : { Authorization: `Bearer ${storage.loadUser().token}` }
})

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject, getConfit())
  return response.data
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject, getConfit())
  return response.data
}

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`, getConfit())
  return response.data
}

const getComments = (id) => {
  const response = axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}

const comment = async (id, comment) => {
  const allObjects = await getAll()
  const specificObject = allObjects.find(object => object.id === id)
  const updatedObject = {
    ...specificObject,
    comments: specificObject.comments.concat(comment)
  }
  console.log('updated object', updatedObject)
  return await update(id, updatedObject)
}

export default { getAll, create, update, remove, comment, getComments }