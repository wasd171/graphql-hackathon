import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import { ApolloClient, createNetworkInterface, ApolloProvider } from 'react-apollo';
const networkInterface = createNetworkInterface({
  uri: 'https://graphql.communitygraph.org/graphql/'
});
const client = new ApolloClient({
  networkInterface: networkInterface
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
