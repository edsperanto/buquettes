import React, { Component } from 'react';

import{ BrowserRouter as Router, Route, link} from 'react-router-dom';
import Login from '../../components/login.js';
import MainContainer from '../../components/mainContainer.js';
import Example from '../../sandLab/basicExample.js';
import Autosuggest from 'react-autosuggest';

//list used to populate autosuggest
const languages = [
  {
    name: 'Apple'
  },
  {
    name: 'Banana'
  },
  {
    name: 'Cherry'
  },
  {
    name: 'Grapefruit'
  },
  {
    name: 'Lemon'
  }
];

//Autosuggest calculates suggestions for any given input vale
const getSuggestions = (value) => {
  console.log( 'value', value )
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

    return inputLength === 0 ? [] : languages.filter(lang =>
      lang.name.toLowerCase().slice(0, inputLength) === inputValue
      );
}

//when a suggestion gets clicked, it needs to populate the input field
//based on the clicked suggestion.
const getSuggestionValue = suggestion => suggestion.name;

//..render suggestions
const renderSuggestion = (suggestion) => (
  <div>
    {suggestion.name}
  </div>

);

class App extends Component {
  constructor() {
    super();

//Autosuggest is a controlled component. We need to add an input value and an
//onChange handler that will update the value
  this.state = {
    value: '',
    suggestions: []
  };

  }

  onChange = (event, {newValue}) => {
    this.setState({
      value: newValue
    });
  };

  //Autosuggest will call this function every time you need to update suggestions.
  //Logic has already been implemented above
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  //Call this function every time you need to update suggestions
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };


  render() {
    const { value, suggestions } = this.state;

    //autosugest will pass through all these props to the input element.
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange
    };

    return (
      <div className="App">
        <div className="App-header">
          <h2>Searh </h2>

        </div>

         <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}/>


      </div>
    );
  }
}

export default App;
