import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import Loading from '../../components/Loading/Loading';
import MainScreen from '../../components/MainScreen/MainScreen'
import "./LoginScreen.css";

const LoginScreen = ({history}) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const config = {
                headers: {
                    "Content-type": "application/json"
                }
            }

            setLoading(true);
            const { data } = await axios.post(
                'http://localhost:5000/api/users/login',
                {
                    email,
                    password,
                },
                config
            );
            console.log(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
        } catch (error) {
            console.log(error.response.data);
            setError(error.response.data);
            setLoading(false);
        }
    }

    return (
        <MainScreen title="LOGIN">
            <div className="loginContainer">
                {error && <ErrorMessage variant="danger"> {error}</ErrorMessage>}
                {loading && <Loading />}
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            placeholder="Enter email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Row className="py-3">
                        Nou usuari? &nbsp; <Link to="/register"> Enregistra't! </Link>
                    </Row>
                </Form>
            </div>
        </MainScreen>
    )
}

export default LoginScreen
