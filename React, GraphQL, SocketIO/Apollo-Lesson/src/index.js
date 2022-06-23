import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ApolloProvider, useQuery, gql} from "@apollo/client"
import {client} from './sendQuery.js'
import {Login} from './login.js'
import {Home} from './home.js'


const SESSION_INFO = gql`
	query getSession{
		getSession{
			name
			image
			lessons
			error
		}
	}
`
  

const App = () => {
	
	const {loading, error, data} = useQuery(SESSION_INFO)
	
	if(loading) return 'Fetching user data...';
	if(error) return `Error! ${error.message}` 
		
	if(data.getSession.name) return <Home />

	return (
		<Login />
	)
}

const LoginOrHome = () => {
	return (
		<ApolloProvider client={client}>
			<App/>
		</ApolloProvider>
	)
}


ReactDOM.render(<LoginOrHome/>, document.getElementById("root"))