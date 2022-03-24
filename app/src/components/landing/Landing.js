import React, { Component } from 'react';
import { Container, Button } from 'semantic-ui-react';
import './Landing.css';
import { Redirect } from 'react-router-dom';

class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { redirect: null };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ redirect: name });
  }

  render() {
    const { redirect } = this.state;

    if (redirect) {
      return <Redirect push to={redirect} />;
    }

    return (
      <Container className='Landing'>
        <div className='Landing-content'>
          <div>
            <img src='/logo192.png' alt="Logo" className="Landing-image"></img>
          </div>
          <div>
            <Button.Group>
              <Button name='turn' color='google plus' onClick={this.handleItemClick}>
                Turn Controller
              </Button>
              <Button.Or />
              <Button name='combat' color='facebook' onClick={this.handleItemClick}>
                Combat Simulator
              </Button>
              <Button.Or />
              <Button name='units' color='twitter' onClick={this.handleItemClick}>
                Unit Book
              </Button>
            </Button.Group>
          </div>
        </div>
      </Container>
    );
  }
}

export default Landing;