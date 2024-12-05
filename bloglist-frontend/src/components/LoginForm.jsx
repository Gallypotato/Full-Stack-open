import { TextField, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchBlogs, setToken } from '../redux/blogSlice';
import { login, setUser } from "../redux/userSlice";
import { notify} from "../redux/notificationSlice"; 



const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
          const user = await dispatch(login({ username, password })).unwrap();
          dispatch(setToken(user.token));
          dispatch(setUser(user));
          dispatch(fetchBlogs())
          dispatch(notify("Logged in successfully", "notice"))
        } catch (exception) {
            dispatch(notify("Wrong username or password", "error"))
        }
      };

    return (
      <form onSubmit={handleLogin}>
        <div>
          <TextField 
            label="username"
            type="text"
            value={username}
            variant="outlined"
            size="small"
            onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          <TextField 
            label="password"
            type="password"
            size="small"
            value={password}
            onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <div style={{ marginTop: "16px" }}>
        <Button variant="contained" color="primary" type="submit" size="small">
            login
        </Button>
        </div>
      </form>
    )
    
}

export default LoginForm;

