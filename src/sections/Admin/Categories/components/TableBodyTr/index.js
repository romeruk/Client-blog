import React from 'react'
import { ButtonGroup } from "react-bootstrap";
import { Link } from 'react-router-dom';

export const TableBodyTr = ({ category }) => {
  const { title, slug } = category;


  return (
    <tr key={slug}>
      <td>{title}</td>
      <td>{slug}</td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Link to={`/categories/${slug}/edit`} className="btn btn-success">Edit</Link>
        </ButtonGroup>
      </td>
    </tr>
  )
}

