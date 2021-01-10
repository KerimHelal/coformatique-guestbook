import React from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Alert from 'react-s-alert';
import { login, getCurrentUser } from '../methods/auth';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    }
  }));
  

const Login = (props) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        email: '',
        password: '',
      });

    React.useEffect(() => {
      if(getCurrentUser()) {
        props.history.push('/dashboard');
      } 
    }, []);

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        });
    }

    const onSubmit = e => { 
        e.preventDefault();
        login(state.email, state.password).then(
            () => { props.history.push('/dashboard'); },
            (error) => {
              const errorMessage =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              Alert.error(errorMessage);
            }
          );
    }

    return (
        <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <form className={classes.form} onSubmit={onSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Email Address"
              name="email" 
              onChange={handleChange}
              value={state.email}
              required
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              name="password"
              onChange={handleChange}
              value={state.password}
              type="password" 
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Link href="/register">
              Don't have an account? Sign Up
            </Link>
          </form>
        </div>
      </Container>
    );
}

export default Login;