import React from 'react';
import Placeholder from '../img/Placeholder.png'
import {Col} from 'reactstrap'
const Features = () => {
  return(
      <div>
      <Col sm={{ size: '3'}}>
        <div>
            <img src={Placeholder} className="PlaceholderImage"/>
        </div>
      </Col>
      <Col sm={{ size: '3', offset: 6}}>
        <div className="Features">
            <h2>Always on call!</h2>
            <hr/>
            <article>
                  With acclimate you'll always have a friend, using our handy chat application. Unsure where your next class is? Or just
                  feeling the stress of exams? You can always send a quick message to your mentor!
            </article>
        </div>
      </Col>
    </div>
  )
}
export default Features
