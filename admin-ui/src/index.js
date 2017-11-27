import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import config from './config'
import _ from 'lodash'

fetch('/config.json')
  .then(response => {
    response.json()
      .then(overrideConfig => {
        window.config = _.defaultsDeep(config, overrideConfig)
        console.log('config=', window.config)
        ReactDOM.render(<App/>, document.getElementById('root'));
        registerServiceWorker();
      })
  })


