import {fromJS} from 'immutable';
import colors from './colors';

export default {
  'state': 'stocks',
  colors,
  'asset': fromJS({
    'stocks': [
      {
        'id': 'US Long',
        'count': 0.7932
      },
      {
        'id': 'US Short',
        'count': 0
      },
      {
        'id': 'Non US Long',
        'count': 0.2037
      },
      {
        'id': 'Non US Short',
        'count': 0
      }
    ],
    'bonds': [
      {
        'id': 'US Bond Long',
        'count': 0
      },
      {
        'id': 'US Bond Short',
        'count': 0
      },
      {
        'id': 'Non US Bond Long',
        'count': 0
      },
      {
        'id': 'Non US Bond Short',
        'count': 0
      }
    ],
    'other': [
      {
        'id': 'Cash Long',
        'count': 0.0032
      },
      {
        'id': 'Cash Short',
        'count': 0
      },
      {
        'id': 'Other Long',
        'count': 0
      },
      {
        'id': 'Other Short',
        'count': 0
      },
      {
        'id': 'Convertible Long',
        'count': 0
      },
      {
        'id': 'Convertible Short',
        'count': 0
      }
    ]
  }),
  'total': fromJS([
    {
      'id': 'stocks',
      'count': 0.6969
    },
    {
      'id': 'bonds',
      'count': 0
    },
    {
      'id': 'other',
      'count': 0.3032
    }
  ]),
  'msg': {
    'title': 'Asset Allocation',
    'totalDescription': 'Stocks, Bonds, and Other',
    'stocks': 'Stocks',
    'bonds': 'Bonds',
    'other': 'Other'
  },
  'style': {
    'height': 226,
    'width': 634
  }
};
