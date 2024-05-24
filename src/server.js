import http from "node:http";
import { middlewareJson } from "./middlewares/middleware-json.js";
import { Routes } from "./routes/routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer( async (req, res) => {
    const { method, url } = req;

    await middlewareJson(req, res);

    const route = Routes.find((route) => {
        return route.method === method && route.path.test(url)
    });

    if(route) {
        const routeParams = req.url.match(route.path);
        //console.log(extractQueryParams(routeParams.groups.query));
        // const { params } = routeParams.groups
        const { query, ...params } = routeParams.groups;
        req.params = params;
        req.query = query ? extractQueryParams(query) : {};
        return route.handler(req, res)
    };

    return res.writeHead(404).end(JSON.stringify({ message: "Route Not Found" }));
 
});

console.log("Server is running. 🚀");
server.listen(3333);
