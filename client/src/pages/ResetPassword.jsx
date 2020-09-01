import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    axios
      .get(`/api/password?email=${email}`)
      .then((res) => {
        console.log(res);
        form.reset();
      })
      .catch((error) => console.log(error));
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center fullscreen">
      <h1>Reset Password</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Button type="submit">Send Email</Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default ResetPassword;
