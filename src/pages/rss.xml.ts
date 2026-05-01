import statusData from '../data/status.json';

const lastChecked = statusData.lastChecked || statusData.lastUpdated;
const buildDate = new Date(lastChecked).toUTCString();

const overallStatus = statusData.services.every(s => s.status === "operational")
  ? "All Systems Operational"
  : statusData.services.some(s => s.status === "down")
  ? "Service Disruption"
  : "Partial Degradation";

const items = statusData.services.map(service => {
  const statusCode = service.status === "operational" ? "200" : service.status === "degraded" ? "503" : "500";
  const pubDate = new Date().toUTCString();
  const title = `${service.name}: ${service.status === "operational" ? "Operational" : service.status === "degraded" ? "Degraded Performance" : "Service Disruption"}`;

  return `    <item>
      <title>${title}</title>
      <link>${service.url}</link>
      <guid isPermaLink="false">${service.name}-${new Date().toISOString().split('T')[0]}</guid>
      <description>${service.description} - Response time: ${service.responseTime}ms, Uptime: ${service.uptime30d}%</description>
      <pubDate>${pubDate}</pubDate>
      <statusology:status xmlns:statusology="https://statusology.org/status">${service.status}</statusology:status>
      <statusology:responseTime xmlns:statusology="https://statusology.org/status">${service.responseTime}</statusology:responseTime>
      <statusology:uptime xmlns:statusology="https://statusology.org/status">${service.uptime30d}</statusology:uptime>
    </item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
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

return new Response(rss, {
  headers: {
    'Content-Type': 'application/rss+xml; charset=utf-8',
    'Cache-Control': 'public, max-age=300'
  }
});