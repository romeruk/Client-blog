import React from 'react'
import { Container, Row, Col, Form, Alert, Button } from 'react-bootstrap'
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useForm, ErrorMessage, Controller } from "react-hook-form";
import BraftEditor from 'braft-editor'

import { LoadingComponent } from '../../lib';
import { excludeControls } from '../../utils/editorOptions';

const GETPOST = gql`
  query findOneBySlug($slug: String!) {
    findOneBySlug(slug: $slug) {
      title,
      content,
      categories {
        title
      },
      allCategories {
        title
      }
    }
  }
`

const EDITPOST = gql`
  mutation editPost($input: EditPostInput!){
    editPost(input: $input) {
      title
    }
  }
`

export const EditMyPost = () => {
  let { slug } = useParams();
  const { register, handleSubmit, errors, setError, control } = useForm();
  const [editPost, { loading: mutationLoading, data: mutationData }] = useMutation(EDITPOST);
  const { loading, error, data, refetch } = useQuery(GETPOST, {
    variables: {
      slug
    },
    fetchPolicy: "cache-and-network"
  });

  if (loading || mutationLoading) return <LoadingComponent />
  if (error) return "Error! Cannot get post";

  const postCategories = data.findOneBySlug.categories;

  const selectedCategoris = () => {
    return postCategories.map(category => category.title);
  }

  const onSubmit = async (formData) => {
    try {
      await editPost({
        variables: {
          input: {
            title: formData.title,
            content: formData.content.toHTML(),
            categories: formData.categories
          }
        }
      })

      refetch();
    } catch (error) {
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  return (
    <section>
      <Container>
        {
          mutationData && (
            <Row className="justify-content-lg-center">
              <Col lg={6} sm={12}>
                <Alert variant="success">
                  Post succesfully updated
                </Alert>
              </Col>
            </Row>
          )
        }
        <Row className="justify-content-lg-center">
          <Col lg={12} sm={12}>
            <div className="well">
              <h2>Edit Post</h2>
              <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control defaultValue={data.findOneBySlug.title} className="mb-2" type="text" placeholder="title" name="title" ref={register({
                    required: "Field title is required", minLength: {
                      value: 5,
                      message: "Min length is 5"
                    }
                  })} disabled />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="title" />
                </Form.Group>

                <Form.Group controlId="ControlSelect">
                  <Form.Label>Select categories</Form.Label>
                  <Form.Control className="mb-2" ref={register({
                    required: "Select at least 1 category"
                  })}
                    name="categories" as="select" multiple defaultValue={selectedCategoris()}>

                    {data.findOneBySlug.allCategories.map((category) =>
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
                      excludeControls={excludeControls}
                      language="en"
                    />
                  }
                    defaultValue={BraftEditor.createEditorState(data.findOneBySlug.content)}
                    control={control}
                    name="content"
                    rules={{
                      required: "Field content is required",
                    }}
                  />
                  <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="content" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Edit Post
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
