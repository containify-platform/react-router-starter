// The health check Containify polls before sending a new release traffic.
// A resource route: a loader and no component, so it answers with a plain response.
export function loader() {
  return new Response("ok");
}
