import { serve, walk } from "./deps.ts";

type Route = {
  path: string;
  name: string;
  isFile: boolean;
};

function urlPathnameFromPath(path: string) {
  // Remove pages folder
  let route = path.substring(3);

  // Remove file extension
  const splittedRoute = route.split(".");
  splittedRoute.pop();
  route = splittedRoute.join(".");

  // Remove /main
  if (route === "/main") route = "/";
  if (route.endsWith("/main")) route = route.slice(0, route.length - 5);

  return route;
}

async function routesFromDirectory(directory: string) {
  const routes = new Map<string, Route>();
  const routesFoulder = walk(directory, { exts: ["tsx", "jsx", "ts", "js"] });
  for await (const entry of routesFoulder) {
    if (entry.isFile) {
      const route = {
        path: `./${entry.path}`,
        name: entry.name,
        isFile: entry.isFile,
      };
      routes.set(urlPathnameFromPath(entry.path), route);
    }
  }
  return routes;
}

const routes = await routesFromDirectory("./app");
console.log(routes);

function notFoundResponse(req: Request): Response {
  return new Response(`${req.url} not found`, { status: 404 });
}

async function pageResponse(route: Route): Promise<Response> {
  const { default: page } = await import(route.path);
  const body = await page();

  if (body instanceof Response) return body;

  return new Response(body, {
    headers: new Headers({ "content-type": "text/html; charset=UTF-8" }),
  });
}

async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let pathname = url.pathname;

  // Remove trailing slash
  if (url.pathname.endsWith("/") && url.pathname.length > 1) {
    pathname = pathname.slice(0, -1);
  }

  const route = routes.get(pathname);
  if (!route) return notFoundResponse(req);
  return pageResponse(route);
}

serve(handler);
