import React, { useState } from "react";
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap'
import { useForm, ErrorMessage, Controller } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";
import BraftEditor from 'braft-editor'
import { LoadingComponent } from "../../lib";

const GETALLCATEGORIES = gql`
  query getAllCategories {
    getAllCategories {
      title
    }
  }
`

const CREATEPOST = gql`
  mutation createPost($input: CreatePostInput!) {
    createPost(input: $input) {
      title
    }
  }

`


export const CreatePost = () => {
  const [value] = useState(BraftEditor.createEditorState('<p>Hello <b>World!</b></p>'));
  const { register, handleSubmit, errors, setError, control } = useForm();
  const { loading, error, data } = useQuery(GETALLCATEGORIES, {
    fetchPolicy: "cache-and-network"
  });
  const [createPost, { data: mutationData, loading: mutationLoading }] = useMutation(CREATEPOST);


  if (loading || mutationLoading) return <LoadingComponent />
  if (error) return `Error! ${error.message}`;


  const onSubmit = async (formData) => {
    try {
      await createPost({
        variables: {
          input: {
            title: formData.title,
            content: formData.content.toHTML(),
            categories: formData.categories
          }
        }
      })
    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  const categories = data.getAllCategories;

  return (
    <section>
      <Container>
        {
          mutationData && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <Alert variant="success">
                  Post succesfully created
                </Alert>
              </Col>
            </Row>
          )
        }
        <Row className="justify-content-lg-center">
          <Col lg={12} sm={12}>
            <div className="well">
              <h2>Create Post</h2>
              <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control className="mb-2" type="text" placeholder="title" name="title" ref={register({
                    required: "Field title is required", minLength: {
                      value: 5,
                      message: "Min length is 5"
                    }
                  })} />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="title" />
                </Form.Group>

                <Form.Group controlId="ControlSelect">
                  <Form.Label>Select categories</Form.Label>
                  <Form.Control className="mb-2" ref={register({
                    required: "Select at least 1 category"
                  })}
                    name="categories" as="select" multiple>

                    {categories.map((category) =>
                      <option key={category.title} value={category.title}>
                        {category.title}
                      </option>
                    )}

                  </Form.Control>

                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="categories" />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Content</Form.Label>
                  <Controller as={
                    <BraftEditor
                      language="en"
                    />
                  }
                    defaultValue={value}
                    control={control}
                    name="content"
                    rules={{
                      required: "Field content is required",
                    }}
                  />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="content" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Create Post
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section >
  )
}

