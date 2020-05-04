import * as path from 'path';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('shex.start', () => {
			ShExPanel.createOrShow(context.extensionPath);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('turtle.start', () => {
			TurtlePanel.createOrShow(context.extensionPath);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('shapeMap.start', () => {
			ShapeMapPanel.createOrShow(context.extensionPath);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('validation.start', () => {
			ValidationPanel.createOrShow(context.extensionPath);
		})
	);




	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(ShExPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				ShExPanel.revive(webviewPanel, context.extensionPath);
			}
		});
	}
}


class ShExPanel {

	public static currentPanel: ShExPanel | undefined;

	public static readonly viewType = 'shex';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (ShExPanel.currentPanel) {
			ShExPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ShExPanel.viewType,
			'ShEx Editor',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
			}
		);

		ShExPanel.currentPanel = new ShExPanel(panel, extensionPath);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
		ShExPanel.currentPanel = new ShExPanel(panel, extensionPath);
	}

	private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		ShExPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
		this._panel.title = 'ShEx Editor';
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}



	private _getHtmlForWebview(webview: vscode.Webview) {
		// Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yashe.bundled.min.js')
		);

		const cssPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yashe.min.css')
		);

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
		const cssUri = webview.asWebviewUri(cssPathOnDisk);

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>YASHE</title>

					<!--EDITOR STYLES-->
					<link nonce="${nonce}" href="${cssUri}" rel="stylesheet" type="text/css" />

					</head>
					<body>

						<div id="yasheContainer"></div>
					
						<script nonce="${nonce}" src="${scriptUri}"></script>

						<script type="text/javascript">
							var yashe = YASHE(document.getElementById('yasheContainer'));
							yashe.setOption("fullScreen", true);
						</script>

					</body>
					</html>`;
	}
}



class TurtlePanel {

	public static currentPanel: TurtlePanel | undefined;

	public static readonly viewType = 'turtle';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (TurtlePanel.currentPanel) {
			TurtlePanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			TurtlePanel.viewType,
			'Turtle Editor',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
			}
		);

		TurtlePanel.currentPanel = new TurtlePanel(panel, extensionPath);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
		TurtlePanel.currentPanel = new TurtlePanel(panel, extensionPath);
	}

	private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		TurtlePanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
		this._panel.title = 'Turtle Editor';
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}



	private _getHtmlForWebview(webview: vscode.Webview) {
		// Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yate.bundled.min.js')
		);

		const cssPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yate.min.css')
		);

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
		const cssUri = webview.asWebviewUri(cssPathOnDisk);

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>YASHE</title>

					<!--EDITOR STYLES-->
					<link nonce="${nonce}" href="${cssUri}" rel="stylesheet" type="text/css" />

					</head>
					<body>

						<div id="yateContainer"></div>
					
						<script nonce="${nonce}" src="${scriptUri}"></script>

						<script type="text/javascript">
							var yate = YATE(document.getElementById('yateContainer'));
							yate.setOption("fullScreen", true);
						</script>

					</body>
					</html>`;
	}
}


class ShapeMapPanel {

	public static currentPanel: ShapeMapPanel | undefined;

