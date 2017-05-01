import React from 'react';

export const isLoggedIn = ( currentUser, props ) => {
  if(!currentUser.authenticated){
    props.history.push('/login');
  }
};
