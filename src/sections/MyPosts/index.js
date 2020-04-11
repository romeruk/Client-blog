import React from 'react'
import { Container, Row, Col, Card, Table } from 'react-bootstrap'
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { useQueryState } from 'react-router-use-location-state';
import { LoadingComponent, BootstrapPagination } from '../../lib';
import { TableBodyTr } from './components';

const GETPOSTS = gql`
  query findMyPosts($limit: Float!, $page: Float!) {
    findMyPosts(limit: $limit, page: $page) {
      total,
      posts {
        title,
        slug,
        isActive
      }
    }
  }
`

const REMOVEPOST = gql`
  mutation removeMyPost($title: String!) {
    removeMyPost(title: $title)
  }
`

const PAGE_LIMIT = 10;

export const MyPosts = () => {
  const [page, setPage] = useQueryState('page', 1);

  const { loading, error, data, refetch } = useQuery(GETPOSTS, {
    variables: {
      limit: PAGE_LIMIT,
      page: page
    },
    fetchPolicy: "cache-and-network"
  });

  const [removePostMutation, { loading: mutationLoading }] = useMutation(REMOVEPOST);

  if (loading || mutationLoading) return <LoadingComponent />
  if (error) return `Error! Cannot get posts`;

  const total = data.findMyPosts.total;
  const posts = data.findMyPosts.posts;

  const removePost = async (title) => {
    // eslint-disable-next-line no-restricted-globals
    const conf = confirm(`Are you sure?`);

    if (conf) {
      try {
        await removePostMutation({
          variables: {
            title
          }
        });

        refetch();
        toast("Post has been removed", {
          type: "success"
        });
      } catch (error) {
        toast(`Error! ${error.message}`, {
          type: "error"
        });
      }

    }
  }

  const renderTableData = () => {
    return posts.map((post) => {
      return <TableBodyTr onRemove={removePost} key={post.slug} post={post} />
    })
  }

  const pageChange = (page) => {
    setPage(page, {
      method: "push"
    })
  }


  return (
    <section>
      <Container>
        <Row>
          <Col md={12}>
            <Card className="mb-4">
              <Card.Header>MyPosts</Card.Header>
              <Card.Body>
                <Link className="btn btn-primary" to="/user/post/create">Create new post</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Table striped bordered responsive>
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>ACTIVE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {renderTableData()}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <BootstrapPagination total={total} limit={PAGE_LIMIT} onChange={((page) => pageChange(page))} maxPagestoShow={5} defaultActivePage={page} />
          </Col>
        </Row>
      </Container>
    </section>
  )
}

