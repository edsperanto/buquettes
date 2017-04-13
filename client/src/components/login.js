import React from 'react'

const Login = () => {
  return (
    <div>
     <form>
        UserName:<br/>
        <input type="text" name="username"/><br/>
        Password:<br/>
        <input type="text" name="password"/>
        <br/>
        <input type="submit" value="Submit"/>
    </form>
    </div>
    )
}

export default Login