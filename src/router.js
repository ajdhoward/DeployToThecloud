import { Router } from 'itty-router'

const router = Router();

// Health check endpoint
router.get('/health', () => new Response(
  JSON.stringify({
    status: 'healthy',
    storage: 'r2',
    agents: 4,
    version: '1.0.1'
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
      --success: #10b981;
      --error: #ef4444;
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
    
    /* Environment variables styles */
    .env-container {
      margin-top: 1.5rem;
    }
    
    .env-form {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    @media (max-width: 768px) {
      .env-form {
        grid-template-columns: 1fr;
      }
    }
    
    .env-form label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .env-form input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid var(--border);
      border-radius: 0.375rem;
    }
    
    .env-form button {
      background-color: var(--primary);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
      margin-top: 1.5rem;
    }
    
    .env-list {
      margin-top: 1.5rem;
    }
    
    .env-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border: 1px solid var(--border);
      border-radius: 0.375rem;
      margin-bottom: 0.5rem;
    }
    
    .env-name {
      font-weight: 600;
    }
    
    .env-value {
      font-family: monospace;
      background-color: #f3f4f6;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
    
    .env-actions button {
      background-color: var(--error);
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
    }
    
    .env-secret {
      color: #6b7280;
      font-size: 0.875rem;
      margin-top: 0.25rem;
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
    
    <div class="card">
      <h2>Environment Variables</h2>
      <p>Manage your API keys and configuration settings securely.</p>
      
      <div class="env-container">
        <div class="card">
          <h3>Add New Variable</h3>
          <form id="add-env-form" class="env-form">
            <div>
              <label for="env-name">Variable Name</label>
              <input type="text" id="env-name" name="name" required 
                     placeholder="TOGETHER_API_KEY">
              <div class="env-secret">Use uppercase letters, numbers, and underscores (e.g., TOGETHER_API_KEY)</div>
            </div>
            
            <div>
              <label for="env-value">Value</label>
              <input type="password" id="env-value" name="value" required 
                     placeholder="Enter your API key">
            </div>
            
            <button type="submit">Add Variable</button>
          </form>
        </div>
        
        <div class="env-list" id="env-list">
          <div class="card">
            <h3>Loading environment variables...</h3>
          </div>
        </div>
      </div>
    </div>
    
    <footer>
      <p>AI LifeOS • $5.00/month • <a href="https://github.com/ajdhoward/DeployToThecloud">Documentation</a></p>
    </footer>
  </div>
  
  <script>
    // Environment variables management
    document.addEventListener('DOMContentLoaded', async function() {
      const envList = document.getElementById('env-list');
      
      try {
        // Fetch current environment variables
        const response = await fetch('/env');
        const envVars = await response.json();
        
        // Create HTML for existing variables
        let envHtml = '<div class="grid">';
        
        for (const [name, value] of Object.entries(envVars)) {
          envHtml += `
            <div class="card env-item">
              <div>
                <div class="env-name">${name}</div>
                <div class="env-value">${value || 'Not set'}</div>
                ${name === 'TOGETHER_API_KEY' || name === 'SENTRY_DSN' ? 
                  '<div class="env-secret">This is a secret value. In a real implementation, it would be stored securely.</div>' : ''}
              </div>
              <div class="env-actions">
                <button onclick="deleteEnv('${name}')" class="delete-btn">Delete</button>
              </div>
            </div>
          `;
        }
        
        envHtml += '</div>';
        envList.innerHTML = envHtml;
        
        // Add form submission handler
        document.getElementById('add-env-form').addEventListener('submit', async function(e) {
          e.preventDefault();
          
          const name = document.getElementById('env-name').value;
          const value = document.getElementById('env-value').value;
          
          try {
            const response = await fetch('/env', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ name, value })
            });
            
            const result = await response.json();
            
            if (result.success) {
              alert('Variable added successfully! Remember to set this in Cloudflare dashboard.');
              // Refresh the page to show updated variables
              location.reload();
            } else {
              alert('Error: ' + (result.error || 'Unknown error'));
            }
          } catch (error) {
            alert('Error saving variable: ' + error.message);
          }
        });
        
      } catch (error) {
        envList.innerHTML = `
          <div class="card" style="background-color: #fee2e2; border-left-color: #ef4444;">
            <strong>Error loading environment variables:</strong> ${error.message}
          </div>
        `;
      }
    });

    // Delete environment variable
    async function deleteEnv(name) {
      if (!confirm(\`Are you sure you want to delete \${name}?\`)) {
        return;
      }
      
      try {
        const response = await fetch(\`/env/\${name}\`, {
          method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert('Variable deleted successfully! Remember to remove this from Cloudflare dashboard.');
          location.reload();
        } else {
          alert('Error: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        alert('Error deleting variable: ' + error.message);
      }
    }
  </script>
</body>
</html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
    status: 200
  });
});

// Environment variables endpoints
router.get('/env', async (request, env) => {
  // Return all environment variables (with values masked for security)
  const envVars = {
    TOGETHER_API_KEY: env.TOGETHER_API_KEY ? '••••••••' : 'Not set',
    SENTRY_DSN: env.SENTRY_DSN ? '••••••••' : 'Not set'
  };
  
  return new Response(JSON.stringify(envVars), {
    headers: { 'Content-Type': 'application/json' }
  });
});

router.post('/env', async (request, env) => {
  // In this implementation, we're just showing the UI
  // Actual environment variables must be set in Cloudflare dashboard
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Variable would be saved (set in Cloudflare dashboard)' 
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});

router.delete('/env/:name', async (request, env) => {
  // In this implementation, we're just showing the UI
  // Actual environment variables must be set in Cloudflare dashboard
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Variable would be deleted (remove from Cloudflare dashboard)' 
    }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});

// Storage endpoints
router.all('/storage/*', async (request, env) => {
  const url = new URL(request.url);
  const path = url.pathname.replace('/storage', '');
  
  try {
    switch (request.method) {
      case 'GET':
        if (path === '/') {
          return listObjects(request, env, path);
        }
        return getObject(request, env, path);
      
      case 'PUT':
        return putObject(request, env, path);
      
      case 'DELETE':
        return deleteObject(request, env, path);
      
      default:
        return new Response('Method Not Allowed', { status: 405 });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

async function listObjects(request, env, prefix) {
  const list = await env.STORAGE_BUCKET.list({ prefix });
  return new Response(JSON.stringify(list), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function getObject(request, env, key) {
  const object = await env.STORAGE_BUCKET.get(key);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }
  
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  return new Response(object.body, { headers });
}

async function putObject(request, env, key) {
  const object = await env.STORAGE_BUCKET.put(key, request.body);
  return new Response(JSON.stringify({
    key: object.key,
    version: object.version,
    etag: object.httpEtag
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 201
  });
}

async function deleteObject(request, env, key) {
  await env.STORAGE_BUCKET.delete(key);
  return new Response(null, { status: 204 });
}

export { router };
