const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

// calculate number of likes 
const totalLikes = (blogs) => {
    //return total likes from the list
    return blogs.reduce((sum,blog) => sum + (blog.likes || 0), 0);
}

// choose blogs with most likes
const favoriteBlog = (blogs) => {
    //return a blog that has the most likes
    if(blogs.length === 0) return null;

    const favorite = blogs.reduce((favorite, blog) => {
        return (favorite.likes || 0) <blog.likes ? blog :favorite;
    })

    return {
        title: favorite.title,
        author: favorite.author,
        likes: favorite.likes
    }
}

// choose author who has the largest amount of blogs
const mostBlogs = (blogs) => {
    if(blogs.length === 0) return null;

    // group the blogs by author 
    const authorBlogs = _.countBy(blogs, 'author');
    
    // find author with most blogs
    const topAuthor = _.maxBy(Object.keys(authorBlogs), (author) => authorBlogs[author]);

    return {
        author:topAuthor,
        blogs: authorBlogs[topAuthor]
    }
}

// choose author with most likes in total
const mostLikes = (blogs) => {
    if(blogs.length === 0) return null;

    // group the blogs by author and sum the likes
    const likesByauthor = _(blogs)
      .groupBy('author')
      .map((authorBlogs, author) => (
        {
            author:author,
            likes:_.sumBy(authorBlogs,'likes'),
        }
      ))
      .value();

    // find with most likes
    return _.maxBy(likesByauthor, 'likes')

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes }