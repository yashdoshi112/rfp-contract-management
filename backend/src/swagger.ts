// @ts-nocheck
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const spec = {
  openapi: "3.0.0",
  info: { title: "RFP Contract Management API", version: "1.0.0" },
  servers: [{ url: "/api" }],
  components: {
    securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/auth/register": { post: { summary: "Register" } },
    "/auth/login": { post: { summary: "Login" } },
    "/rfps": { get: { summary: "List published RFPs" }, post: { summary: "Create RFP" } },
    "/rfps/mine": { get: { summary: "List buyer-owned RFPs" } },
    "/rfps/{id}": { get: { summary: "Get RFP" }, put: { summary: "Update RFP" } },
    "/rfps/{id}/publish": { post: { summary: "Publish RFP" } },
    "/rfps/{id}/under-review": { post: { summary: "Mark under review" } },
    "/rfps/{id}/approve": { post: { summary: "Approve RFP" } },
    "/rfps/{id}/reject": { post: { summary: "Reject RFP" } },
    "/rfps/{id}/responses": { get: { summary: "List responses (buyer)" }, post: { summary: "Submit response (supplier)" } },
    "/my/responses": { get: { summary: "Supplier's own responses" } }
  }
};

export function setupSwagger(app: Express) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec as any));
}

