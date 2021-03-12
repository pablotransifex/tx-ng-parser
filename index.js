import { join } from "path";
import { WorkspaceSymbols } from "ngast";
import * as ngHtmlParser from "angular-html-parser";
import * as fs from "fs";

function parseProjectComponents() {
  const config = join(
    "/home/pablo/repos/personal/tx-angular-native-sdk-sample",
    "tsconfig.json"
  );

  const workspace = new WorkspaceSymbols(config);
  const components = workspace.getAllComponents();

  components.forEach((cmp) => {
    cmp.node.members.forEach((member) => {
      member.decorators &&
        member.decorators.forEach((dec) => {
          let _str = "";
          dec.expression.arguments &&
            dec.expression.arguments.forEach((arg) => {
              if (arg.text) _str = arg.text;
              arg.properties &&
                arg.properties.forEach((prop) => {
                  console.log(
                    `str: ${_str} params: ${prop.symbol.escapedName}: ${prop.initializer.text}`
                  );
                });
            });
        });
    });
  });
}

function parseTemplateFile(template) {
  const TComponents = [];

  function parseTemplateNode(children) {
    if (children)
      children.forEach((child) => {
        if (child.name == "T") {
          TComponents.push(child);
        }
        if (child.name == "UT") {
          TComponents.push(child);
        }
        parseTemplateNode(child.children);
      });
  }

  fs.readFile(template, "utf8", function (err, data) {
    if (err) throw err;
    // console.log(data);

    const { rootNodes, errors } = ngHtmlParser.parse(data);

    parseTemplateNode(rootNodes);

    TComponents.forEach((c) => {
      let str = "",
        key = "";
      c.attrs &&
        c.attrs.forEach((a) => {
          if (a.name == "_str") {
            str = a.value;
          }
          if (a.name == "_key") {
            key = a.value;
          }
        });
      if (str && key) console.log(`${key}: ${str}`);
    });
  });
}

const template = join(
  "/home/pablo/repos/personal/tx-angular-native-sdk-sample/src/app/login",
  "login.component.html"
);
parseTemplateFile(template);
parseProjectComponents();
