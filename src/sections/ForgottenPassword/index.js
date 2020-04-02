import React, { useEffect } from 'react'
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import { ErrorMessage, useForm } from 'react-hook-form';
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useState } from 'react';
import { LoadingComponent } from '../../lib';

const RESTOREPASSWORD = gql`
  mutation setPasswordResetToken($email: String!) {
    setPasswordResetToken(email: $email){
      firstName
      lastName
    }
  }
`
export const ForgottenPassword = () => {
  const [loading, setLoading] = useState(true);
  const [resetPassword, { data, loading: mutationLoading }] = useMutation(RESTOREPASSWORD);
  const { register, handleSubmit, errors, setError } = useForm()

  const onSubmit = async formData => {
    try {
      await resetPassword({
        variables: {
          email: formData.email
        }
      })
    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  useEffect(() => {
    setLoading(false);
  }, [])

  if (loading || mutationLoading) return <LoadingComponent />

  return (
    <section>
      <Container>
        {
          data && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <Alert variant="success">
                  Reset password token has been sent to your email
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
                  <Form.Label>Email address</Form.Label>
                  <Form.Control className="mb-2" type="email" placeholder="Enter email" name="email" ref={register({
                    required: "Field email is required", pattern: {
                      value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: "Field must be email"
                    }
                  })} />

                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="email" />
                </Form.Group>


                <Button variant="primary" type="submit">
                  Restore Password
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
