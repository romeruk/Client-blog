import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { useParams, Link } from "react-router-dom";
import { useForm, ErrorMessage } from 'react-hook-form';
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { LoadingComponent } from '../../lib';

const RESETPASSWORD = gql`
  mutation resetPasswordByToken($input: ResetPasswordInput!) {
    resetPasswordByToken(input: $input) {
      firstName
      lastName
    }
  }
`

export const ResetPasswordByToken = () => {
  let { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [restorePass, { data, loading: MutationLoading }] = useMutation(RESETPASSWORD);
  const { register, handleSubmit, errors, setError } = useForm({
    defaultValues: {
      passwordResetToken: token,
    }
  })

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || MutationLoading) return <LoadingComponent />

  const onSubmit = async (formData) => {
    try {
      await restorePass({
        variables: {
          input: {
            passwordResetToken: formData.passwordResetToken,
            password: formData.password
          }
        }
      })
    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  return (
    <section>
      <Container>
        {
          data && data.resetPasswordByToken && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <Alert variant="success">
                  Password succesfully restored <Link to="/signin">Log In</Link>
                </Alert>
              </Col>
            </Row>
          )
        }
        <Row className="justify-content-lg-center">
          <Col lg={6} sm={12}>
            <div className="well">
              <h2>Restore password</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>Token</Form.Label>
                  <Form.Control className="mb-2" type="text" name="passwordResetToken" ref={register({
                    required: "Field token is required"
                  })} disabled />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="passwordResetToken" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control className="mb-2" type="password" placeholder="Password" name="password" ref={register({
                    required: "Field password is required",
                    minLength: {
                      value: 6,
                      message: "Min length is 6"
                    }
                  })} autoComplete="true" />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="password" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Restore
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
