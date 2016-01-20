import '../styles/menuoptions.styl';

import React from 'react';

const {any, func, objectOf, string, instanceOf} = React.PropTypes;

import immutable from 'immutable';
const {Set, List} = immutable;

import Component from 'react-pure-render/component';

import {format} from './utils';

class MenuOptions extends Component {

  static propTypes = {
    activeOption: any.isRequired,
    className: string,
    msg: objectOf(string),
    onChange: func.isRequired,
    options: instanceOf(List)
  };

  setDuration(val) {
    const {onChange} = this.props;
    onChange(val);
  }

  renderOption(val, i) {
    const {activeOption, msg} = this.props;
    const classList = [
      val,
      val == activeOption || Set.isSet(activeOption) && activeOption.includes(val) ? 'active' : ''
    ];
    return (
      <li className={classList.join(' ')} key={i}>
        <button onClick={this.setDuration.bind(this, val)}>
          {msg ? format(msg[val]) : val}
        </button>
      </li>
    );
  }

  render() {
    const {options, className = ''} = this.props;
    return (
      <menu className={`menu-options ${className}`}>
        <ul>
          {options.map(this.renderOption.bind(this))}
        </ul>
      </menu>
    );
  }

}

export default MenuOptions;

export const __hotReload = true;
