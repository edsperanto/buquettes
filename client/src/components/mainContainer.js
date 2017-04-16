import React from 'react';

const MainContainer = () => {
  return (
    <div>
    <h1>Main Search</h1>
      <form id="frmSearch" action="./MockData">
        <input type ="text" id="txtSearch" name="txtSearch" alt="Search Criteria"
          onKeyUp= "searchSuggest();" autoComplete="off"/>
        <input type= "submit" id= "cmdSearch" name="cmdSearch" value="Search" alt="Run Search"/>
      </form>

    </div>


    )
}

export default MainContainer;