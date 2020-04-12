import React, { useRef, useState } from 'react'
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import { useQuery } from "@apollo/react-hooks";
import { Filter } from 'react-bootstrap-icons';
import gql from 'graphql-tag';
import Truncate from 'react-truncate-html';
import { useQueryState } from 'react-router-use-location-state'
import { LoadingComponent, BootstrapPagination } from '../../lib';
import { FilterBar } from './components';
import imageReplacer from '../../utils/imageReplacer';
import { Link } from 'react-router-dom';

const GETPOSTS = gql`
  query getAllPosts($limit: Float!, $page: Float!, $categories: [String!]) {
    getAllPosts(limit: $limit, page: $page, categories: $categories) {
      total
      posts {
        title
        slug
        content
        images {
          url
        }
      }
    }
  }
`;

const PAGE_LIMIT = 10;


export const Home = () => {
  const [page, setPage] = useQueryState('page', 1);
  const [categories, setCategories] = useQueryState('categories', []);

  const { loading, error, data } = useQuery(GETPOSTS, {
    variables: {
      d: categories.length,
      limit: PAGE_LIMIT,
      page,
      categories
    },
    fetchPolicy: "cache-and-network"
  });

  const [activeSidebar, setActiveSidebar] = useState(false);
  const sidebar = useRef(null);


  if (loading) return <LoadingComponent />
  if (error) return `Error loading posts`;

  const total = data.getAllPosts.total;
  const posts = data.getAllPosts.posts;

  const handleSideBar = () => {
    setActiveSidebar(state => !state);
  }

  const pageChange = (page) => {
    setPage(page);
  };

  const handleCategories = (category) => {
    const index = categories.indexOf(category);

    if (index > -1) {
      categories.splice(index, 1);
    }
    else {
      categories.push(category);
    }

    setPage(1);
    setCategories(categories);
  }

  return (
    <>
      <FilterBar
        ref={sidebar}
        activeSidebar={activeSidebar}
        handleSideBar={handleSideBar}
        activeCategories={categories}
        handleCategories={handleCategories}
      />
      <section>
        <Container>
          <Row>
            <Col sm={12}>
              <div className="d-flex justify-content-end">
                <Button onClick={handleSideBar}>
                  <Filter size={25} />
                </Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }} >
              {posts.length < 1 && (
                <Alert variant="info">
                  Cannot found posts
                </Alert>
              )}
              {
                posts.map((post) => (

                  <div key={post.title} className="post mb-5">
                    <div className="text-center">
                      <img className="img-fluid mb-3" src={post.images[0].url} alt="" />
                    </div>
                    <h1 className="font-weight-bold">{post.title}</h1>
                    <Truncate
                      className="readpost text-justify"
                      lines={5}
                      breakWord={true}
                      dangerouslySetInnerHTML={{
                        __html: imageReplacer(post.content)
                      }}
                    />

                    <Link to={`/read/${post.slug}`}> Read more</Link>
                  </div>

                ))
              }
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }} >
              <BootstrapPagination
                total={total}
                limit={PAGE_LIMIT}
                onChange={((page) => pageChange(page))}
                maxPagestoShow={5}
                defaultActivePage={page}
              />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}
