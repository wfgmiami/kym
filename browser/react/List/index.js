import React from 'react';
import { connect } from 'react-redux';

import { getList } from '../../redux/reducers/shoppinglist';

class List extends React.Component {
  constructor(props) {
    super();
    console.log(props.list);
    props.getList(new Date());
  }

  render() {
    const { list } = this.props;
    if (!list) return null;
    const renderList = makeList(list);

    return (
      <div className="container">
        { Object.keys(renderList).map((group, ix) => (
          <p key={ix}>
            <h4>{ group }</h4>
            <ul className="list-group">
              {renderList[group].map(record => (
              <li  className="list-group-item" key={record.id}>
                {record.abbrev.longname}
                <span className="badge badge-default">{convertWeight(record)}</span>
              </li>))}
            </ul>
          </p>))}
      </div>
      );
  }
}

const mapStateToProps = ( { shoppinglist } ) => ( {
  list: shoppinglist.list
} );

const mapDispatchToProps = dispatch => ( {
  getList: date => dispatch( getList( date ) )
} );

export default connect( mapStateToProps, mapDispatchToProps )( List );


function makeList( list ) {
  return combineRecords( list ).reduce( ( memo, record ) => {
    const foodGroup = record.abbrev.foodDesc.foodGroup.Description;
    if ( memo[ foodGroup ] ) {
      memo[ foodGroup ].push( record );
    } else {
      memo[ foodGroup ] = [ record ];
    }
    return memo;
  }, {} );
}

function combineRecords( list ) {
  return Object.values( list.reduce( ( memo, record ) => {
    const { abbrev } = record;
    const grWht = getWeight( record );
    if ( memo[ abbrev.id ] ) {
      memo[ abbrev.id ].gr += grWht;
    } else {
      memo[ abbrev.id ] = Object.assign( record, { gr: grWht } );
    }
    return memo;
  }, {} ) );
}

function getWeight( record ) {
  const unit = record.abbrev.weights.filter( weight => {
    return weight.Seq === record.Unit;
  } )[ 0 ];

  return ( unit.Gr_Wgt * 1 ) * ( record.Quantity * 1 ) / ( unit.Amount * 1 );
}

function convertWeight( record ) {
  const oz = record.abbrev.weights.filter( unit => unit.Description === 'oz' )[ 0 ];
  const unit = oz ? oz : record.abbrev.weights[ 0 ];

  if (unit.Description !== 'oz') {
    return `${Math.round( record.gr * 100 / 28.35 ) / 100} oz`;
  }

  return `${Math.round(record.gr * 10 / (unit.Gr_Wgt * 1) / (unit.Amount * 1)) / 10} ${unit.Description}`;
}

