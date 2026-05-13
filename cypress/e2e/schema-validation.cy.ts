// SPDX-License-Identifier: Apache-2.0
/*
Copyright (C) 2024 The Falco Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import "cypress-file-upload";

// Verifies that falcoSchema.json accepts the constructs added in #3432:
//   - required_plugin_versions top-level directive
//   - override: grammar on rules, macros, and lists
//   - source field on rules
//   - exceptions field on rules
//
// Schema validation in Monaco is async and not directly observable via DOM,
// so these tests confirm that importing each fixture loads the editor without
// a JS error and without the editor remaining empty — confirming the YAML is
// structurally accepted by the import pipeline.

describe("Schema validation — override, source, exceptions, plugin versions", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".monaco-editor").should("exist");
  });

  it("imports a file using override, source, exceptions, and required_plugin_versions without error", () => {
    cy.get("button:contains('Import Yaml')").should("be.visible").click();

    cy.get("input[type='file']").as("fileUpload");
    cy.fixture("override-rule.yaml").then((fileContent) => {
      cy.get("@fileUpload").attachFile({
        fileContent: fileContent.toString(),
        fileName: "override-rule.yaml",
        mimeType: "application/yaml",
      });
    });

    cy.get(".monaco-editor")
      .should("be.visible")
      .then(($editor) => {
        expect($editor.text()).not.to.be.empty;
      });
  });
});
