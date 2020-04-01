import React, { useContext, useState, useEffect } from 'react'
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap'
import { useForm, ErrorMessage } from 'react-hook-form';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { toast } from "react-toastify";
import { AuthContext } from '../../AuthContext/authContext';
import { LoadingComponent } from '../../lib';


const UPDATEME = gql`

  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      firstName
      lastName
    }
  }
`;

export const EditMe = () => {
  const { user, refetch, setAppLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [updateUser, { loading: mutationLoading }] = useMutation(UPDATEME);

  const { register, handleSubmit, errors, setError } = useForm({
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName
    }
  })

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || mutationLoading) return <LoadingComponent />


  const onSubmit = async (formData) => {
    try {
      await updateUser({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: !formData.password || formData.password.length === 0 ? null : formData.password
          }
        }
      });

      toast("User has been updated", {
        type: "success"
      });
      setAppLoading(true);
      refetch();
    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  return (
    <section>
      <Container>
        <Row className="justify-content-lg-center">
          <Col lg={6} sm={12}>
            <div className="well">
              <h2>Edit me</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                  <Form.Label>First Name</Form.Label>
                  <Form.Control className="mb-2" type="text" placeholder="first name" name="firstName" ref={register({
                    required: "Field first name is required", minLength: {
                      value: 3,
                      message: "Min length is 3"
                    }
                  })} />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="firstName" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control className="mb-2" type="text" placeholder="first name" name="lastName" ref={register({
                    required: "Field last name is required", minLength: {
                      value: 3,
                      message: "Min length is 3"
                    }
                  })} />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="lastName" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control className="mb-2" type="password" placeholder="Password" name="password" ref={register({
                    minLength: {
                      value: 6,
                      message: "Min length is 6"
                    }
                  })} />
                  <small>password is optional field</small>
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="password" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Edit me
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

  )
}
