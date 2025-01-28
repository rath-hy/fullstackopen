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

module.exports = {
    dummy,
    totalLikes
}