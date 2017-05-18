import React, { Component } from 'react';
import styled from 'styled-components'
import { graphql, gql } from 'react-apollo'
import { VictoryChart, VictoryLine, VictoryLabel, VictoryLegend, VictoryTooltip, VictoryScatter } from 'victory'
import MadeWithLove from 'react-made-with-love'

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  padding: 10px;
`;

const query = gql`
  query mainQuery {
    Repository {
      _size: size
      open_issues
      url
      full_name
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

const USER_COLOR = '#0b3536';
const ORGANISATION_COLOR = '#f54123';
const STROKE_WIDTH = 0.5;
const POINT_SIZE = 2;

const styles = {
  users: {
    line: {
      data: {
        stroke: USER_COLOR,
        strokeWidth: STROKE_WIDTH
      }
    },
    point: {
      data: {
        fill: USER_COLOR
      }
    }
  },
  organisations: {
    line: {
      data: {
        stroke: ORGANISATION_COLOR,
        strokeWidth: STROKE_WIDTH
      }
    },
    point: {
      data: {
        fill: ORGANISATION_COLOR
      }
    }
  }
}

const Tooltip = <VictoryTooltip 
  style={{
    fontSize: 8
  }}
/>

function getLabel(repo) {
  return repo.full_name
}

class App extends Component {
  renderChart = () => (
    <VictoryChart>
      <VictoryLabel x={25} y={24} text="How does the number of open issues depend on the size of repository?"/>
      <VictoryLine
        data={this.props.repos.users}
        x="_size"
        y="open_issues"
        style={styles.users.line}
      />
      <VictoryScatter
        data={this.props.repos.users}
        x="_size"
        y="open_issues"
        style={styles.users.point}
        size={POINT_SIZE}
        labels={getLabel}
        labelComponent={Tooltip}
      />
      <VictoryLine
        data={this.props.repos.organisations}
        x="_size"
        y="open_issues"
        style={styles.organisations.line}
      />
      <VictoryScatter
        data={this.props.repos.organisations}
        x="_size"
        y="open_issues"
        style={styles.organisations.point}
        size={POINT_SIZE}
        labels={getLabel}
        labelComponent={Tooltip}
      />
      <VictoryLegend
        colorScale={[
          USER_COLOR,
          ORGANISATION_COLOR
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
    return (
      <Container>
        <h3>SSL is not supported due to API being HTTP-only</h3>
        {this.props.loading ? this.renderLoader() : this.renderChart()}
        <Wrapper>
          <MadeWithLove
            by='wasd171'
            emoji={true}
            link='https://github.com/wasd171'
          />
        </Wrapper>
      </Container>
    );
  }
}

export default graphql(query, options)(App);
