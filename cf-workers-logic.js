export default {
  async fetch(request) {
    const userAgent = request.headers.get("User-Agent") || ""; //null scneario
    const newLocationHost = "developers.cloudflare.com/workers/about"
    
    console.log("Detected User-Agent:", userAgent);

    if(userAgent.includes("curl")){
      const cookieHeader = request.headers.get("Cookie") || "";
      const isBypass = cookieHeader.includes("cf-noredir=true");

      console.log("cURL detected. Bypass cookie found?", isBypass);

      if(!isBypass){
        const newLocation = "https://"+newLocationHost
        return Response.redirect(newLocation, 302)
      }
    }
    return new Response("You are not using curl and will not be redirected");
  },
};