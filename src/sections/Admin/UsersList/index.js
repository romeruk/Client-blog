import React from 'react'
import { Table, Row, Col, Card, Container } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import { LoadingComponent, BootstrapPagination } from '../../../lib';
import { useUrlQuery } from '../../../hooks/';
import { TableBodyTr } from './components'
import { GETUSERS, REMOVEUSER, RECOVERUSER } from './graphql';
const PAGE_LIMIT = 10;

export const UsersList = () => {
  let history = useHistory();
  let query = useUrlQuery();
  const page = parseInt(query.get("page"), 10) || 1;
  const { loading, error, data, refetch } = useQuery(GETUSERS, {
    variables: {
      limit: PAGE_LIMIT,
      page: page
    },
    fetchPolicy: "cache-and-network"
  });

  const [removeUser] = useMutation(REMOVEUSER);
  const [recoverUser] = useMutation(RECOVERUSER);

  if (loading) return <LoadingComponent />
  if (error) return `Error! ${error.message}`;


  const total = data.findAllUsers.total;
  const users = data.findAllUsers.users;

  const headings = users.length > 0 ? Object.keys(users[0]) : [];

  const pageChange = (page) => {
    let currentUrlParams = new URLSearchParams(window.location.search);
    currentUrlParams.set('page', page);
    history.push(window.location.pathname + "?" + currentUrlParams.toString());
  }


  const renderTableHeading = () => {
    return headings.map((key, index) => {
      if (key !== "__typename" && key !== "deletedAt")
        return <th key={index}>{key.toUpperCase()}</th>
      return null;
    })
  }


  const userAction = async (email, isActionRemove) => {
    try {

      const variables = {
        email
      }

      if (isActionRemove) {
        await removeUser({
          variables
        });
        refetch();
        toast("User has been removed", {
          type: "success"
        });
      } else {
        await recoverUser({
          variables
        });
        refetch();
        toast("User has been recovered", {
          type: "success"
        });
      }

    } catch (error) {
      toast(`Error! ${error.message}`, {
        type: "error"
      });
    }
  }

  const renderTableData = () => {
    return users.map((user) => {
      return <TableBodyTr key={user.email} user={user} userAction={userAction} />
    })
  }


  return (
    <section>
      <Container>

        <Row>
          <Col md={12}>
            <Card className="mb-4">
              <Card.Header>Users</Card.Header>
              <Card.Body>
                <Link className="btn btn-primary" to="/users/create">Create new user</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Table responsive>
              <thead>
                <tr>
                  {renderTableHeading()}
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