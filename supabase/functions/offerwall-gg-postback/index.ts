// Production containment candidate for Offerwall.GG.
// The HTTP entrypoint is the only module that starts the server. The pure
// handler lives in handler.ts so tests can import it without side effects.
import { handleRequest } from "./handler.ts";

Deno.serve(handleRequest);
