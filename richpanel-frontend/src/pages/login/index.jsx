import React from "react";
import { Form, useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../components/Button";
import { InputText } from "../../components/inputText";
import './Login.css';
import { useNavigate } from "react-router-dom";

const initialValues = {
    email: "",
    password: "",
};

const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required.").email("Invalid email format."),
    password: Yup.string().required("Password is required."),
});

export default function Login() {

    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        // Your existing code for handling form submission

        const url = 'http://localhost:8000/user/login'
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(values), 
        };
        try {


            const response = await fetch(url,request)

            if(response.ok) {
                const { token } = await response.json();
                window.localStorage.setItem('auth-token', token);
                // console.log(token);
                navigate('/face');
                console.log('User logged in');
            }
            else {
                throw new Error('request Failed');
            }

        } catch(error) {
            console.log(error)
            throw error
        }
    };

    const LoginForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log(values);
            handleSubmit(values);
        },
    });

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={LoginForm.handleSubmit}>
                <div className="form-group">
                    <div>
                        <h2>Login to Your Account</h2>
                    </div>

                    <div style={{ margin: "0 auto", width: "80%", marginLeft: '30px', marginRight: '45px'}}>
                        <div>
                            <label className="form-label" htmlFor="email">Email</label>
                            <InputText
                                className="form-input"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                value={LoginForm.values.email}
                                onBlur={LoginForm.handleBlur}
                                onChange={LoginForm.handleChange}
                                invalid={LoginForm.touched.email && LoginForm.errors.email ? true : false}
                                error={LoginForm.touched.email && LoginForm.errors.email ? LoginForm.errors.email : ""}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <InputText
                                className="form-input"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                type="password"
                                value={LoginForm.values.password}
                                onBlur={LoginForm.handleBlur}
                                onChange={LoginForm.handleChange}
                                invalid={LoginForm.touched.password && LoginForm.errors.password ? true : false}
                                error={LoginForm.touched.password && LoginForm.errors.password ? LoginForm.errors.password : ""}
                            />
                        </div>

                        <div style={{width:'107%'}}>
                            <Button className="login-button" type="submit" btnText="Login" />
                        </div>
                    </div>

                    <div className="inside-form" style={{ textAlign: "center" }}>
                        <p>New to MyApp? <a href="#" onClick={() => navigate('/signup')}>Sign Up</a></p>

                        {/* <button onClick={()=>navigate('/signup')}>SignUp</button> */}
                    </div>
                </div>
            </form>
        </div>
    );
}
