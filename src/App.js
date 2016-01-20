import React from 'react';
import Component from 'react-pure-render/component';
import AllocGraph from './portfolioallocation.react';
import data from './mock.js';
import '../styles/main.styl';

export class App extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  onChange = active => this.setState({active});

  render({active} = this.state) {
    active = active || data.state
    return (
      <div className="tr-alloc-graph">
        <AllocGraph onChange={this.onChange} {...data} state={active}/>
      </div>
    );
  }
}