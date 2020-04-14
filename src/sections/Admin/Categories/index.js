import React from 'react'
import gql from "graphql-tag";
import { Row, Col, Table, Card, Container } from 'react-bootstrap';
import { useQueryState } from 'react-router-use-location-state';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { LoadingComponent, BootstrapPagination } from '../../../lib';
import { TableBodyTr } from "./components";

export const GETCATEGORIES = gql`
  query findAllCategories($limit: Float!, $page: Float!) {
    findAllCategories(limit: $limit, page: $page) {
      total
      categories {
        title
        slug
      }
    }
  }
`;

export const REMOVECATEGORY = gql`
  mutation removeCategory($title: String!) {
    removeCategory(title: $title)
  }
`;

const PAGE_LIMIT = 10;

export const Categories = () => {
  const [page, setPage] = useQueryState('page', 1);
  const [removeCategory, { loading: mutationLoading }] = useMutation(REMOVECATEGORY);

  const { loading, error, data, refetch } = useQuery(GETCATEGORIES, {
    variables: {
      limit: PAGE_LIMIT,
      page: page
    },
    fetchPolicy: "cache-and-network"
  });

  if (loading || mutationLoading) return <LoadingComponent />
  if (error) return `Error! ${error.message}`;

  const total = data.findAllCategories.total;
  const categories = data.findAllCategories.categories;

  const pageChange = (page) => {
    setPage(page, {
      method: "push"
    })
  }


  const handleRemoveCategory = async (title) => {
    try {
      await removeCategory({
        variables: {
          title
        }
      })
      toast("Category has been removed", {
        type: "success"
      });
      refetch();

    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error"
      });
    }
  }

  const renderTableData = () => {
    return categories.map((category) => {
      return <TableBodyTr key={category.slug} category={category} handleRemoveCategory={handleRemoveCategory} />
    })
  }

  return (
    <section>
      <Container>
        <Row>
          <Col md={12}>
            <Card className="mb-4">
              <Card.Header>Categories</Card.Header>
              <Card.Body>
                <Link className="btn btn-primary" to="/categories/create">Create new category</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Table responsive>
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>SLUG</th>
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