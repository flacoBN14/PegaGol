#!/usr/bin/env node
/**
 * Build script for server - sets DATABASE_URL if not present
 * and runs prisma generate, migrate deploy, and seed.
 */
const { execSync } = require("child_process");
const path = require("path");

const serverDir = path.join(__dirname, "server");

// Ensure DATABASE_URL is set for prisma
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const run = (cmd) => {
  console.log(`> ${cmd}`);
  execSync(cmd, { cwd: serverDir, stdio: "inherit", env: process.env });
};

run("npx prisma generate");
run("npx prisma migrate deploy");
run("node prisma/seed.js");
