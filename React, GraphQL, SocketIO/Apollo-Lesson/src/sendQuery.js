import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client"

const link = createHttpLink({
	uri: 'https://hs-graphql2.herokuapp.com/graphql',
	credentials: 'include'
})

export const client = new ApolloClient({
	cache: new InMemoryCache(),
	link,
})

export default client  