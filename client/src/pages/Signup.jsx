import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import swal from 'sweetalert';

const SignUp = ({ history }) => {
	const [formData, setFormData] = useState(null);
	const { setCurrentUser } = useContext(AppContext);

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		axios
			.post('/api/users/', formData)
			.then((response) => {
				sessionStorage.setItem('user', response.data);
				setCurrentUser(response.data);
				history.push('/');
			})
			.catch((error) => swal('Error', 'Please check the inputs', 'warning'));
	};

	return (
		<Container className='container d-flex flex-column align-items-center justify-content-center fullscreen'>
			<h1 className='mb-4'>Task Manager!</h1>
			<Form style={{ width: 300 }} onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label htmlFor='fullName'>Full Name</Form.Label>
					<Form.Control
						id='fullName'
						type='text'
						placeholder='Full Name'
						name='name'
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label htmlFor='email'>Email Address</Form.Label>
					<Form.Control
						id='email'
						type='email'
						placeholder='Email Address'
						name='email'
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label htmlFor='password'>Password</Form.Label>
					<Form.Control
						id='password'
						type='password'
						placeholder='Password'
						name='password'
						onChange={handleChange}
					/>
				</Form.Group>
				<Form.Group className='d-flex justify-content-center'>
					<Button type='submit'>Create Account</Button>
				</Form.Group>
			</Form>
			<Link className='mt-4' to='/login'>
				Already have an account? Login.
			</Link>
		</Container>
	);
};

export default SignUp;
