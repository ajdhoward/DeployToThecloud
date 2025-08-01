import { Router } from 'itty-router'
import { handleStorage } from './storage.js';

const router = Router();

// Health check endpoint
router.get('/health', () => new Response(
  JSON.stringify({
    status: 'healthy',
    storage: 'r2',
    agents: 4,
    version: '1.0.0'
  }),
  {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  }
));

// Dashboard endpoint
router.get('/', async (request, env) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI LifeOS Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4f46e5;
      --primary-dark: #4338ca;
      --background: #f9fafb;
      --card: #ffffff;
      --text: #1f2937;
      --border: #e5e7eb;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--background);
      color: var(--text);
      line-height: 1.5;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }
    
    h1 {
      font-size: 1.875rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .icon {
      color: var(--primary);
    }
    
    .card {
      background: var(--card);
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border: 1px solid var(--border);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }
    
    .agent-card {
      border-left: 4px solid var(--primary);
    }
    
    .agent-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .agent-name {
      font-weight: 600;
      font-size: 1.125rem;
    }
    
    .status {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
    }
    
    .status-active {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .status-inactive {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    
    footer {
      text-align: center;
      margin-top: 3rem;
      color: #6b7280;
      font-size: 0.875rem;
    }
    
    .setup-guide {
      background-color: #f0f9ff;
      border-left: 4px solid var(--primary);
      padding: 1rem;
      border-radius: 0 0.375rem 0.375rem 0;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1><span class="icon">🤖</span> AI LifeOS Dashboard</h1>
      <div class="status status-active">Operational</div>
    </header>
    
    <div class="card">
      <h2>Welcome to your Personal AI LifeOS</h2>
      <p>This is your personal AI ecosystem that manages your life and work. All data is stored securely in Cloudflare R2 with no egress fees.</p>
      
      <div class="setup-guide">
        <strong>First-time setup:</strong> No additional setup required! Your system is ready to use.
      </div>
    </div>
    
    <h2>Active Agents</h2>
    <div class="grid">
      <div class="card agent-card">
        <div class="agent-header">
          <div class="agent-name">Meta Orchestrator</div>
          <div class="status status-active">Active</div>
        </div>
        <p>Routes tasks to the appropriate agents based on context and priority.</p>
      </div>
      
      <div class="card agent-card">
        <div class="agent-header">
          <div class="agent-name">Finance Agent</div>
          <div class="status status-active">Active</div>
        </div>
        <p>Tracks expenses, budgets, and financial goals.</p>
      </div>
      
      <div class="card agent-card">
        <div class="agent-header">
          <div class="agent-name">Health Agent</div>
          <div class="status status-active">Active</div>
        </div>
        <p>Monitors health metrics and provides recommendations.</p>
      </div>
      
      <div class="card agent-card">
        <div class="agent-header">
          <div class="agent-name">IoT Agent</div>
          <div class="status status-active">Active</div>
        </div>
        <p>Manages smart home devices and automation.</p>
      </div>
    </div>
    
    <div class="card">
      <h2>System Information</h2>
      <div class="grid">
        <div class="card">
          <h3>Storage</h3>
          <p>100GB Cloudflare R2 storage available</p>
          <p>Current usage: 0.5GB</p>
        </div>
        
        <div class="card">
          <h3>AI Processing</h3>
          <p>Using Together.ai for LLM processing</p>
          <p>Current token usage: 12,450/2,000,000</p>
        </div>
      </div>
    </div>
    
    <footer>
      <p>AI LifeOS • $5.00/month • <a href="https://github.com/ai-lifeos/single-repo-template">Documentation</a></p>
    </footer>
  </div>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
    status: 200
  });
});

// Storage endpoints
router.all('/storage/*', handleStorage);

// Catch-all for 404
router.all('*', () => new Response('Not Found', { status: 404 }));

export { router };