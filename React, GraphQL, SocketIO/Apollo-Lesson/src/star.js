import * as React from 'react'
import { gql, useMutation } from "@apollo/client"

const Star = ({ classes, hoverFunc, clickFunc }) => {
	return (<i className={classes} onMouseOver={hoverFunc} onClick={(e) => {
		e.stopPropagation()
		clickFunc()

	}} />)
}

const Text = ({ stars = 0, given = false, course = "" }) => {
	const status = given ? `have rated ${course}` : `are rating ${course}`

	return (
		<div style={{ fontSize: 18 }}>
			You {status} {stars} stars
		</div>
	)
}

//mutation string
const GIVE_RATING = gql`
	mutation giveRating($name: String!, $slug: String!, $title: String!, $stars: String!){
		giveRating(name: $name, slug: $slug, title: $title, stars: $stars){
			name
			lessons
			ratings{
				lesson
				rating
			}
		}
	}
`

export const StarContainer = ({ numStars, name, slug, title = "", starsGiven = 0 }) => {
	const unfilled = "fas fa-star hoverstar"
	const filled = "fas fa-star hoverstar filled"

	//function rendering highlighted stars
	const renderStars = (num) => {
		return Array(numStars).fill(null).map((e, i) => {
			if (i <= num) return filled

			return unfilled
		})
	}

	//states
	const [stars, setStars] = React.useState(renderStars(starsGiven - 1))
	const [display, setDisplay] = React.useState(starsGiven)
	const [given, setGiven] = React.useState(starsGiven > 0 ? true : false)
	const [selected, setSelected] = React.useState(starsGiven > 0 ? true : false)
	const [errorMessage, setErrorMessage] = React.useState(undefined)

	//mutations
	const [giveRating, { error }] = useMutation(GIVE_RATING)
	//fill stars and event functions
	const fillContainer = stars.map((element, index) => {
		const updateStars = () => {
			if (!selected) {
				setGiven(false)
				setDisplay(index + 1)
				setStars(renderStars(index))
			}
		}

		const clickStar = () => {
			setStars(renderStars(index))
			setDisplay(index + 1)
			setSelected(true)
			setGiven(true)

			giveRating({ variables: { name: name, slug: slug, title: title, stars: `${index + 1}` } })

		}



		return <Star key={index} classes={element} hoverFunc={updateStars} clickFunc={clickStar} />
	})

	if (error) setErrorMessage(`Error: ${error.message}`)

	return (
		<div className="bigContainer">
			{fillContainer}
			<Text stars={display} given={given} course={title} />
			<div style={{ color: "red" }}>{errorMessage}</div>
		</div>
	)
}


export default StarContainer