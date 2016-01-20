import '../styles/portfolioallocation.styl';

import React from 'react';
import immutable from 'immutable';

const {any, object, func, instanceOf, string} = React.PropTypes;

import Component from 'react-pure-render/component';
import Connector from './connector.react';
import AssetAllocationGraph from './assetallocationgraph.react';
import MenuOptions from './menuoptions.react';


import {format} from './utils';

const connectorStyle = {
  height: 60,
  position: 'absolute',
  transform: 'translate(166px, 33px)',
  'msTransform': 'translate(-75px, 29px)', //dirty, dirty IE
  'WebkitTransform': 'translate(166px, 33px)', //dirty, dirty Safari
  pointerEvents: 'none'
};

class PortfolioAllocation extends Component {

  static propTypes = {
    asset: instanceOf(immutable.Map),
    total: instanceOf(immutable.List),
    colors: instanceOf(immutable.Map).isRequired,
    msg: any,
    onChange: func,
    state: string,
    style: object
  };

  constructor(props) {
    super(props);
    this.colors = this.props.colors;
  }

  activateAssetAllocationOption(i) {
    this.props.onChange && this.props.onChange(i);
  }

  sortByCount(asset1, asset2) {
    return asset1.get('count') < asset2.get('count');
  }

  renderLegendItem(datum, i, arr, isTotal) {
    const {state: activeAssetAllocationOption, msg} = this.props;
    const styleList = {
      background: isTotal
        ? this.colors.get('total').filter(x => x.get(0) === i).first().get(1)
        : this.colors.getIn([activeAssetAllocationOption, i])
    };
    const total = arr.reduce((total, x) => total + x.get('count'), 0);
    const toPercent = (absolute) => absolute / total;
    return (
      <li key={i}>
        <div className="beforeLegendItem" style={styleList}></div>
        {format.percent(datum.get('count'))} {format(msg[datum.get('id')] || datum.get('id'))}
      </li>
    );
  }

  renderLegend(assetArr, isTotal) {
    return (
      <ul className="graphLeged">
        {assetArr.map((datum, i, arr) => this.renderLegendItem(datum, isTotal ? arr.getIn([i, 'id']) : i , arr, isTotal))}
      </ul>
    );
  }

  render({asset, state: activeAssetAllocationOption, total: totalAsset, style, msg} = this.props) {
    if (!asset.size) return null;
    const totalColorMap = this.colors.get('total').toKeyedSeq().mapEntries(([_, x]) => x);
    const totalColors = totalAsset.map(x => totalColorMap.get(x.get('id')));
    const deepColors = this.colors.get(activeAssetAllocationOption);
    const currentColor = this.colors.get('total').filter(x => x.get(0) === activeAssetAllocationOption).first().get(1);
    const totalAssetCount = totalAsset.reduce((total, item) => total + item.get('count'), 0);
    const deepAsset = asset.find((d, k) => k === activeAssetAllocationOption);
    const deepAssetPercentage = totalAsset.find((d, k) => d.get('id') === activeAssetAllocationOption).count;
    const assetIds = totalAsset.filter(a => a.get('count')).map((a) => a.get('id'));
    const delimiter = (i, size) => {
      if (i === size)
        return '.';
      if (i === (size - 1))
        return ' and ';
      return ', ';
    };
    const insiderGraph = totalAsset.entrySeq()
      .reduce((str, key, i, arr) =>
        str + (msg[key[1].get('id')] || key[1].get('id')) + delimiter(i, arr.size - 1),
      '');
    return (
      <div>
        <section style={style} className='portfolio-allocation'>
          <header>
            {assetIds.size < 2 ? null : (<MenuOptions
              activeOption={activeAssetAllocationOption}
              onChange={this.activateAssetAllocationOption.bind(this)}
              options={assetIds}
              msg={msg}
              />)}
          </header>
              {!deepAssetPercentage ? null : <Connector style={connectorStyle} color={currentColor}/>}
          <div className='content'>
            <div className="content-inner">
              <div className="graph-wrapper total-graph-wrapper">
                <div className="center-div">
                  <div className="list">
                    {insiderGraph}
                  </div>
                </div>
                <AssetAllocationGraph
                  activeDatum={activeAssetAllocationOption}
                  asset={totalAsset}
                  colors={totalColors}
                  onSliceClicked={this.activateAssetAllocationOption.bind(this)}
                  type="total"
                  />
                {this.renderLegend(totalAsset, true)}
              </div>
              {!deepAssetPercentage ? null : (<div className="graph-wrapper deep-graph-wrapper">
                <div className="center-div">
                  <div className="list">
                    <div className="deep-asset-percentage">{format.percent(deepAssetPercentage)}</div> {activeAssetAllocationOption}
                  </div>
                </div>
                <AssetAllocationGraph
                  asset={deepAsset}
                  colors={deepColors}
                  type="deep"
                  />
                {this.renderLegend(deepAsset)}
              </div>)}
            </div>
            <div className="link-like-button-wrapper">
            </div>
          </div>
        </section>
      </div>
    );
  }

}


export default PortfolioAllocation;

export const __hotReload = true;
