import '../styles/assetallocationgraph.styl';

import d3 from 'd3';
import React from 'react';
import immutable from 'immutable';

import Component from 'react-pure-render/component';

class Chart {

  create(el, props, state) {
    this.onSliceClicked = state.onSliceClicked;

    this.width = props.width;
    this.height = props.height;
    this.radius = Math.min(this.width, this.height) / 2;

    this.svg = d3.select(el)
      .append('svg')
      .append('g');

    // clices
    this.svg.append('g')
      .attr('class', 'slices');

    // labels
    this.svg.append('g')
      .attr('class', 'labels');

    // lines
    this.svg.append('g')
      .attr('class', 'lines');


    this.pie = d3.layout.pie()
      .sort(null)
      .value((d) => d.count);

    this.arc = d3.svg.arc()
      .outerRadius(this.radius * 0.75)
      .innerRadius(this.radius * 0.55);

    this.svg.attr('transform',
      `translate(${this.width / 2}, ${(this.height / 2) - 10})`);

    this.key = (d) => d.data.id;

    this.update(el, state);
  }

  update(el, state) {
    const {activeDatum, asset, colors} = state;
    const assetIds = asset.map((asset) => asset.get('id'));

    if (activeDatum) {
      const total = asset.reduce((total, datum) =>
        total + datum.get('count'), 0);
      const halfIfActive = (id) => (id === activeDatum) ? 0.5 : 1;
      const percentOf = (count) => (count / total);
      const activeOrEarlier =
        (datum, i) => (i <= assetIds.indexOf(activeDatum));
      const takePercentOfOffset = (offset, datum) =>
        offset +
        (percentOf(datum.get('count')) * halfIfActive(datum.get('id')));
      const offsetPercent = asset
        .filter(activeOrEarlier)
        .reduce(takePercentOfOffset, 0);
      const pieChartRotation =
        offsetPercent * 2 * Math.PI - (2 * Math.PI * 0.13);

      this.pie
        .startAngle(-pieChartRotation)
        .endAngle(Math.PI * 2 - pieChartRotation);
    }

    this.color = d3.scale.ordinal()
      .domain(assetIds.toJS())
      .range(colors.toJS());

    /* ------- PIE SLICES -------*/
    this.slice = this.svg.select('.slices').selectAll('path.slice')
      .data(this.pie(asset.toJS()), this.key);

    this.slice.enter()
      .insert('path')
      .style('fill', (d) => this.color(d.data.id))
      .attr('class', 'slice')
      .on('click', (d) => {
        const {data} = d;
        if (typeof this.onSliceClicked === 'function')
          this.onSliceClicked(data.id);
      });

    const arc = this.arc;
    this.slice
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        this._current = this._current || d;
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          return arc(interpolate(t));
        };
      });

    this.slice.exit()
      .remove();
  }

  destroy(el) {
    d3.select(el).selectAll('*').remove();
  }

}

function getWidthOf(el) {
   const width = parseInt(getComputedStyle(el).width, 10);
  return width > 10 ? width :
    getWidthOf(el.parentElement) - 10;
}

class AssetAllocationGraph extends Component {

  static propTypes = {
    activeDatum: React.PropTypes.string,
    asset: React.PropTypes.instanceOf(immutable.List).isRequired,
    colors: React.PropTypes.instanceOf(immutable.List).isRequired,
    onSliceClicked: React.PropTypes.func,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
    type: React.PropTypes.string.isRequired
  };

  componentDidMount() {
    this.d3Chart = new Chart();
    const {type} = this.props;
    this.el = React.findDOMNode(this.refs[type]);
    this.createGraph();
    this.onResizeListener = ::this.onResize;
    window.addEventListener('resize', this.onResizeListener);
  }

  createGraph() {
    const size = this.props.size || getWidthOf(this.el);
    this.d3Chart.create(this.el, {
      width: size,
      height: size
    }, this.getChartState());
  }

  onResize() {
    this.d3Chart.destroy(this.el);
    this.createGraph();
    this.forceUpdate();
  }

  componentDidUpdate() {
    this.d3Chart.update(this.el, this.getChartState());
  }

  componentWillUnmount() {
    this.d3Chart.destroy(this.el);
    window.removeEventListener('resize', this.onResizeListener);
  }

  getChartState() {
    return this.props;
  }

  render() {
    const {type, style} = this.props;
    return (
      <div
        style={style}
        className="asset-allocation-graph"
        ref={type}
        >
      </div>
    );
  }

}

export default AssetAllocationGraph;

export const __hotReload = true;
