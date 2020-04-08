import React from 'react'
import { ButtonGroup, Button } from "react-bootstrap";

export const TableBodyTr = ({ post, handleCloseOpenModal, setCurrPost }) => {
  const { title, isActive } = post;


  return (
    <tr>
      <td>{title}</td>
      <td>{`${isActive}`}</td>
      <td>
        <ButtonGroup aria-label="Basic example">
          <Button variant="info" onClick={() => {
            setCurrPost(post);
            handleCloseOpenModal();
          }}>preview</Button>

        </ButtonGroup>
      </td>
    </tr>
  )
}

