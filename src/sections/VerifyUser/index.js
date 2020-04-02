import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap';
import { useParams, Link } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { useForm, ErrorMessage } from 'react-hook-form';
import { LoadingComponent } from '../../lib';

const VERIFY = gql`
  mutation verifyUser($token: String!) {
    verifyUser(token: $token) {
      firstName
      lastName
    }
  }
`

const REFRESHTOKEN = gql`
  mutation refreshVerificationToken($email: String!) {
    refreshVerificationToken(email: $email)
  }
`

export const VerifyUser = () => {
  let { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verify, { data }] = useMutation(VERIFY);
  const [refreshToken, { data: refreshData, loading: refreshLoading }] = useMutation(REFRESHTOKEN);

  const { register, handleSubmit, errors, setError } = useForm();

  useEffect(() => {
    (async function verifyUser() {
      try {
        await verify({
          variables: {
            token
          }
        });
        setLoading(false);
      } catch (error) {
        if (error.graphQLErrors.length > 0)
          setError(error.graphQLErrors[0].extensions.exception.response.message);
        setLoading(false);
      }
    })();
  }, [token, verify, setError]);

  if (loading || refreshLoading) return <LoadingComponent />

  const onSubmit = async (formData) => {
    try {
      await refreshToken({
        variables: {
          email: formData.email
        }
      });
    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }
  return (
    <section>
      <Container>
        {
          data && data.verifyUser && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <Alert variant="success">
                  User succesfully verified <Link to="/signin">Log In</Link>
                </Alert>
              </Col>
            </Row>
          )
        }
        {
          data && data.verifyUser === null && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <div className="well">
                  <h2>Invalid token</h2>
                  <Link to="/signin">Log In</Link>
                </div>
              </Col>
            </Row>
          )
        }
        {
          refreshData && refreshData.refreshVerificationToken && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <Alert variant="success">
                  Token succesfully restored. Check out your email
                </Alert>
              </Col>
            </Row>
          )
        }
        {
          errors && (errors.token || errors.email) && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <div className="well">
                  <h2>Reset Verification Token</h2>
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group>
                      <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="token" />
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

                    <Button variant="primary" type="submit">
                      Reset
                    </Button>
                  </Form>
                </div>
              </Col>
            </Row>
          )
        }
      </Container>
    </section>
  )
}
