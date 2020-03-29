import React, { useContext } from 'react'
import { Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { useForm, ErrorMessage } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Redirect } from 'react-router-dom';
import { LoadingComponent } from '../../lib';
import { AuthContext } from '../../AuthContext/authContext';


const LOGIN = gql`
  mutation logIn($credentials: UserLogInInput!) {
    logIn(credentials: $credentials) {
      firstName
      lastName
      email
      role
      verified
    }
  }
`;

export const LogIn = () => {
  const { user, setUser } = useContext(AuthContext);
  const { register, handleSubmit, errors, setError } = useForm()
  const [login, { loading: mutationLoading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      setUser(data.logIn)
    }
  });

  const onSubmit = async formData => {
    try {
      await login({
        variables: {
          credentials: {
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

  if (mutationLoading) return <LoadingComponent />
  if (user) return <Redirect to="/" />


  return (
    <Row>
      <Col md={12}>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
            Log In
          </Button>
        </Form>
      </Col>
    </Row>
  )
}
