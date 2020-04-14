import React from 'react'
import { ButtonGroup, Button } from "react-bootstrap";

export const TableBodyTr = ({ category, handleRemoveCategory }) => {
  const { title, slug } = category;


  return (
    <tr key={slug}>
      <td>{title}</td>
      <td>{slug}</td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Button variant="danger" onClick={() => handleRemoveCategory(title)}>Remove</Button>
        </ButtonGroup>
      </td>
    </tr>
  )
}

