import * as React from 'react'
import { gql, useLazyQuery, useMutation } from "@apollo/client"
import { Lesson } from "./lesson.js"


//query strings
const GET_SESSION = gql`
	query getSession{
		getSession{
			name
			image
			lessons
			error
			ratings{
				lesson
				rating
			}
		}
	}

`

const GET_ALL_LESSONS = gql`
	query getAllLessons{
		getAllLessons{
			slug
			title
		}
	}
`

//mutation strings
const ENROLL = gql`
	mutation enroll($name: String!, $slug: String!, $title: String!){
		enroll(name: $name, slug: $slug, title: $title){
			name
			lessons
			error
		}

	}
`

const UNENROLL = gql`
	mutation unenroll($name: String!, $slug: String!, $title: String!){
		unenroll(name: $name, slug: $slug, title: $title){
			name
			lessons
			error
		}
	}
`

export const Home = () => {

	//states
	const [name, setName] = React.useState({})
	const [enrolled, setEnrolled] = React.useState([])
	const [unenrolled, setUnenrolled] = React.useState([])
	const [errorMessage, setErrorMessage] = React.useState(undefined)

	//queries and mutations

	const [enroll, { error: enrollError }] = useMutation(ENROLL)

	const [unenroll, { error: unenrollError }] = useMutation(UNENROLL)

	//update courses function
	const updateCourses = (category, clickAction, name, status, mapping) => {
		return category.map((e, i) => {
			const curSlug = e.split(":")[0]
			const curTitle = e.split(":")[1].trim()

			const curMutation = clickAction === "enroll" ? enroll : unenroll
			const click = () => {
				curMutation({ variables: { name: name, slug: curSlug, title: curTitle } }).then(r => {
					getSession()
				})
			}

			return <Lesson key={i} name={name} slug={curSlug} title={curTitle} click={click} status={status} rating={mapping[`${curSlug}: ${curTitle}`]} />

		})
	}

	const [getAllLessons, { error: lessonsError, data: lessonsData }] = useLazyQuery(GET_ALL_LESSONS, {
		fetchPolicy: "network-only",
		onCompleted: () => {

			const lessonStrings = lessonsData.getAllLessons.map(e => `${e.slug}: ${e.title}`)
			const userLessons = sessionData.getSession.lessons
			const registered = lessonStrings.filter(e => userLessons.includes(e))
			const notRegistered = lessonStrings.filter(e => !userLessons.includes(e))

			const curRatings = sessionData.getSession.ratings

			const ratingsMapping = {}

			lessonStrings.forEach((element) => {
				const findRating = curRatings.find(e => e.lesson === element)

				if (findRating) {
					ratingsMapping[element] = parseInt(findRating.rating)
				} else {
					ratingsMapping[element] = 0
				}
			})

			setEnrolled([])
			setUnenrolled([])

			setEnrolled(updateCourses(registered, 'unenroll', sessionData.getSession.name, 'enrolled', ratingsMapping))
			setUnenrolled(updateCourses(notRegistered, 'enroll', sessionData.getSession.name, 'unenrolled', ratingsMapping))

		}
	})

	const [getSession, { error: sessionError, data: sessionData }] = useLazyQuery(GET_SESSION, {
		fetchPolicy: "network-only",
		onCompleted: () => {

			if (sessionData.getSession.name) {
				setName({ pokemon: sessionData.getSession.name, image: <img src={sessionData.getSession.image} width="150" height="150"></img> })
			}
			getAllLessons()
		}
	})

	//errors
	if (sessionError) setErrorMessage(`Error: ${sessionError.message}`)
	if (lessonsError) setErrorMessage(`Error: ${lessonsError.message}`)
	if (enrollError) setErrorMessage(`Error: ${enrollError.message}`)
	if (unenrollError) setErrorMessage(`Error: ${unenrollError.message}`)



	React.useEffect(() => { getSession() }, [])

	return (
		<div style={{ paddingLeft: "16%", marginTop: "160px" }}>
			<header className="header">Courses Dashboard</header>
			<div className="main">
				<div className="userinfo">
					<div style={{ textDecoration: "underline", fontSize: "65px", fontWeight: "bold" }}>
						{name.pokemon}
					</div>
					{name.image}
				</div>
				<div style={{ color: "red" }}>{errorMessage}</div>
				<br></br>
				<h2>Enrolled:</h2>
				<div className="enrolled">
					<p>Please click on a lesson to Unenroll, or click stars to rate a course</p>
					{enrolled}
				</div>
				<h2>Not Enrolled:</h2>
				<div className="unenrolled">
					<p>Click to Enroll</p>
					{unenrolled}
				</div>
			</div>
		</div>
	)

}


export default Home