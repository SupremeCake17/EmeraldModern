/* eslint-disable */

importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.sw.js");
importScripts("/uv/uv.config.js");

importScripts(
  "/scram/scramjet.wasm.js",
  "/scram/scramjet.codecs.js",
  "/scram/scramjet.shared.js",
  "/scram/scramjet.worker.js"
);

uv = new UVServiceWorker();
const scramjet = new ScramjetServiceWorker();

async function handleRequest(event) {
  await scramjet.loadConfig();

  if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
    return await uv.fetch(event);
  } else if (scramjet.route(event)) {
    return scramjet.fetch(event);
  }
  return await fetch(event.request);
}

self.addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event));
});