	public static readonly viewType = 'shapeMap';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (ShapeMapPanel.currentPanel) {
			ShapeMapPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ShapeMapPanel.viewType,
			'ShapeMap Editor',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
			}
		);

		ShapeMapPanel.currentPanel = new ShapeMapPanel(panel, extensionPath);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
		ShapeMapPanel.currentPanel = new ShapeMapPanel(panel, extensionPath);
	}

	private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		ShapeMapPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
		this._panel.title = 'ShapeMap Editor';
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}



	private _getHtmlForWebview(webview: vscode.Webview) {
		// Local path to main script run in the webview
		const scriptPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yasme.bundled.min.js')
		);

		const cssPathOnDisk = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yasme.min.css')
		);

		// And the uri we use to load this script in the webview
		const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
		const cssUri = webview.asWebviewUri(cssPathOnDisk);

		// Use a nonce to whitelist which scripts can be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>YASHE</title>

					<!--EDITOR STYLES-->
					<link nonce="${nonce}" href="${cssUri}" rel="stylesheet" type="text/css" />

					</head>
					<body>

						<div id="yasmeContainer"></div>
					
						<script nonce="${nonce}" src="${scriptUri}"></script>

						<script type="text/javascript">
							var yasme = YASME(document.getElementById('yasmeContainer'));
							yasme.setOption("fullScreen", true);
						</script>

					</body>
					</html>`;
	}
}


class ValidationPanel {

	public static currentPanel: ValidationPanel | undefined;

	public static readonly viewType = 'validation';

	private readonly _panel: vscode.WebviewPanel;
	private readonly _extensionPath: string;
	private _disposables: vscode.Disposable[] = [];

	public static createOrShow(extensionPath: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		// If we already have a panel, show it.
		if (ValidationPanel.currentPanel) {
			ValidationPanel.currentPanel._panel.reveal(column);
			return;
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			ValidationPanel.viewType,
			'Validation',
			column || vscode.ViewColumn.One,
			{
				// Enable javascript in the webview
				enableScripts: true,

				// And restrict the webview to only loading content from our extension's `media` directory.
				localResourceRoots: [vscode.Uri.file(path.join(extensionPath, 'media'))]
			}
		);

		ValidationPanel.currentPanel = new ValidationPanel(panel, extensionPath);
	}

	public static revive(panel: vscode.WebviewPanel, extensionPath: string) {
		ValidationPanel.currentPanel = new ValidationPanel(panel, extensionPath);
	}

	private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
		this._panel = panel;
		this._extensionPath = extensionPath;

		// Set the webview's initial html content
		this._update();

		// Listen for when the panel is disposed
		// This happens when the user closes the panel or when the panel is closed programatically
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Update the content based on view changes
		this._panel.onDidChangeViewState(
			e => {
				if (this._panel.visible) {
					this._update();
				}
			},
			null,
			this._disposables
		);

		// Handle messages from the webview
		this._panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'alert':
						vscode.window.showErrorMessage(message.text);
						return;
				}
			},
			null,
			this._disposables
		);
	}

	public dispose() {
		ValidationPanel.currentPanel = undefined;

		// Clean up our resources
		this._panel.dispose();

		while (this._disposables.length) {
			const x = this._disposables.pop();
			if (x) {
				x.dispose();
			}
		}
	}

	private _update() {
		const webview = this._panel.webview;
		this._panel.title = 'Validation';
		this._panel.webview.html = this._getHtmlForWebview(webview);
	}



	private _getHtmlForWebview(webview: vscode.Webview) {


		const yasheScriptPath= vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yashe.bundled.min.js')
		);

		const yateScriptPath= vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yate.bundled.min.js')
		);

		const yasmeScriptPath= vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yasme.bundled.min.js')
		);

		const mainScriptPath= vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'main.js')
		);

		
		const yasheCSSPath = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yashe.min.css')
		);

		const yateCSSPath = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yate.min.css')
		);

		const yasmeCSSPath = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'yasme.min.css')
		);

		const stylePath = vscode.Uri.file(
			path.join(this._extensionPath, 'media', 'style.css')
		);

		


		const yasheScriptUri = webview.asWebviewUri(yasheScriptPath);
		const yateScriptUri = webview.asWebviewUri(yateScriptPath);
		const yasmeScriptUri = webview.asWebviewUri(yasmeScriptPath);
		const mainScriptUri = webview.asWebviewUri(mainScriptPath);

		const yasheCSSUri = webview.asWebviewUri(yasheCSSPath);
		const yateCSSUri = webview.asWebviewUri(yateCSSPath);
		const yasmeCSSUri = webview.asWebviewUri(yasmeCSSPath);
		const styleUri = webview.asWebviewUri(stylePath);


		const nonce = getNonce();

		return `<!DOCTYPE html>
					<html lang="en">
					<head>
						<meta charset="utf-8">
						<meta http-equiv="X-UA-Compatible" content="IE=edge">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>YASHE</title>

					<!--EDITOR STYLES-->
					<link nonce="${nonce}" href="${yasheCSSUri}" rel="stylesheet" type="text/css" />
					<link nonce="${nonce}" href="${yateCSSUri}" rel="stylesheet" type="text/css" />
					<link nonce="${nonce}" href="${yasmeCSSUri}" rel="stylesheet" type="text/css" />

					<!--Bootstrap-->
					<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

					<!--Bootstrap-->
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
					<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
					<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
					<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

					<!--MATERIAL-->
					<link href="https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css" rel="stylesheet">
					<script src="https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js"></script>
					<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
					rel="stylesheet">

					<link nonce="${nonce}" href="${styleUri}" rel="stylesheet" type="text/css" />

					</head>
					<body>

					
					<div class="globalContainer">
						<div class="topContainer">
						<div id="yateContainer"></div>
						<div id="yasheContainer"></div>
						</div>
						<div id="yasmeContainer"></div>
						<div id="validateZone" class="validate">
						<div class="validateHeader">
							<h1>Validate</h1>
							<button class="validateBtn" onclick="sendToJava();">
							<span class="material-icons arrow">
							play_arrow
							</span>
							</button>
						</div>

						<table id="validateTable" class="table">
							<thead class="thead-dark">
							<tr>
								<th scope="col">Id</th>
								<th scope="col">Node</th>
								<th scope="col">Shape</th>
								<th scope="col">Details</th>
							</tr>
							</thead>
							<tbody>
							<tr>
								<th scope="row">1</th>
								<td>Mark</td>
								<td>Otto</td>
								<td>@mdo</td>
							</tr>
							<tr>
								<th scope="row">2</th>
								<td>Jacob</td>
								<td>Thornton</td>
								<td>@fat</td>
							</tr>
							<tr>
								<th scope="row">3</th>
								<td>Larry</td>
								<td>the Bird</td>
								<td>@twitter</td>
							</tr>
							</tbody>
						</table>
						</div>
					</div>

					
					
					<!--EDITOR SCRIPTS-->
					<script nonce="${nonce}" src="${yasheScriptUri}"></script>
					<script nonce="${nonce}" src="${yateScriptUri}"></script>
					<script nonce="${nonce}" src="${yasmeScriptUri}"></script>
					<script snonce="${nonce}" src="${mainScriptUri}"></script>


					</body>
					</html>`;
	}
}




function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}