// src/index.ts
import { fastify } from "fastify";

// src/settings/env.ts
import { z } from "zod";
var envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string().url(),
  WEB_URL: z.string().url()
});
var env = envSchema.parse(process.env);

// src/config/base-config.ts
var portSettings = {
  PORT: env.PORT,
  BASE_URL: `http://localhost:${env.PORT}`,
  WEB_URL: env.WEB_URL
};
var version = "0.0.1";

// src/config/plugins.ts
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";

// src/themes/style.ts
var style = `
@media (prefers-color-scheme: dark) {
  /* primary colors */

  .swagger-ui .topbar .download-url-wrapper .select-label select {
    border: 2px solid var(--swagger-color);
  }

  .swagger-ui .info .title small.version-stamp {
    background-color: var(--swagger-color);
  }

  .swagger-ui .info a {
    color: var(--link-color);
  }

  .swagger-ui .response-control-media-type--accept-controller select {
    border-color: var(--accept-header-color);
  }

  .swagger-ui .response-control-media-type__accept-message {
    color: var(--accept-header-color);
  }

  .swagger-ui .btn.authorize {
    color: var(--post-method-color);
  }

  .swagger-ui .btn.authorize {
    border-color: var(--post-method-color);
  }

  .swagger-ui .btn.authorize svg {
    fill: var(--post-method-color);
  }

  /* methods colors */
  /* http post */

  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: var(--post-method-color);
  }

  .swagger-ui .opblock.opblock-post .opblock-summary {
    border-color: var(--post-method-color);
  }

  .swagger-ui .opblock.opblock-post {
    background: var(--post-method-background-color);
    border-color: var(--post-method-color);
  }

  .swagger-ui
    .opblock.opblock-post
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--post-method-color);
  }

  /* http get */

  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: var(--get-method-color);
  }

  .swagger-ui .opblock.opblock-get .opblock-summary {
    border-color: var(--get-method-color);
  }

  .swagger-ui .opblock.opblock-get {
    background: var(--get-method-background-color);
    border-color: var(--get-method-color);
  }

  .swagger-ui .opblock.opblock-get .tab-header .tab-item.active h4 span::after {
    background: var(--get-method-color);
  }

  /* http head */

  .swagger-ui .opblock.opblock-head .opblock-summary-method {
    background: var(--head-method-color);
  }

  .swagger-ui .opblock.opblock-head .opblock-summary {
    border-color: var(--head-method-color);
  }

  .swagger-ui .opblock.opblock-head {
    background: var(--head-method-background-color);
    border-color: var(--head-method-color);
  }

  .swagger-ui
    .opblock.opblock-head
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--head-method-color);
  }

  /* http put */

  .swagger-ui .opblock.opblock-put .opblock-summary-method {
    background: var(--put-method-color);
  }

  .swagger-ui .opblock.opblock-put .opblock-summary {
    border-color: var(--put-method-color);
  }

  .swagger-ui .opblock.opblock-put {
    background: var(--put-method-background-color);
    border-color: var(--put-method-color);
  }

  .swagger-ui .opblock.opblock-put .tab-header .tab-item.active h4 span::after {
    background: var(--put-method-color);
  }

  /* http delete */

  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: var(--delete-method-color);
  }

  .swagger-ui .opblock.opblock-delete .opblock-summary {
    border-color: var(--delete-method-color);
  }

  .swagger-ui .opblock.opblock-delete {
    background: var(--delete-method-background-color);
    border-color: var(--delete-method-color);
  }

  .swagger-ui
    .opblock.opblock-delete
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--delete-method-color);
  }

  /* http options */

  .swagger-ui .opblock.opblock-options .opblock-summary-method {
    background: var(--options-method-color);
  }

  .swagger-ui .opblock.opblock-options .opblock-summary {
    border-color: var(--options-method-color);
  }

  .swagger-ui .opblock.opblock-options {
    background: var(--options-method-background-color);
    border-color: var(--options-method-color);
  }

  .swagger-ui
    .opblock.opblock-options
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--options-method-color);
  }

  /* http patch */

  .swagger-ui .opblock.opblock-patch .opblock-summary-method {
    background: var(--patch-method-color);
  }

  .swagger-ui .opblock.opblock-patchs .opblock-summary {
    border-color: var(--patch-method-color);
  }

  .swagger-ui .opblock.opblock-patch {
    background: var(--patch-method-background-color);
    border-color: var(--patch-method-color);
  }

  .swagger-ui
    .opblock.opblock-patch
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--patch-method-color);
  }

  /* blocks */
  body {
    background-color: var(--all-bg-color);
    color: white;
  }

  .swagger-ui .topbar {
    background-color: var(--header-bg-color);
  }

  .swagger-ui .scheme-container {
    background: var(--secondary-bg-color);
  }

  .swagger-ui section.models .model-container {
    background: var(--secondary-bg-color);
    border-radius: var(--innner-block-border-radius);
  }

  .swagger-ui select {
    background: var(--selecter-bg-color);
    border-radius: var(--block-border-radius);
    color: var(--primary-text-color);
  }

  .swagger-ui section.models {
    border: 1px solid var(--block-border-color);
    background-color: var(--block-bg-color);
  }

  .swagger-ui .opblock .opblock-section-header {
    background: var(--secondary-bg-color);
  }

  .swagger-ui .body-param__example {
    background-color: var(--block-bg-color) !important;
    border-radius: var(--block-border-radius) !important;
  }

  .swagger-ui .example {
    background-color: var(--block-bg-color) !important;
    border-radius: var(--block-border-radius) !important;
  }

  .swagger-ui .copy-to-clipboard {
    background: rgba(255, 255, 255, var(--icons-opacity));
    border-radius: var(--block-border-radius);
  }

  .swagger-ui .opblock .opblock-summary-method {
    border-radius: var(--innner-block-border-radius);
  }

  .swagger-ui input[type="email"],
  .swagger-ui input[type="file"],
  .swagger-ui input[type="password"],
  .swagger-ui input[type="search"],
  .swagger-ui input[type="text"],
  .swagger-ui textarea {
    background: var(--secondary-bg-color);
    border: 1px solid var(--block-border-color);
    border-radius: var(--block-border-radius);
    color: var(--primary-text-color);
    outline: none;
  }

  .swagger-ui .dialog-ux .modal-ux-header {
    border-bottom: 1px solid var(--block-border-color);
  }

  .swagger-ui .btn {
    border: 2px solid var(--block-border-color);
    border-radius: var(--block-border-radius);
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux {
    background: var(--block-bg-color);
    border: 1px solid var(--block-border-color);
    border-radius: var(--block-border-radius);
  }

  .swagger-ui .auth-btn-wrapper {
    justify-content: left;
  }

  .swagger-ui .opblock-tag {
    border-bottom: 1px solid var(--block-border-color);
  }

  .swagger-ui section.models.is-open h4 {
    border-bottom: 1px solid var(--block-border-color);
  }

  .swagger-ui .opblock {
    border-radius: var(--block-border-radius);
  }

  .swagger-ui section.models {
    border-radius: var(--block-border-radius);
  }

  /* button white outline fix */

  .swagger-ui .model-box-control:focus,
  .swagger-ui .models-control:focus,
  .swagger-ui .opblock-summary-control:focus {
    outline: none;
  }

  /* icons */

  .swagger-ui .model-toggle::after {
    opacity: var(--icons-opacity);
    filter: var(--black-icons-filter);
  }

  .swagger-ui svg:not(:root) {
    fill: var(--primary-icon-color);
  }

  .swagger-ui .opblock-summary-control svg:not(:root) {
    opacity: var(--secondary-icon-opacity);
  }

  /* text */

  .swagger-ui {
    color: var(--primary-text-color);
  }

  .swagger-ui .info .title {
    color: var(--primary-text-color);
  }

  .swagger-ui a.nostyle {
    color: var(--primary-text-color);
  }

  .swagger-ui .model-title {
    color: var(--primary-text-color);
  }

  .swagger-ui .models-control {
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux-header h3 {
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux-content h4 {
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux-content p {
    color: var(--secondary-text-color);
  }

  .swagger-ui label {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock .opblock-section-header h4 {
    color: var(--primary-text-color);
  }

  .swagger-ui .tab li button.tablinks {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .opblock-external-docs-wrapper p,
  .swagger-ui .opblock-title_normal p {
    color: var(--primary-text-color);
  }

  .swagger-ui table thead tr td,
  .swagger-ui table thead tr th {
    border-bottom: 1px solid var(--block-border-color);
    color: var(--primary-text-color);
  }

  .swagger-ui .response-col_status {
    color: var(--primary-text-color);
  }

  .swagger-ui .response-col_links {
    color: var(--secondary-text-color);
  }

  .swagger-ui .parameter__name {
    color: var(--primary-text-color);
  }

  .swagger-ui .parameter__type {
    color: var(--secondary-text-color);
  }

  .swagger-ui .prop-format {
    color: var(--secondary-text-color);
  }

  .swagger-ui .opblock-tag {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock .opblock-summary-operation-id,
  .swagger-ui .opblock .opblock-summary-path,
  .swagger-ui .opblock .opblock-summary-path__deprecated {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock .opblock-summary-description {
    color: var(--secondary-text-color);
  }

  .swagger-ui .info li,
  .swagger-ui .info p,
  .swagger-ui .info table {
    color: var(--secondary-text-color);
  }

  .swagger-ui .model {
    color: var(--secondary-text-color);
  }
}

:root {
  /* primary colors */
  --swagger-color: #86ff54;
  --link-color: #86e1f4;
  --accept-header-color: #34a05e;

  /* methods colors */
  --post-method-color: #5bdc3e;
  --post-method-background-color: rgba(0, 0, 0, 0);
  --get-method-color: #51e3cb;
  --get-method-background-color: rgba(0, 0, 0, 0);
  --head-method-color: #f87fbd;
  --head-method-background-color: rgba(0, 0, 0, 0);
  --put-method-color: #e0a44e;
  --put-method-background-color: rgba(0, 0, 0, 0);
  --delete-method-color: #9680ff;
  --delete-method-background-color: rgba(0, 0, 0, 0);
  --options-method-color: rgb(64, 145, 225);
  --options-method-background-color: rgba(0, 0, 0, 0);
  --patch-method-color: rgb(229, 178, 38);
  --patch-method-background-color: rgba(0, 0, 0, 0);

  /* background */
  --all-bg-color: #282a36;
  --secondary-bg-color: #282a35;
  --header-bg-color: #3a3d4c;
  --block-bg-color: #414450;
  --selecter-bg-color: #3a3d4c;

  /* text */
  --primary-text-color: rgba(255, 255, 255, 1);
  --secondary-text-color: rgba(193, 192, 192, 1);

  /* border */
  --block-border-color: rgba(255, 255, 255, 0.08);
  --block-border-radius: 12px;
  --innner-block-border-radius: 8px;

  /* icons */
  --primary-icon-color: #ffffff;
  --icons-opacity: 0;
  --secondary-icon-opacity: 0.6;
  --black-icons-filter: invert(1);
}

`;

