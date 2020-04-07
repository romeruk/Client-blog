import React from 'react'
import { ButtonGroup, Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

export const TableBodyTr = ({ post, onRemove }) => {
  const { title, slug } = post;


  return (
    <tr>
      <td>{title}</td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Link to={`/user/post/${slug}/edit`} className="btn btn-success">Edit</Link>
          <Button variant="danger" onClick={() => onRemove(title)}>Delete</Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}

