// Observe the authentication boundary without following it or sending credentials.
export function isProtectedOperatorResponse(status,location,base){
 if(status===401||status===403)return true;
 if(status!==302||!location)return false;
 try{
  const source=new URL(base),destination=new URL(location);
  return source.origin==='https://djconnect.dev'&&!source.username&&!source.password
   &&destination.origin==='https://pcvantol.cloudflareaccess.com'
   &&!destination.username&&!destination.password
   &&destination.pathname==='/cdn-cgi/access/login/djconnect.dev';
 }catch{return false;}
}
