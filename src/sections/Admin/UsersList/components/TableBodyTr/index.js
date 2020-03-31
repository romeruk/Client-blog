import React from 'react'
import { ButtonGroup, Button } from "react-bootstrap";

export const TableBodyTr = ({ user, userAction }) => {
  const { firstName, lastName, email, role, verified, deletedAt } = user;


  return (
    <tr key={email}>
      <td>{firstName}</td>
      <td>{lastName}</td>
      <td>{email}</td>
      <td>{role}</td>
      <td>{verified.toString()}</td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Button disabled={deletedAt === null} onClick={() => userAction(email, false)} variant="success">Recover</Button>
          <Button disabled={deletedAt !== null} onClick={() => userAction(email, true)} variant="danger">Remove</Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}

