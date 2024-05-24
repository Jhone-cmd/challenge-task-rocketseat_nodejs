export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    const pathParams = path.replaceAll(routeParametersRegex, "(?<$1>[a-z0-9\-_]+)");
    const pathRegex = new RegExp(`^${pathParams}(?<query>\\?(.*))?$`);
    return pathRegex;
}