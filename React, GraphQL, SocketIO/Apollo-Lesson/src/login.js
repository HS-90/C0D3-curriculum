import { debounce } from './debounce.js'
import * as React from 'react'
import { gql, useLazyQuery } from "@apollo/client"

const Pokemon = ({ name, image }) => {
	return (
		<div>
			<h3>{name}</h3>
			<img src={image}></img>
		</div>
	)
}

const Option = ({ value }) => {
	return (
		<option value={value}></option>
	)
}

//set up GraphQL queries that will be used
const FIND_POKEMON = gql`
	query findPokemon($name: String!){
		findPokemon(name: $name){
			name
			sprites
		}
	}
`

const POKE_SUGGESTIONS = gql`
	query pokeSuggestions($input: String!){
		pokeSuggestions(input: $input)
	}
	
`

const LOGIN_QUERY = gql`
	query login($pokemon: String!, $sprites: String!){
		login(pokemon: $pokemon, sprites: $sprites){
			name
			image
			lessons
			error
		}
	}
`

export const Login = () => {

	//states
	const [entry, setEntry] = React.useState('')
	const [suggestions, setSuggestions] = React.useState([])
	const [choice, setChoice] = React.useState(undefined)
	const [errorMessage, setErrorMessage] = React.useState(undefined)

	//queries
	const [findPokemon, { error: findPokemonError, data: findPokemonData }] = useLazyQuery(FIND_POKEMON, {
		fetchPolicy: 'network-only',
		onCompleted: () => {
			setChoice(<Pokemon name={findPokemonData.findPokemon.name} image={findPokemonData.findPokemon.sprites} />)
			setEntry(findPokemonData.findPokemon.name)
			setSuggestions([])
		}
	})
	const [pokeSuggestions, { error: pokeSuggestionsError, data: pokeSuggestionsData }] = useLazyQuery(POKE_SUGGESTIONS, {
		fetchPolicy: 'network-only',
		onCompleted: () => {
			setSuggestions(pokeSuggestionsData.pokeSuggestions.map((e, i) => <Option key={i} value={e} />))
		}
	})

	const [loginQuery, { error: loginQueryError, data: loginQueryData }] = useLazyQuery(LOGIN_QUERY, {
		fetchPolicy: 'network-only',
		onCompleted: () => {
			if (loginQueryData.login.name) window.location.assign("/home")
		}
	})

	//event functions
	const onEntry = (e) => {
		setEntry(e.target.value)
	}

	const search = (e) => {
		if (e.key === "Unidentified" || e.key === "Enter") {
			findPokemon({ variables: { name: `${entry}` } })
		}
		else {
			if (entry.length > 1 && e.key) {
				return debounce(() => {
					pokeSuggestions({ variables: { input: `${entry}` } })
				}, 500)()
			}

			setSuggestions([])
		}
	}

	//errors
	if (findPokemonError) setErrorMessage(`Error: ${findPokemonError.message}`)
	if (pokeSuggestionsError) setErrorMessage(`Error: ${pokeSuggestionsError.message}`)
	if (loginQueryError) setErrorMessage(`Error: ${loginQueryError.message}`)

	return (

		<div>
			<header className="header">Welcome to class! Please Sign In By Choosing a Pokemon!</header>
			<div style={{ paddingLeft: "15%" }}>
				<div style={{ marginTop: "89px" }}>Pokemon: </div>

				<div className="pokemon_choice">
					<input className="pokemon" list="select" placeholder="Search for a Pokemon..." spellcheck="false" value={entry}
						onChange={onEntry} onKeyUp={search}></input>

					<datalist id="select">
						{suggestions}
					</datalist>

					<div className="choice">
						{choice}
					</div>

				</div>
				<div style={{ color: "red" }}>{errorMessage}</div>

				<a className="button submit" style={{ marginTop: "20px" }} onClick={() => { loginQuery({ variables: { pokemon: `${choice.props.name}`, sprites: `${choice.props.image}` } }) }}>Submit</a>
			</div>

		</div>

	)

}


export default Login





