import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { calculateTotalPages } from '../helpers'

export const usePagination = <T, U>(
  totalItems: number,
  perPage: number,
  activeTab?: T,
  searchedItems?: U[] | null
) => {
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const currentPage = params.get('page')

  useEffect(() => {
    if (currentPage) setPage(+currentPage)
    else setPage(1)
  }, [currentPage])

  // When the active tab changed, reset the page to 1
  useEffect(() => {
    setPage(1)
  }, [activeTab])

  useEffect(() => {
    if (searchedItems)
      setTotalPages(calculateTotalPages(searchedItems.length, perPage))
    else setTotalPages(calculateTotalPages(totalItems, perPage))
  }, [activeTab, searchedItems, totalItems, perPage])

  return { page, totalPages }
}
