# B+W Engineering Status Page

Real-time infrastructure status for B+W Engineering web services. Monitors uptime, response time, and 30-day uptime percentage for all B+W domains.

**Live:** https://status.bwengr.com

## Services Monitored

| Service | URL | Description |
|---------|-----|-------------|
| bwengr.com | https://bwengr.com | Main website and portfolio |
| drainageplans.la | https://drainageplans.la | Altadena fire rebuild drainage plan landing page |
| gradingplans.la | https://gradingplans.la | Los Angeles grading plans landing page |
| civilengineer.la | https://civilengineer.la | Civil engineer LA redirect service |
| bw.engineering | https://bw.engineering | B+W Engineering short URL |
| losangeles.engineering | https://losangeles.engineering | Los Angeles engineering redirect |

## Features

- **Real-time status** - Services checked every 5 minutes
- **Response time tracking** - Average response time calculated from last 30 days of checks
- **Uptime percentage** - 30-day uptime calculated from check history
- **Visual uptime chart** - Bar chart showing uptime percentage for each service
- **RSS feed** - Subscribe to status updates at `/rss.xml`
- **Dynamic header badge** - Shows "All Systems Operational", "Partial Degradation", or "Service Disruption" based on current status

## Architecture

```
Cloudflare Worker (cron every 5 min) → GitHub Actions workflow_dispatch → Checks sites → Commits status → Cloudflare Pages rebuilds
```

## Tech Stack

- **Astro v6** - Static site generation
- **Cloudflare Pages** - Edge deployment
- **Cloudflare Workers** - Cron trigger for GitHub Actions
- **GitHub Actions** - Uptime monitoring
- **Inline CSS** - No external stylesheets for maximum email compatibility

## Deployment

### Status Page (Cloudflare Pages)

Connected to GitHub. Push to main branch triggers automatic deployment to status.bwengr.com.

### Worker (Cloudflare Workers)

The Worker triggers GitHub Actions on a 5-minute schedule.

```bash
# Deploy worker
wrangler deploy

# Set GitHub token secret
wrangler secret put GITHUB_TOKEN

# View worker logs
wrangler tail
```

Worker URL: `https://bwengr-status-trigger.travanx.workers.dev`

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run linting
npm run lint

# Format code
npm run format

# Type check
npm run check

# Build for production
npm run build
```

## CI/CD

### CI Workflow

Runs on every push to main and on pull requests:
- ESLint + TypeScript checking
- Astro type checking
- Prettier format verification
- YAML linting for workflow files
- Production build verification

### Uptime Check Workflow

Triggered by Cloudflare Worker every 5 minutes:
- Checks all monitored services
- Records response time, HTTP status, and timestamp
- Calculates 30-day uptime percentage
- Commits updated status.json and checks.json
- Triggers Cloudflare Pages rebuild

## Data Files

- `src/data/status.json` - Current status, response times, and uptime for all services
- `src/data/checks.json` - Historical check data for the past 30 days (used for uptime calculations)

## Repository

https://github.com/bwengr/bwengr-status