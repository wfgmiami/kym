import React from 'react';
import { connect } from 'react-redux';

const SearchForm = ({ onSearchSubmit, searchVal, changeSearchTerm }) => (
  <form onSubmit={ onSearchSubmit } className="form-group input-group">
    <input
      type="text"
      className="form-control"
      placeholder="Search Food"
      value={ searchVal }
      onChange={ changeSearchTerm }
    />
    <span className="input-group-btn">
      <button className="btn btn-primary" role="button">
        Search
      </button>
    </span>
  </form>
);

SearchForm.propTypes = {
  onSearchSubmit: React.PropTypes.func.isRequired,
  searchVal: React.PropTypes.string.isRequired,
  changeSearchTerm: React.PropTypes.func.isRequired,
};

const mapStateToProps = ({ mealplanner }) => ({
  retainedFoods: mealplanner.retainedFoods,
});

export default connect(mapStateToProps)(SearchForm);
