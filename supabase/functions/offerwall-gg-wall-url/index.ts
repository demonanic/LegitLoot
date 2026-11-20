// RETIRED: inert tombstone entrypoint. The only module that starts the server; the
// pure handler lives in handler.ts so tests import it without side effects.
import { handleRequest } from "./handler.ts";

Deno.serve(handleRequest);
