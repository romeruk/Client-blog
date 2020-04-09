import React, { useState } from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap'
import gql from 'graphql-tag';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import { useUrlQuery } from '../../../hooks/';
import { LoadingComponent, BootstrapPagination } from '../../../lib';
import { TableBodyTr, PreviewModal } from './components';

const GETPOSTS = gql`
  query getAllPosts($limit: Float!, $page: Float!) {
    getAllPosts(limit: $limit, page: $page) {
      total
      posts {
        title
        slug
        content
        isActive
      }
    }
  }
`;

const REMOVEPOST = gql`
  mutation removeMyPost($title: String!) {
    removeMyPost(title: $title)
  }
`

const PAGE_LIMIT = 10;

export const Posts = () => {
  const [showModal, setShowModal] = useState(false);
  const [currPost, setCurrPost] = useState({});
  const [removePostMutation, { loading: mutationLoading }] = useMutation(REMOVEPOST);
  let history = useHistory();
  let query = useUrlQuery();
  const page = parseInt(query.get("page"), 10) || 1;
  const { loading, error, data, refetch } = useQuery(GETPOSTS, {
    variables: {
      limit: PAGE_LIMIT,
      page: page
    },
    fetchPolicy: "cache-and-network"
  });

  if (loading || mutationLoading) return <LoadingComponent />
  if (error) return `Error! ${error.message}`;

  const total = data.getAllPosts.total;
  const posts = data.getAllPosts.posts;

  const pageChange = (page) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('page', page);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
  }

  const handleCloseOpenModal = () => {
    setShowModal(currentValue => !currentValue);
  }

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
      return <TableBodyTr
        key={post.slug}
        post={post}
        removeByAdmin={removePost}
        handleCloseOpenModal={handleCloseOpenModal}
        setCurrPost={setCurrPost} />
    })
  }

  return (
    <section>
      <Container>
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
      <PreviewModal refetch={refetch} showModal={showModal} handleCloseOpenModal={handleCloseOpenModal} post={currPost} />
    </section>
  )
}
