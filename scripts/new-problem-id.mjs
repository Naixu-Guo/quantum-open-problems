#!/usr/bin/env node
// Print a fresh stable problem ID: "op_" followed by 16 hexadecimal digits.
import { randomBytes } from "node:crypto";
console.log(`op_${randomBytes(8).toString("hex")}`);
