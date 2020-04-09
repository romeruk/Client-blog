import React from 'react'
import { useParams, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Row, Col, Form, Alert, Button, ButtonGroup, Container } from 'react-bootstrap';
import { useForm, ErrorMessage } from 'react-hook-form';
import { toast } from "react-toastify";

import { LoadingComponent } from '../../../lib';
import { GETBYSLUG, UPDATECATEGORY, REMOVECATEGORY, RECOVERCATEGORY } from './graphql';

export const EditCategory = () => {
  let { slug } = useParams();
  let history = useHistory();
  const { loading, error, data, refetch } = useQuery(GETBYSLUG, {
    variables: {
      slug
    },
  });

  const [updateCategory] = useMutation(UPDATECATEGORY);
  const [removeCategory] = useMutation(REMOVECATEGORY);
  const [recoverCategory] = useMutation(RECOVERCATEGORY);

  const { register, handleSubmit, errors, setError } = useForm();

  if (loading) return <LoadingComponent />
  if (error) return `Error! ${error.message}`;

  const category = data.findOneBySlugCategory;

  const onSubmit = async formData => {
    try {
      await updateCategory({
        variables: {
          input: {
            title: formData.title
          },
          title: category.title
        }
      })
      toast("Category succesfully updated", {
        type: "success"
      });
      history.push("/categories");
    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error"
      });
      if (error.graphQLErrors.length > 0)
        setError(error.graphQLErrors[0].extensions.exception.response.message);
    }
  }

  const removeOrUpdate = async (title, isActionRemove) => {
    const variables = {
      title
    }
    try {
      if (isActionRemove) {
        await removeCategory({
          variables
        })
        toast("Category has been removed", {
          type: "success"
        });
        refetch();
      }
      else {
        await recoverCategory({
          variables
        })
        toast("Category has been recovered", {
          type: "success"
        });
        refetch();
      }
    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error"
      });
    }
  }

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
                  defaultValue={category.title}
                  ref={register({
                    required: "Field first name is required", maxLength: {
                      value: 20,
                      message: "Max length is 20"
                    }
                  })} />

                <ErrorMessage as={<Alert variant="danger" className="pre-wrap" />} errors={errors} name="title" />

              </Form.Group>


              <ButtonGroup aria-label="Basic example">
                <Button variant="primary" type="submit">Edit</Button>
                <Button disabled={category.deletedAt === null} onClick={() => removeOrUpdate(category.title, false)} variant="success">Recover</Button>
                <Button disabled={category.deletedAt !== null} onClick={() => removeOrUpdate(category.title, true)} variant="danger">Remove</Button>
              </ButtonGroup>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
