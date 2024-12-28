import {signupApi} from "../api/signupApi";
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";
import {LOGIN_SIGNUP_FORM_TEXT} from "../utils/constants";

function Login() {
    const {setUser} = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        setLoading(true);
        setError(null);

        try {
            const response = await signupApi(e);
            setUser(response.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <h2>{LOGIN_SIGNUP_FORM_TEXT.LOGIN}</h2>
                <label>
                    {LOGIN_SIGNUP_FORM_TEXT.EMAIL}:
                    <input type="email" name="email"/>
                </label>
                <br/>
                <label>
                    {LOGIN_SIGNUP_FORM_TEXT.PASSWORD}:
                    <input type="password" name="password"/>
                </label>
                <br/>
                <button type="submit" disabled={loading}>
                    {loading ? LOGIN_SIGNUP_FORM_TEXT.LOADING : LOGIN_SIGNUP_FORM_TEXT.LOGIN}
                </button>
                {error && <p>{LOGIN_SIGNUP_FORM_TEXT.ERROR}: {error}</p>}
            </form>
            <p>
                {LOGIN_SIGNUP_FORM_TEXT.SIGN_UP_TEXT} <Link to="/signup">{LOGIN_SIGNUP_FORM_TEXT.SIGNUP}</Link>
            </p>
        </div>
    )
}

export default Login;