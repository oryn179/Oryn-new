
export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

const ADMIN_USERS = [
  "Oryn179",
  "Belexmiky2023",
  "OrynAdmin"
];

const ADMIN_IDS = [
  123456789
];

async function getGitHubUser(accessToken: string) {
  try {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'User-Agent': 'OrynServer-App',
        'Accept': 'application/json'
      }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function resolveRole(userData: any): 'admin' | 'user' {
  if (!userData) return 'user';
  const login = userData.login;
  const id = userData.id;
  const isUsernameAdmin = ADMIN_USERS.includes(login);
  const isIdAdmin = ADMIN_IDS.includes(id);
  return (isUsernameAdmin || isIdAdmin) ? 'admin' : 'user';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (url.pathname === '/api/auth' && request.method === 'POST') {
      try {
        const body = await request.json() as { code: string; redirect_uri?: string };
        const { code, redirect_uri } = body;

        if (!code) {
          return new Response(JSON.stringify({ error: 'Code required' }), { status: 400, headers });
        }

        const tokenExchangeBody: any = {
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code
        };
        
        // redirect_uri must match the one used in the authorize step
        if (redirect_uri) {
          tokenExchangeBody.redirect_uri = redirect_uri;
        }

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(tokenExchangeBody)
        });

        const tokenData: any = await tokenResponse.json();
        if (tokenData.error) {
          return new Response(JSON.stringify({ error: tokenData.error_description || tokenData.error }), { 
            status: 400, 
            headers 
          });
        }

        const userData: any = await getGitHubUser(tokenData.access_token);
        if (!userData) {
          return new Response(JSON.stringify({ error: 'Failed to fetch user profile from GitHub' }), { 
            status: 401, 
            headers 
          });
        }

        const role = resolveRole(userData);
        const user = {
          id: userData.id.toString(),
          username: userData.login,
          avatar_url: userData.avatar_url,
          role
        };

        return new Response(JSON.stringify({ user, token: tokenData.access_token }), { headers });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
      }
    }

    if (url.pathname === '/api/session' && request.method === 'GET') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
      }

      const token = authHeader.split(' ')[1];
      const userData: any = await getGitHubUser(token);
      
      if (!userData) {
        return new Response(JSON.stringify({ error: 'Invalid or expired session' }), { status: 401, headers });
      }

      const role = resolveRole(userData);
      const user = {
        id: userData.id.toString(),
        username: userData.login,
        avatar_url: userData.avatar_url,
        role
      };

      return new Response(JSON.stringify({ user }), { headers });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
  }
};
