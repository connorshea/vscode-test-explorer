import * as vscode from 'vscode';
import { TestRunnerAdapter } from './adapter/api';
import { TestExplorerTree, TestExplorerItem } from './tree';

export class TestExplorer implements vscode.TreeDataProvider<TestExplorerItem> {

	private tree?: TestExplorerTree;
	private readonly treeDataChanged = new vscode.EventEmitter<TestExplorerItem>();
	public readonly onDidChangeTreeData: vscode.Event<TestExplorerItem>;

	constructor(
		private readonly adapter: TestRunnerAdapter
	) {
		this.onDidChangeTreeData = this.treeDataChanged.event;

		this.adapter.tests.subscribe((suite) => {
			this.tree = TestExplorerTree.from(suite);
			this.treeDataChanged.fire();
		});

		this.adapter.reloadTests();
	}

	getTreeItem(item: TestExplorerItem): vscode.TreeItem {
		return item;
	}

	getChildren(item?: TestExplorerItem): vscode.ProviderResult<TestExplorerItem[]> {
		const parent = item || (this.tree ? this.tree.root : undefined);
		return parent ? parent.children : [];
	}

	reload(): void {
		this.adapter.reloadTests();
	}

	start(): void {
		this.adapter.startTests([]);
	}
}
