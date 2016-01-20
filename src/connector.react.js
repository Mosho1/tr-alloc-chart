import React from 'react';

const {string, object, number} = React.PropTypes;

import Component from 'react-pure-render/component';

class Connector extends Component {

  static propTyles = {
    color: string,
    circles: number,
    radius: number,
    distance: number,
    style: object,
    joint: number,
    viewBox: string
  };

  constructor(props) {
    super(props);
    const {angle, color, radius, distance, joint, circles} = this.props;
    const width = joint * (2 * radius + distance) + Math.cos(Math.PI * angle / 180) * (circles - joint) * (2 * radius + distance);
    const height = (Math.sin(Math.PI * angle / 180) * (circles - joint) + 1) * (2 * radius + distance);
    this.state = {viewBox: `0 0 ${width} ${height}`};
  }

  getProps = (i) => {
    const {angle, color, radius, distance, joint} = this.props;
    return {
      cx: radius * 2 + 2 * distance * (i > (joint - 1) ?  (joint - 1) + Math.cos(Math.PI * angle / 180) * (i - joint + 1) : i),
      cy: radius * 2 + (i > (joint - 1) ? Math.sin(Math.PI * angle / 180) * 2 * distance * (i - joint + 1) : 0),
      r: radius,
      fill: color
    };
  };

  render({style, circles} = this.props, {viewBox} = this.state) {
    return (
      <svg style={style} viewBox={viewBox} version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        {Array.apply(null, new Array(circles)).map((_, i) => <circle key={i} {...this.getProps(i)}/>)}
      </svg>
    );
  }

}

Connector.defaultProps = {
  color: 'blue',
  circles: 30,
  radius: 1.5,
  distance: 3,
  joint: 7,
  angle: 25
};

export default Connector;

export let __hotReload = true;
