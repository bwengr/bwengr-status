import type { APIRoute } from 'astro';
import statusData from '../data/status.json';

export const GET: APIRoute = () => {
  const lastChecked = statusData.lastChecked || statusData.lastUpdated;
  const buildDate = new Date(lastChecked).toUTCString();

  const overallStatus = statusData.services.every(s => s.status === "operational")
    ? "All Systems Operational"
    : statusData.services.some(s => s.status === "down")
    ? "Service Disruption"
    : "Partial Degradation";

  const items = statusData.services.map(service => {
    const pubDate = new Date().toUTCString();
    const title = `${service.name}: ${service.status === "operational" ? "Operational" : service.status === "degraded" ? "Degraded Performance" : "Service Disruption"}`;

    return `    <item>
      <title>${title}</title>
      <link>${service.url}</link>
      <guid isPermaLink="false">${service.name}-${new Date().toISOString().split('T')[0]}</guid>
      <description>${service.description} - Response time: ${service.responseTime}ms, Uptime: ${service.uptime30d}%</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  }).join('\n');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>B+W Engineering System Status</title>
    <link>https://status.bwengr.com</link>
    <description>Real-time infrastructure status for B+W Engineering web services</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="https://status.bwengr.com/rss.xml" rel="self" type="application/rss+xml"/>
    <item>
      <title>${overallStatus}</title>
      <link>https://status.bwengr.com</link>
      <guid isPermaLink="false">status-${new Date().toISOString().split('T')[0]}</guid>
      <description>Overall status: ${overallStatus}. Last checked: ${new Date(lastChecked).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</description>
      <pubDate>${buildDate}</pubDate>
    </item>
${items}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300'
    }
  });
};