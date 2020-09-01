import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const UpdatePassword = ({ history }) => {
	const [password, setPassword] = useState(null);

	const handleChange = (event) => {
		setPassword({ ...password, [event.target.name]: event.target.value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (password.password !== password.confirmPassword) {
			alert('Passwords must match!');
			return;
		}
		axios
			.put(
				'/api/password',
				{ password: password.password },
				{ withCredentials: true }
			)
			.then((res) => {
				//add alert
				history.push('/login');
			})
			.catch((error) => console.log(error));
	};
	return (
		<Container className='d-flex flex-column align-items-center justify-content-center fullscreen'>
			<h1>Update Password</h1>
			<Form onSubmit={handleSubmit}>
				<Form.Group>
					<Form.Label>New Password</Form.Label>
					<Form.Control
						type='password'
						onChange={handleChange}
						name='password'
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>Confirm Password</Form.Label>
					<Form.Control
						type='password'
						onChange={handleChange}
						name='confirmPassword'
					/>
				</Form.Group>
				<Form.Group>
					<Button type='submit'>Update Password</Button>
				</Form.Group>
			</Form>
		</Container>
	);
};

export default UpdatePassword;
