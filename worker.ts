export default {
  async fetch(_request: Request, env: { GITHUB_TOKEN: string }, _ctx: ExecutionContext): Promise<Response> {
    return new Response('Worker is running. Scheduled triggers are enabled.', { status: 200 });
  },

  async scheduled(event: ScheduledEvent, env: { GITHUB_TOKEN: string }, _ctx: ExecutionContext) {
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    const OWNER = 'bwengr';
    const REPO = 'bwengr-status';
    const WORKFLOW_ID = 'uptime-check.yml';

    const url = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_ID}/dispatches`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
          'User-Agent': 'bwengr-status-worker/1.0'
        },
        body: JSON.stringify({
          ref: 'main'
        })
      });

      if (response.status === 204) {
        console.log('Workflow triggered successfully');
      } else {
        const error = await response.text();
        console.error('Failed to trigger workflow:', response.status, error);
      }
    } catch (error) {
      console.error('Error triggering workflow:', error);
    }
  }
};