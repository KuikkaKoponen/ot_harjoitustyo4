/// MUOKKAA siten että blogit näkyvät vain kirjautuneille ja vain omat näkyvät jne.

import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [newBlogLikes, setNewBlogLikes] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null) 
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const Notification = ({ message }) => {
    if (message === null) {
      return null
    } 
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogOut = async () => {
    try {
      window.localStorage.removeItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      window.location.reload(false); 
    } catch (exception) {
      setErrorMessage('logout failed')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = () => (
    <div>
    <button onClick={handleLogOut}>Log out</button>
    <h2>Add blog</h2>
    <form onSubmit={addBlog}>
     Author
      <input
        value={newBlogTitle}
        onChange={handleBlogTitleChange}
      /> <br></br>
      Title
      <input
        value={newBlogAuthor}
        onChange={handleBlogAuthorChange}
      /> <br></br>
      Url
      <input
        value={newBlogUrl}
        onChange={handleBlogUrlChange}
      /> <br></br>
      Likes 
      <input
        value={newBlogLikes}
        onChange={handleBlogLikesChange}
      /> <br></br>
      <button type="submit">save</button>
    </form>
    </div>  
  )

  const addBlog = (event) => {
    event.preventDefault()
    const noteObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
      likes: newBlogLikes,
    }
  
    blogService
      .create(noteObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlogTitle('')
        setNewBlogAuthor('')
        setNewBlogUrl('')
        setNewBlogLikes('')
      })
  }

  const handleBlogTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleBlogAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleBlogUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  const handleBlogLikesChange = (event) => {
    setNewBlogLikes(event.target.value)
  }


  return (
    <div>
      <Notification message={errorMessage} />
      <h2>Login</h2>
      {user === null ?
      loginForm() :
      <div>
        <p>{user.name} logged in</p>
        {blogForm()}
      </div>
    }
  
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App