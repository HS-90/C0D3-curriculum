import * as React from 'react'
import { StarContainer } from './star.js'

export const Lesson = ({ name, slug, title, click, status, rating }) => {

    const text = `${slug}: ${title}`
    const renderStars = status === "enrolled" ? <div style={{ marginLeft: '50px' }}><StarContainer numStars={5} name={name} slug={slug} title={title} starsGiven={rating} /></div> : <div></div>

    return (
        <div className="section" onClick={click}>
            <div style={{ marginLeft: '50px' }}>{text}</div>
            {renderStars}
        </div>
    )
}

export default Lesson