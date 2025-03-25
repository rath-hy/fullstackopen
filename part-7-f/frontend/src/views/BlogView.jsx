const BlogView = ({blog, handleVote}) => {
  const { title, url, likes, author } = blog
  return (
    <div>
      <h2>{title}</h2>
      <a href={url}>{url}</a>
      <div>{likes} likes
        <button
          style={{ marginLeft: 3 }}
          onClick={() => handleVote(blog)}
        >
          like
        </button>
      </div>

      <div>Added by {author}</div>
    </div>
  )
}

export default BlogView