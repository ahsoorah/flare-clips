export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const origin = request.headers.get("Origin");
    let allowedOrigin = "https://manager.yourdomain.com";
    if (origin === "http://localhost:5173" || origin === "http://localhost:5174") {
      allowedOrigin = origin;
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const apiKey = request.headers.get("x-api-key");
    if (apiKey !== env.API_KEY) {
      return new Response("unauthorized", { status: 401, headers: corsHeaders });
    }

    if (url.pathname === "/api/clips" && request.method === "GET") {
      const listed = await env.BUCKET.list();
      const clips = listed.objects.map(obj => ({
        name: obj.key,
        size: obj.size,
        uploaded: obj.uploaded,
        url: `https://clips.yourdomain.com/${obj.key}`
      }));
      return Response.json(clips, { headers: corsHeaders });
    }

    if (url.pathname.startsWith("/api/clips/") && request.method === "DELETE") {
      // security measure: decode the url and strip out any path traversal attempts (slashes)
      let rawFilename = url.pathname.split("/api/clips/")[1];
      if (!rawFilename) return new Response("missing filename", { status: 400 });
      
      const filename = decodeURIComponent(rawFilename).replace(/[\/\\]/g, "");

      await env.BUCKET.delete(filename);
      return Response.json({ success: true, deleted: filename }, { headers: corsHeaders });
    }

    return new Response("not found", { status: 404, headers: corsHeaders });
  }
};
