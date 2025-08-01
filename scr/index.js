import { withHooks } from 'itty-router'
import { router } from './router.js';

export default {
  fetch: withHooks(
    router.fetch,
    {
      before: [async (request, env) => {
        // Initialize storage if needed
        if (!await env.STORAGE_BUCKET.head('system/initialized')) {
          await env.STORAGE_BUCKET.put('system/initialized', 'true');
          await setupInitialData(env);
        }
      }]
    }
  ),
  
  async scheduled(event, env, ctx) {
    // Daily maintenance tasks
    if (event.cron === "0 0 * * *") {
      await cleanupStorage(env);
    }
  }
};

async function setupInitialData(env) {
  // Create initial structure
  await env.STORAGE_BUCKET.put('nodes/system.json', JSON.stringify({
    type: 'system',
    name: 'AI LifeOS',
    created: new Date().toISOString()
  }));
  
  // Create initial agents
  const agents = [
    { id: 'meta-orchestrator', name: 'Meta Orchestrator', status: 'active' },
    { id: 'finance-agent', name: 'Finance Agent', status: 'active' },
    { id: 'health-agent', name: 'Health Agent', status: 'active' },
    { id: 'iot-agent', name: 'IoT Agent', status: 'active' }
  ];
  
  for (const agent of agents) {
    await env.STORAGE_BUCKET.put(`agents/${agent.id}.json`, JSON.stringify(agent));
  }
}

async function cleanupStorage(env) {
  // Clean up old storage objects
  const list = await env.STORAGE_BUCKET.list();
  for (const object of list.objects) {
    // Delete objects older than 30 days
    if (Date.now() - object.uploaded > 30 * 24 * 60 * 60 * 1000) {
      await env.STORAGE_BUCKET.delete(object.key);
    }
  }
}