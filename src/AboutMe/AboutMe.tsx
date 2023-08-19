import React, { ReactNode } from 'react';
import './AboutMe.css';


const AboutMe: React.FC = () => {
    return <div className='about-me'>
        <p>Hi you can find the github link here <a href="https://github.com/mthanki/music-player">https://github.com/mthanki/music-player </a>
            This whole thing was made in about 10ish hours.
            You can reach me on <a href="https://www.linkedin.com/in/mehul-thanki/">LinkedIn</a></p>
    </div>
}

export default AboutMe;