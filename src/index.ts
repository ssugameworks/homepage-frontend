import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/roadmap": {
      async GET() {
        console.log("📥 GET /api/roadmap - Starting request");
        const token = process.env.NOTION_TOKEN;
        const databaseId = process.env.NOTION_DATABASE_ID;

        if (!token || !databaseId) {
          return Response.json({ 
            error: "Configuration Error", 
            message: "Missing NOTION_TOKEN or NOTION_DATABASE_ID" 
          }, { status: 500 });
        }

        try {
          // 정렬 컬럼명이 다를 수 있으므로 정렬은 일단 선택적 처리
          const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Notion-Version": "2022-06-28",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Date 컬럼이 확실히 있다면 정렬 활성화 가능
              // sorts: [{ property: "Date", direction: "ascending" }]
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            console.error("❌ Notion API Error Response:", data);
            return Response.json({ error: "Notion API Error", message: data.message }, { status: response.status });
          }

          if (!data.results || data.results.length === 0) {
            return Response.json([]);
          }

          const events = data.results.map((page: any) => {
            const props = page.properties;
            
            // 1. Find Date (Flexible name)
            const dateKey = Object.keys(props).find(k => k.toLowerCase() === "date" || k === "날짜" || k === "일시") || "Date";
            const dateRange = props[dateKey]?.date;
            const start = dateRange?.start || dayjs().format("YYYY-MM-DD");
            const end = dateRange?.end || start;

            // 2. Find Category (Flexible name, assume Select type)
            const catKey = Object.keys(props).find(k => k.toLowerCase() === "category" || k === "구분" || k === "카테고리") || "Category";
            const category = props[catKey]?.select?.name?.toLowerCase() || "social";

            // 3. Find Name (Flexible name, assume Title type)
            const nameKey = Object.keys(props).find(k => k.toLowerCase() === "name" || k === "이름" || k === "제목") || "Name";
            const title = props[nameKey]?.title?.[0]?.plain_text || "Untitled Event";

            return {
              id: page.id,
              category,
              title,
              start,
              end,
            };
          }).sort((a: any, b: any) => a.start.localeCompare(b.start)); // 클라이언트측 정렬로 안전하게 처리

          console.log(`✅ Successfully fetched ${events.length} events from Notion`);
          return Response.json(events);
        } catch (error: any) {
          console.error("❌ Server Error:", error);
          return Response.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
        }
      },
    },

    "/api/hello": {
      async GET() {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT() {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
