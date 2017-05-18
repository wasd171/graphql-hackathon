import React, { Component } from 'react';
import styled from 'styled-components'
import { graphql, gql } from 'react-apollo'
import { VictoryChart, VictoryLine, VictoryLabel, VictoryLegend } from 'victory'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const query = gql`
  query mainQuery {
    Repository {
      size
      open_issues
      owner {
        type
      }
	  }
  }
`;

const options = {
  props: ({data}) => ({
    loading: data.loading,
    repos: data.loading || data.Repository.reduce((repos, repo) => {
      if (repo.owner.type === 'User') {
        repos.users.push(repo);
      } else {
        repos.organisations.push(repo);
      }
      return repos
    }, {users: [], organisations: []}) 
  })
}

const styles = {
  users: {
    data: {
      stroke: '#0b3536',
      strokeWidth: 1
    }
  },
  organisations: {
    data: {
      stroke: '#f54123',
      strokeWidth: 1
    }
  }
}

class App extends Component {
  renderChart = () => (
    <VictoryChart>
      <VictoryLabel x={25} y={24} text="How does the number of open issues depend on the size of repository?"/>
      <VictoryLine
        data={this.props.repos.users}
        x="size"
        y="open_issues"
        style={styles.users}
      />
      <VictoryLine
        data={this.props.repos.organisations}
        x="size"
        y="open_issues"
        style={styles.organisations}
      />
      <VictoryLegend
        colorScale={[
          styles.users.data.stroke,
          styles.organisations.data.stroke
        ]}
        data={[
          {name: 'Users'},
          {name: 'Organisations'}
        ]}
        x={250}
      />
    </VictoryChart>
  )

  renderLoader = () => (
    'Loading...'
  )

  render() {
    console.log(this.props);

    return (
      <Container>
        {this.props.loading ? this.renderLoader() : this.renderChart()}
      </Container>
    );
  }
}

export default graphql(query, options)(App);
