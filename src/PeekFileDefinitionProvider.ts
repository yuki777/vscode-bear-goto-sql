import * as vscode from "vscode";

export default class PeekFileDefinitionProvider implements vscode.DefinitionProvider {
  targetFileExtensions: string[] = [];
  sqlPaths: string[] = [];

  constructor(targetFileExtensions: string[] = [], sqlPaths: string[] = []) {
    this.targetFileExtensions = targetFileExtensions;
    this.sqlPaths = sqlPaths;
  }

  getResourceName(document: vscode.TextDocument, position: vscode.Position): String[] {
    const range = document.getWordRangeAtPosition(
      position,
      /((@Named|@Query|#\[DbQuery)\((id=|id:)?['"]([^'"]*?)['"])/,
    );
    const selectedText = document.getText(range);
    const resourceParts = selectedText.match(/(@Named|@Query|#\[DbQuery)\((id=|id:)?['"]([^'"]*?)['"]/);
    if (resourceParts === null) {
      return [];
    }

    const type = resourceParts[1];
    const possibleFileNames: String[] = [];

    if (type === "@Named") {
      const sqlFileBaseNames = resourceParts[2].split(",").map((x) => x.split("=")[1]);
      let file = "";
      sqlFileBaseNames.forEach((sqlFileBaseName) => {
        this.sqlPaths.forEach((sqlPath) => {
          this.targetFileExtensions.forEach((ext) => {
            file = `${sqlPath}/${sqlFileBaseName}`;
            possibleFileNames.push(file + ext);
          });
        });
      });
    } else {
      const sqlFileBaseName = resourceParts[3];
      let file = "";
      this.sqlPaths.forEach((sqlPath) => {
        this.targetFileExtensions.forEach((ext) => {
          file = `${sqlPath}/${sqlFileBaseName}`;
          possibleFileNames.push(file + ext);
        });
      });
    }

    return possibleFileNames;
  }

  searchFilePath(fileName: String): Thenable<vscode.Uri[]> {
    return vscode.workspace.findFiles(`**/${fileName}`, "**/vendor"); // Returns promise
  }

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): Promise<any[] | vscode.Location | vscode.Location[] | undefined> {
    const resourceNames = this.getResourceName(document, position);
    const searchPathActions = resourceNames.map(this.searchFilePath);
    const searchPromises = Promise.all(searchPathActions); // pass array of promises
    const paths = await searchPromises;

    // @ts-ignore
    const filePaths: any[] = [].concat.apply([], paths);
    if (!filePaths.length) {
      return undefined;
    }

    const allPaths: any[] = [];
    filePaths.forEach((filePath) => {
      allPaths.push(new vscode.Location(vscode.Uri.file(filePath.path), new vscode.Position(0, 0)));
    });

    return allPaths;
  }
}