// src/config/logger.ts
import pc from "picocolors";
async function logger(app2) {
  let startTime;
  app2.addHook("onRequest", (request, reply, done) => {
    startTime = Date.now();
    done();
  });
  app2.addHook("onResponse", (request, reply, done) => {
    const responseTime = Date.now() - startTime;
    const statusCode = reply.statusCode;
    let statusColor = pc.green;
    switch (true) {
      case (statusCode >= 300 /* MULTIPLE_CHOICES */ && statusCode < 400 /* BAD_REQUEST */):
        statusColor = pc.yellow;
        break;
      case statusCode >= 400 /* BAD_REQUEST */:
        statusColor = pc.red;
        break;
    }
    if (!request.url.includes("/docs") && !request.url.includes("/favicon.ico")) {
      console.info(
        pc.yellow("Response: ") + statusColor(
          `${request.method} ${request.url} - ${statusCode} - ${responseTime}ms`
        )
      );
    }
    done();
  });
}

// src/config/plugins.ts
import fastifyMultipart from "fastify-multipart";
function registerPlugins(app2) {
  app2.register(fastifyCors, {
    origin: [portSettings.BASE_URL, portSettings.WEB_URL]
  });
  app2.register(fastifyMultipart);
  app2.register(fastifySwagger, {
    openapi: {
      info: {
        title: "ProcessBurn API",
        version
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    transform: jsonSchemaTransform
  });
  app2.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    theme: {
      css: [{ filename: "theme.css", content: style }]
    }
  });
  logger(app2);
  app2.setSerializerCompiler(serializerCompiler);
  app2.setValidatorCompiler(validatorCompiler);
}

