import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import gql from "graphql-tag";
import { useQuery } from '@apollo/react-hooks';
import { LoadingComponent } from '../../lib';

const GETPOST = gql`
  query findOnePost ($slug: String!) {
    findOnePost (slug: $slug) {
      title
      content
    }
  }
`

export const ReadPost = () => {
  let { slug } = useParams();

  const { loading, error, data } = useQuery(GETPOST, {
    variables: {
      slug
    },
  });

  if (loading) return <LoadingComponent />
  if (error) return `Error loading post`;

  const post = data.findOnePost;

  return (
    <section>
      <Container>
        <Row>
          <Col>
            <div className="well">
              <h2 className="border-bottom text-justify p-2">{post.title}</h2>
              <div className="readpost" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
          </Col>
        </Row>

      </Container>
    </section>
  )
}


