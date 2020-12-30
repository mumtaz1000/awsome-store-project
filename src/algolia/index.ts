import algoliasearch from 'algoliasearch'

const algoliaClient = algoliasearch(
  '5CASI7BKV7',
  'e97578e38cee32602df80474c9387a83'
)

// Create the indices on Algolia
export const usersIndex = algoliaClient.initIndex('users')
export const productsIndex = algoliaClient.initIndex('products')
export const ordersIndex = algoliaClient.initIndex('orders')
