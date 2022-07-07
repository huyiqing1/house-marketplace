import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignIn = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { email, password } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                navigate("/");
            }
        } catch (error) {
            toast.error("Email address and password not match! Please try again!")
        }
    }

    return (
        <div className="sign-in pageContainer">
            <header>
                <p className="pageHeader">Welcome Back!</p>
            </header>
            <form onSubmit={onSubmit}>
                <input type="email" className="emailInput" placeholder="Email" id="email" value={email} onChange={onChange} />
                <div className="passwordInputDiv">
                    <input type={showPassword ? "text" : "password"} className="passwordInput" placeholder="Password" id="password" value={password} onChange={onChange} />
                    <img src={visibilityIcon} alt="showPassword" className="showPassword" onClick={() => setShowPassword((prevState) => !prevState)} />
                </div>
                <Link to="/forgot-password" className="forgotPasswordLink">Forgot Password?</Link>
                <div className="signInBar">
                    <p className="signInText">
                        Sign in
                    </p>
                    <button className="signInButton">
                        <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
                    </button>
                </div>
            </form>

            <Link to="/sign-up" className="registerLink">Don't have an account? Sign up now!</Link>
        </div>
    );
}

export default SignIn;