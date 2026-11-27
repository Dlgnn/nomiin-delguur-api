
import fs from "node:fs";
import yaml from "yaml";
import swaggerSpec from "../src/swagger.js";

const yamlDocument = yaml.stringify(swaggerSpec);

fs.writeFileSync(
  "openapi.yaml",
  yamlDocument,
  "utf8"
);

console.log("openapi.yaml generated successfully.");
