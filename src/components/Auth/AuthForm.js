import { useState, useRef, useContext } from 'react';
import classes from "./AuthForm.module.css";
import AuthContext from '../../store/auth-context';
const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);
    let url;

    if (isLogin) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCmtOyn5fQSxFFUbd0tmXfIFS-iEZgh6T0";
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key= AIzaSyCmtOyn5fQSxFFUbd0tmXfIFS-iEZgh6T0";
    }

  
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      
      setIsLoading(false);
      if (response.ok) {
        const data = await response.json();
        authCtx.login(data.idToken);
      } else {
        const errorData = await response.json();
        let errorMessage = 'Authentication failed!';
         if (errorData && errorData.error && errorData.error.message) {
           errorMessage = errorData.error.message;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? 'Login' : 'Create Account'}</button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;