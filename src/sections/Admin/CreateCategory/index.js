import React, { useState, useEffect } from 'react'
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Row, Col, Form, Alert, Button, Container } from "react-bootstrap";
import { useForm, ErrorMessage } from 'react-hook-form';
import { toast } from "react-toastify";
import { LoadingComponent } from '../../../lib';

export const CREATECATEGORY = gql`
  mutation createCategory($input: CategoryCreateInput!) {
    createCategory(input: $input) {
      title
    }
  }
`;

export const CreateCategory = () => {
  const [loading, setLoading] = useState(true);

  const [createCategory] = useMutation(CREATECATEGORY);
  const { register, handleSubmit, errors, setError } = useForm();

  const onSubmit = async (formData) => {
    try {
      await createCategory({
        variables: {
          input: {
            title: formData.title
          }
        }
      });
      toast("Category succesfully created", {
        type: "success"
      });
    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <LoadingComponent />

  return (
    <section>
      <Container>
        <Row>
          <Col md={12}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Form.Label>Category Title</Form.Label>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Enter category title"
                  name="title"
                  ref={register({
                    required: "Field first name is required", maxLength: {
                      value: 20,
                      message: "Max length is 20"
                    }
                  })} />

                <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="title" />

              </Form.Group>


              <Button variant="primary" type="submit">Create Category</Button>

            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  )
}