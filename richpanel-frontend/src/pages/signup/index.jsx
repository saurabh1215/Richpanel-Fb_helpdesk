import React from "react";
import { Form, useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "../../components/Button";
import { InputText } from "../../components/inputText";
import './SignUp.css'
import { useNavigate } from "react-router-dom";



const initialValues = {
    name: "",
    email: "",
    password: "",
};

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string().required("Email is required.").email("Invalid email format."),
    password: Yup.string().required("Password is required."),
        
});


export default function SignUp() {

    const navigate = useNavigate()

    const  handleSubmit= async(values) => {
        const url = 'http://localhost:8000/user/register'
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
                console.log('user created')
                navigate('/')
            }
            else {
                throw new Error;
            }

        } catch(error) {
            console.log(error)
            throw error
        }
    }


    const signupForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            console.log(values)
            handleSubmit(values)
            
        },
    });


    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={signupForm.handleSubmit}>

            <div className="inside-form">
                    <div style={{margin: "0 auto",textAlign: "center" }}>
                        <h3>Create Account</h3>
                    </div>
                <div style={{margin: "0 auto"}}>
                    <div className="form-group">
                        
                        <label className="form-label" htmlFor="first_name">Name</label>
                        <InputText
                            className="form-input"
                            name="name"
                            id="name"
                            placeholder="Enter your name"
                            value={signupForm.values.name}
                            onBlur={signupForm.handleBlur}
                            onChange={signupForm.handleChange}
                            invalid={signupForm.touched.name && signupForm.errors.name ? true : false}
                            error={signupForm.touched.name && signupForm.errors.name ? signupForm.errors.name : ""}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <InputText
                            className="form-input"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            value={signupForm.values.email}
                            onBlur={signupForm.handleBlur}
                            onChange={signupForm.handleChange}
                            invalid={signupForm.touched.email && signupForm.errors.email ? true : false}
                            error={signupForm.touched.email && signupForm.errors.email ? signupForm.errors.email : ""}
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
                            value={signupForm.values.password}
                            onBlur={signupForm.handleBlur}
                            onChange={signupForm.handleChange}
                            invalid={signupForm.touched.password && signupForm.errors.password ? true : false}
                            error={signupForm.touched.password && signupForm.errors.password ? signupForm.errors.password : ""}
                        />
                    </div>

                    <div style={{width:'108%'}}>
                        <Button className="signup-button" type="submit" btnText="Signup" />
                    </div>
                </div>

                <div className="form-group" style={{ margin: "0 auto", textAlign: "center" }}>
                    {/* <p>Already Have an Account</p> */}
                    <p>Already Have an Account? <a href="#" onClick={() => navigate('/')}>Login Up</a></p>
                </div>
            </div>
            </form>

        </div>
    );
}