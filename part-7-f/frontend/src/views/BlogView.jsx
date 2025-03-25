const BlogView = ({blog}) => {
  const { title, url, likes, author } = blog
  return (
    <div>
      <h2>{title}</h2>
      <a href={url}>{url}</a>
      <div>{likes} likes</div>
      <div>Added by {author}</div>
    </div>
  )
}

export default BlogView