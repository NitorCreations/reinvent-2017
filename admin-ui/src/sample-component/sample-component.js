import React, { Component } from 'react';
import './sample-component.css';

class SampleComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className='sample-component'>
        Stuff goes here
      </div>
    )
  }
}

export default SampleComponent;
