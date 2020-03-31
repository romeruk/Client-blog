import React from 'react'
import { Pagination } from 'react-bootstrap';

export const BootstrapPagination = ({ total, limit, maxPagestoShow, onChange, defaultActivePage = 1 }) => {

  let active = defaultActivePage;

  const countPages = Math.ceil(total / limit);
  let firstPage = active - Math.ceil(maxPagestoShow / 2);
  if (firstPage <= 1)
    firstPage = 1;
  else {
    if (countPages - firstPage < maxPagestoShow) {
      firstPage = countPages - maxPagestoShow + 1;

    }
    if (firstPage <= 1)
      firstPage = 1;
  }

  let lastPage = firstPage + maxPagestoShow - 1;
  if (lastPage > countPages) {
    lastPage = countPages;
  }

  const onClick = (page) => {
    active = page;
    onChange(page);
  }

  const renserItems = () => {
    let items = [];
    for (let i = firstPage; i <= lastPage; i++) {
      items.push(
        <Pagination.Item key={i} active={i === active} onClick={() => onClick(i)}>
          {i}
        </Pagination.Item>)
    }

    return items;
  }

  return (
    <Pagination>
      {firstPage !== 1 && (
        <Pagination.Prev onClick={() => onChange(active - 1)} />
      )}
      {renserItems()}
      {lastPage < countPages && (
        <Pagination.Next onClick={() => onChange(active + 1)} />
      )}
    </Pagination>
  )
}