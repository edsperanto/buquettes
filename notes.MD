#GITHUB API References:
##Getting Started: 
https://developer.github.com/guides/getting-started/

- Uses OAuth tokens to accomodate 2 factor authentication
    - User can revoke applications authorizations at any time
    - User can set specific access/privacy with their token
- Should we choose a web flow where user is directed to Github, signs in, then redirects back to app? To learn more go here: https://developer.github.com/v3/oauth/#web-application-flow

- Make sure to have a clear idea of what permissions our App will require. We should only request necessary scopes so we don't scare the intended user with too many permission requests. To see list of Github Scopes go here: https://developer.github.com/v3/oauth/#scopes

- If we use OAuth, _private_ repos will **only** be returned **if** OAuth token contains the correct repo scope.
  - we can also filter repos by their `type` parameter.
  - From Github: filter by type..."In this way, we can fetch only directly-owned repositories, organization repositories, or repositories the user collaborates on via a team" 

For further reading on Basic Authentication:
- https://developer.github.com/guides/basics-of-authentication/

##**~We still need to Register our Application with Github once we come up with a name!~**

##Discover User Resources: 
https://developer.github.com/guides/discovering-resources-for-a-user/

Third Party Applications often need to fetch current user's repos and organizations and this is how to reliably discover those resources.

- Libraries in Use: **NodeJS** -> _Octonode_,
> Uses web wrap tools for Javascript we will use NodeJS with `octonode` and require it in our server.js. 
- More on the octonode library and it's methods can be found here:
> https://github.com/pksunkara/octonode
  