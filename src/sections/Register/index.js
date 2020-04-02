import React, { useContext } from 'react'
import { Form, Button, Row, Col, Alert, Container } from 'react-bootstrap';
import { useForm, ErrorMessage } from 'react-hook-form';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { LoadingComponent } from '../../lib';
import { AuthContext } from '../../AuthContext/authContext';
import { useEffect } from 'react';

const REGISTER = gql`
  mutation register($credentials: CreateUserInput!) {
    register(credentials: $credentials) {
      firstName
      lastName
      email
      role
      verified
    }
  }
`;

export const Register = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [registerMe, { data, loading: mutationLoading }] = useMutation(REGISTER);
  const { register, handleSubmit, errors, setError } = useForm()


  const onSubmit = async formData => {
    try {
      await registerMe({
        variables: {
          credentials: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password
          }
        }
      })

    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  useEffect(() => setLoading(false), []);

  if (loading || mutationLoading) return <LoadingComponent />
  if (user) return <Redirect to="/" />

  return (
    <section>
      <Container>
        {
          data && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <Alert variant="success">
                  User {data.register.firstName} {data.register.lastName} has been successfully registered <br />
                Verify your account with token that was sended in your email address
              </Alert>
              </Col>
            </Row>
          )
        }
        <Row className="justify-content-lg-center">
          <Col lg={6} sm={12}>
            <div className="well">
              <h2>Register</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    className="mb-2"
                    type="text"
                    placeholder="Enter first name"
                    name="firstName"
                    ref={register({
                      required: "Field first name is required", maxLength: {
                        value: 20,
                        message: "Max length is 20"
                      }
                    })} />

                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="firstName" />

                </Form.Group>

                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control className="mb-2" type="text" placeholder="Enter last name" name="lastName" ref={register({
                    required: "Field last name is required", maxLength: {
                      value: 20,
                      message: "Max length is 20"
                    }
                  })} />

                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="lastName" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Email address</Form.Label>
                  <Form.Control className="mb-2" type="email" placeholder="Enter email" name="email" ref={register({
                    required: "Field email is required", pattern: {
                      value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Field must be email"
                    }
                  })} />

                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="email" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control className="mb-2" type="password" placeholder="Password" name="password" ref={register({
                    required: "Field password is required", minLength: {
                      value: 6,
                      message: "Min length is 6"
                    }
                  })} />

                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="password" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Submit
                 </Button>
              </Form>
            </div>
          </Col>
        </Row>

      </Container>
    </section>
  )
}