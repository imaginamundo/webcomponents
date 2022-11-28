run:
	deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts

ssr:
	cd server && deno run --allow-net --allow-read --unstable --allow-ffi main.ts