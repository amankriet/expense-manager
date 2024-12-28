import {signupApi} from "../api/signupApi";
import {Link} from "react-router-dom";
import {useContext, useState} from "react";
import {UserContext} from "../context/UserContext";

function SignUp() {
    const {setUser} = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async (e) => {
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
            <form onSubmit={handleSignup}>
                <h2>Sign Up</h2>
                <label>
                    First Name:
                    <input type="text" name="firstName"/>
                </label>
                <br/>
                <label>
                    Last Name:
                    <input type="text" name="lastName"/>
                </label>
                <br/>
                <label>
                    Email:
                    <input type="email" name="email"/>
                </label>
                <br/>
                <label>
                    Password:
                    <input type="password" name="password"/>
                </label>
                <br/>
                <label>
                    Mobile:
                    <input type="number" name="mobile"/>
                </label>
                <br/>
                <label>
                    DOB:
                    <input type="date" name="dob"/>
                </label>
                <br/>
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                {error && <p>Error: {error}</p>}
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    )
}

export default SignUp;