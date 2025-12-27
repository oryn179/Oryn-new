
export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  AUTH_SECRET: string; // Used for signing session tokens
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle Auth API
    if (url.pathname === '/api/auth' && request.method === 'POST') {
      const { code } = await request.json();

      if (!code) {
        return new Response('Code required', { status: 400 });
      }

      try {
        // 1. Exchange code for access token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code: code
          })
        });

        const tokenData: any = await tokenResponse.json();

        if (tokenData.error) {
          return new Response(JSON.stringify(tokenData), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // 2. Get user info from GitHub
        const userResponse = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'User-Agent': 'OrynServer-App'
          }
        });

        const userData: any = await userResponse.json();

        // 3. Construct our app user object
        const user = {
          id: userData.id.toString(),
          username: userData.login,
          avatar_url: userData.avatar_url,
          role: userData.login === 'Oryn179' ? 'admin' : 'user' // Logic for admin
        };

        return new Response(JSON.stringify({ user, token: tokenData.access_token }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        return new Response(err.message, { status: 500 });
      }
    }

    // Default 404
    return new Response('Not found', { status: 404 });
  }
};
