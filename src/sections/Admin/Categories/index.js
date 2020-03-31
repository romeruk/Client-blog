import React from 'react'
import gql from "graphql-tag";
import { Row, Col, Table } from 'react-bootstrap';

import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';
import { useUrlQuery } from '../../../hooks/';
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

const PAGE_LIMIT = 10;

export const Categories = () => {
  let history = useHistory();
  let query = useUrlQuery();
  const page = parseInt(query.get("page"), 10) || 1;
  const { loading, error, data } = useQuery(GETCATEGORIES, {
    variables: {
      limit: PAGE_LIMIT,
      page: page
    },
    fetchPolicy: "cache-and-network"
  });

  if (loading) return <LoadingComponent />
  if (error) return `Error! ${error.message}`;

  const total = data.findAllCategories.total;
  const categories = data.findAllCategories.categories;

  const pageChange = (page) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('page', page);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
  }


  const renderTableData = () => {
    return categories.map((category) => {
      return <TableBodyTr key={category.slug} category={category} />
    })
  }

  return (
    <>
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
    </>
  )
}