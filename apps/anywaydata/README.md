# AnyWayData Full Site Docker Image

This image builds and serves the full `anywaydata.com` experience by combining:

- Docusaurus docs output (`docs-src` -> `build`)
- Web app production bundle (`apps/web/dist`)

The build process merges both into a single static site and serves it with nginx.

## Build

From the repo root:

```bash
docker build -f apps/anywaydata/Dockerfile -t anywaydata-site .
```

## Run

```bash
docker run --rm -p 8080:8080 anywaydata-site
```

Then open:

- `http://localhost:8080/`
- `http://localhost:8080/app.html`
- `http://localhost:8080/generator.html`
- `http://localhost:8080/webmcp.html`

## Notes

- This Dockerfile is separate from `apps/web/Dockerfile`.
- `apps/web/Dockerfile` serves only the web app.
- `apps/anywaydata/Dockerfile` serves docs + web app together.
