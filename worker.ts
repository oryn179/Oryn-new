
export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}

// SECURE ADMIN ALLOW-LIST
const ADMIN_USERS = [
  "Oryn179",
  "Belexmiky2023",
  "OrynAdmin"
];

const ADMIN_IDS = [
  123456789 // Example ID
];

async function getGitHubUser(accessToken: string) {
  const response = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'OrynServer-App',
      'Accept': 'application/json'
    }
  });
  if (!response.ok) return null;
  return await response.json();
}

function resolveRole(userData: any): 'admin' | 'user' {
  if (!userData) return 'user';
  const isUsernameAdmin = ADMIN_USERS.includes(userData.login);
  const isIdAdmin = ADMIN_IDS.includes(userData.id);
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

    // AUTH: EXCHANGE CODE FOR TOKEN
    if (url.pathname === '/api/auth' && request.method === 'POST') {
      try {
        const { code } = await request.json() as { code: string };
        if (!code) return new Response('Code required', { status: 400, headers });

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code
          })
        });

        const tokenData: any = await tokenResponse.json();
        if (tokenData.error) return new Response(JSON.stringify(tokenData), { status: 400, headers });

        const userData: any = await getGitHubUser(tokenData.access_token);
        if (!userData) return new Response('Failed to fetch user', { status: 401, headers });

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

    // SESSION: VALIDATE TOKEN AND RETURN SECURE ROLE
    if (url.pathname === '/api/session' && request.method === 'GET') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response('Unauthorized', { status: 401, headers });
      }

      const token = authHeader.split(' ')[1];
      const userData: any = await getGitHubUser(token);
      
      if (!userData) {
        return new Response('Invalid token', { status: 401, headers });
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

    return new Response('Not found', { status: 404, headers });
  }
};
