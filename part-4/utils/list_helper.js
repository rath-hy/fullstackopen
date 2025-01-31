const _ = require('lodash')

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (listOfBlogs) => {
    if (listOfBlogs.length === 0) {
        return 0;
    }

    if (listOfBlogs.length === 1) {
        return listOfBlogs[0].likes
    }

    const sum = listOfBlogs.reduce((total, blog) => total + blog.likes, 0)
    return sum;
}

const favoriteBlog = (listOfBlogs) => {
    if (listOfBlogs.length === 0) { return null; }
    const favorite = listOfBlogs.reduce((bestBlog, currentBlog) => 
        currentBlog.likes > bestBlog.likes ? currentBlog : bestBlog)
    return favorite
}

const mostBlog = (listOfBlogs) => {
    const sortedByAuthor = _.groupBy(listOfBlogs, 'author')
    const authorsAndBlogCount = _.map(sortedByAuthor, (blog, author) => ({
        author,
        blogs: blog.length
    }))
    const mostBlogs = _.maxBy(authorsAndBlogCount, blog => blog.blogs)
    return mostBlogs;
}
const mostLikes = (listOfBlogs) => {
    const hasMostLikes = _.maxBy(listOfBlogs, blog => blog.likes)
    const formattedResponse = {author: hasMostLikes.author, likes: hasMostLikes.likes}
    return formattedResponse
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlog,
    mostLikes
}