// src/utils/registerPrefix.ts
var registerPrefix = (routes3, prefix) => {
  return async (app2) => {
    for (const route of routes3) {
      app2.register(route, { prefix });
    }
  };
};

// src/routes/upload.ts
import z2 from "zod";

// src/aws/uploadToS3.ts
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// src/aws/s3.ts
import { S3Client } from "@aws-sdk/client-s3";
var s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// src/aws/uploadToS3.ts
import path from "path";
async function uploadToS3(fileBuffer, fileName, mimeType, folder) {
  const bucketName = process.env.S3_BUCKET_NAME;
  const fileExtension = path.extname(fileName);
  const newFileName = `${uuidv4()}${fileExtension}`;
  const cdnUrl = process.env.CLOUD_FRONT_CDN;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: `${folder}/${newFileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "private"
  });
  await s3.send(command);
  return {
    url: `${cdnUrl}/${folder}/${newFileName}`,
    originalFileName: fileName
  };
}

// src/errors/custom/CustomError.ts
var CustomError = class extends Error {
  statusCode;
  code;
  constructor(message, statusCode = 500, code = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/utils/catchError.ts
async function catchError(promise, customError) {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    const error = err instanceof CustomError ? err : customError ? Object.assign(customError, { message: String(err) }) : new CustomError(String(err));
    return [error, null];
  }
}

// src/routes/upload.ts
var uploadRoute = async (app2) => {
  app2.post(
    "/upload",
    {
      schema: {
        summary: "Upload de arquivo para S3",
        tags: ["Upload"],
        operationId: "uploadFile",
        consumes: ["multipart/form-data"],
        body: z2.object({
          file: z2.any().refine((file) => !!file, {
            message: "Arquivo \xE9 obrigat\xF3rio"
          })
        }),
        response: {
          [200 /* OK */]: z2.object({
            url: z2.string().url(),
            originalFileName: z2.string()
          }),
          [500 /* INTERNAL_SERVER_ERROR */]: z2.object({
            message: z2.string()
          })
        }
      }
    },
    async (request, reply) => {
      const req = request;
      const data = await req.file();
      if (!data) {
        return reply.status(400).send({ message: "Nenhum arquivo enviado" });
      }
      const chunks = [];
      for await (const chunk of data.file) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const folder = "uploads";
      const [error, uploadResult] = await catchError(
        uploadToS3(buffer, data.filename, data.mimetype, folder)
      );
      if (error) {
        return reply.status(500 /* INTERNAL_SERVER_ERROR */).send({
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(uploadResult);
    }
  );
};

// src/routes/example/hello-world.ts
import z3 from "zod";

// src/controllers/ExampleController.ts
var ExampleController = class {
  constructor(error) {
    this.error = error;
  }
  async getHelloWorld() {
    if (this.error) {
      throw new CustomError("Erro de exemplo", 500, "EXAMPLE_ERROR");
    }
    return "Hello, world!";
  }
};

// src/routes/example/hello-world.ts
var helloWorldRoute = async (app2) => {
  app2.get(
    "/hello-world",
    {
      schema: {
        summary: "Example route",
        tags: ["Example"],
        operationId: "helloWorld",
        // body: z.object({}),
        // params: z.object({}),
        // query: z.object({}),
        response: {
          [200 /* OK */]: z3.object({
            message: z3.string()
          }),
          [500 /* INTERNAL_SERVER_ERROR */]: z3.object({
            message: z3.string()
          })
        }
      }
    },
    async (request, reply) => {
      const exampleController = new ExampleController(false);
      const [error, data] = await catchError(exampleController.getHelloWorld());
      if (error) {
        return reply.status(error.statusCode).send({
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({
        message: data
      });
    }
  );
};

// src/routes/example/index.ts
var routes = [helloWorldRoute, uploadRoute];
var exampleRoute = "/example";
var exampleRoutes = registerPrefix(routes, exampleRoute);

// src/routes/index.ts
var routes2 = [exampleRoutes];

// src/config/routes.ts
function registerRoutes(app2) {
  for (const route of routes2) {
    app2.register(route);
  }
  app2.setNotFoundHandler((req, res) => {
    res.status(404).send({
      message: "P\xE1gina n\xE3o encontrada. Verifique a URL e tente novamente."
    });
  });
}

// src/index.ts
var app = fastify().withTypeProvider();
registerPlugins(app);
registerRoutes(app);
app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on port ${portSettings.PORT}`);
  console.log(`See the documentation on ${portSettings.BASE_URL}/docs`);
});
