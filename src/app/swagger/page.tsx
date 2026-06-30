'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    SwaggerUIBundle?: (config: Record<string, unknown>) => void;
  }
}

export default function SwaggerPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js';
    script.onload = () => {
      window.SwaggerUIBundle?.({
        url: '/api/v1/openapi',
        dom_id: '#swagger-ui',
        deepLinking: true,
      });
    };
    document.body.appendChild(script);

    return () => {
      link.remove();
      script.remove();
    };
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Swagger UI — TechStore API</h1>
      <p className="text-[var(--text-muted)] mb-6">
        Интерактивная документация OpenAPI. Используйте <strong className="text-[var(--text)]">Try it out</strong> для
        отправки запросов. Практика написания спецификаций — в разделе{' '}
        <a href="/practice" className="text-[var(--accent)] hover:underline">
          Практика → Swagger
        </a>
        .
      </p>
      <div
        id="swagger-ui"
        ref={containerRef}
        className="swagger-wrap rounded-xl overflow-hidden border border-[var(--border)] bg-white min-h-[600px]"
      />
    </div>
  );
}
