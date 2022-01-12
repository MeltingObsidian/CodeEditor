class EditorFile{
    constructor(name, content="", temporary=false, contentType="text", language="", totype="", callback=()=>{}){
        this.name = name;
        this.content = content;
        this.temporary = temporary;
        this.contentType = contentType;
        this.language = language;
        this.totype = totype;
        this.callback = callback;
    }

    get name(){
        return this._name;
    }
    get content(){
        return this._content;
    }
    get temporary(){
        return this._temporary;
    }
    get contentType(){
        return this._contentType;
    }
    get language(){
        return this._language;
    }
    get totype(){
        return this._totype;
    }
    get callback(){
        return this._callback;
    }

    set name(value){
        this._name = value;
    }
    set content(value){
        this._content = value;
    }
    set temporary(value){
        this._temporary = value;
    }
    set contentType(value){
        this._contentType = value;
    }
    set language(value){
        this._language = value;
    }
    set totype(value){
        this._totype = value;
    }
    set callback(value){
        this._callback = value;
    }
}

class EditorWindowMenuBarItem{
    constructor(name, callback=()=>{}){
        this.name = name;
        this.callback = callback;
    }
    
    get name(){
        return this._name;
    }
    get callback(){
        return this._callback;
    }

    getItem(){
        return $("<div>").addClass("editor-window-menu-bar-item").text(this.name).click(this.callback);
    }

    set name(value){
        this._name = value;
    }
    set callback(value){
        this._callback = value;
    }
}

class EditorActivityBarItem{
    constructor(name, icon, alert=[], callback=()=>{}){
        this.name = name;
        this.icon = icon;
        this.alert = alert;
        this.callback = callback;
    }

    get name(){
        return this._name;
    }
    get icon(){
        return this._icon;
    }
    get alert(){
        return this._alert;
    }
    get callback(){
        return this._callback;
    }
    getItem(){
        var element = $('<div class="activity-bar-item"></div>');
        var icon = $('<img class="activity-bar-item-icon" src="'+this.icon+'"></img>');
        var name = $('<div class="activity-bar-item-name">'+this.name+'</div>');
        element.append(icon);
        element.append(name);
        element.click(this.callback);
        return element;
    }

    set name(value){
        this._name = value;
    }
    set icon(value){
        this._icon = value;
    }
    set alert(value){
        this._alert = value;
    }
    set callback(value){
        this._callback = value;
    }
}

var defaults = {
    activityBarTopItems: [new EditorActivityBarItem("Explorer (Ctrl+Shift+E)", "explorer.png", [], () =>{}), 
                        new EditorActivityBarItem("Search (Ctrl+Shift+F)", "search.png", [], () =>{}), 
                        new EditorActivityBarItem("Source Control (Ctrl+Shift+G", "source_control.png", [], () =>{}), 
                        new EditorActivityBarItem("Run and Debug (Ctrl+Shift+D", "run_debug.png", [], () =>{}), 
                        new EditorActivityBarItem("Extensions (Ctrl+Shift+X", "extensions.png", [], () =>{})],
    activityBarBottomItems: [new EditorActivityBarItem("Accounts", "accounts.png", [], () =>{}),
                            new EditorActivityBarItem("Manage", "manage.png", [], () =>{})],
    gettingStartedHTML: `
                        <h1>Visual Studio Code</h1>
                        <h2>Editing Evolved</h2>
                        <h4>Start</h4>
                        <a><img src='new-file.png'></img><p>New File...</p></a>
                        <a><img src='open-file.png'></img><p>Open File...</p></a>
                        <a><img src='open-folder.png'></img><p>Open Folder...</p></a>
                        <a><img src='git.png'></img><p>Clone Git Repository...</p></a>
                        
                        <h4>Recent</h4>`,
    blankWorkspaceHTML: `
                        <img src='vscode.png'></img>
                        <p>Show all commands <button>Ctrl+Shift+P</button></p>
                        <p>Open File<button>Ctrl+O</button></p>
                        <p>Open Folder<button>Ctrl+K Ctrl+O</button></p>
                        <p>Open Recent<button>Ctrl+R</button></p>`, 
}

class EditorWindow{
    static options = {
        menuBar: 'default',
        customMenuBarItems: [],
        os: 'mac', 
        theme: 'light',
        themeProvider: 'default',
        applicationIcon: 'vscode.png', 
        applicationTitle: 'Visual Studio Code',
        activityBarTop: 'default',
        customActivityBarTopItems: [],
        activityBarBottom: 'default',
        customActivityBarBottomItems: [],
        treeView: 'default',
        customTreeViewItems: [],
        breadCrumbs: true,
        console: 'default',
        customConsoleItems: [],
        statusBarLeft: 'default',
        statusBarRight: 'default',
        files: [new EditorFile('Getting Started', defaults.gettingStartedHTML, true, 'html')],
        editors: [0], 
        activeEditor: 0,
        blankWorkspace: new EditorFile('Getting Started', defaults.blankWorkspaceHTML, true, 'html'), 
        sideBar: 'default',
        customSideBars: []
    }

    constructor(element, options=EditorWindow.options){
        this.element = $(element);
        this.options = options;
    }

    create(){
        var window = $('<div class="editor-window"></div>');
        var titleBar = $('<div class="editor-title-bar"></div>');
        var applicationIcon = $('<div class="editor-application-icon"></div>');
        var applicationTitle = $('<div class="editor-application-title"></div>');
        var WindowsActionButtons = $('<div class="editor-action-buttons-windows"></div>');
        var windowsCloseButton = $('<div class="editor-close-button-windows"></div>');
        var windowsMaximizeButton = $('<div class="editor-maximize-button-windows"></div>');
        var windowsMinimizeButton = $('<div class="editor-minimize-button-windows"></div>');
        var macActionButtons = $('<div class="editor-action-buttons-mac"></div>');
        var macCloseButton = $('<div class="editor-close-button-mac"></div>');
        var macMaximizeButton = $('<div class="editor-maximize-button-mac"></div>');
        var macMinimizeButton = $('<div class="editor-minimize-button-mac"></div>');
        var menuBar = $('<div class="editor-menu-bar"></div>');
        var workspace = $('<div class="editor-workspace"></div>');
        var activityBar = $('<div class="editor-activity-bar"></div>');
        var activityBarTop = $('<div class="editor-activity-bar-top"></div>');
        var activityBarBottom = $('<div class="editor-activity-bar-bottom"></div>');
        var sideBar = $('<div class="editor-side-bar"></div>');
        var treeViewContainer = $('<div class="editor-tree-view-container"></div>');
        var editorGroups = $('<div class="editor-groups"></div>');
        var consoleContainer = $('<div class="editor-console-container"></div>');
        var consoleMenuBar = $('<div class="editor-console-container-menu-bar"></div>');
        var consoleSideBar = $('<div class="editor-console-container-side-bar"></div>');
        var statusBar = $('<div class="editor-status-bar"></div>');
        var statusBarLeft = $('<div class="editor-status-bar-left"></div>');
        var statusBarRight = $('<div class="editor-status-bar-right"></div>');

        let container  = this.element;
        let options = this.options;

        container.append(window);
        window.append(titleBar);
        if (options.os === 'windows'){
            titleBar.append(applicationIcon);
            titleBar.append(applicationTitle);
            titleBar.append(WindowsActionButtons);
            WindowsActionButtons.append(windowsCloseButton);
            WindowsActionButtons.append(windowsMaximizeButton);
            WindowsActionButtons.append(windowsMinimizeButton);
        } else if (options.os === 'mac'){
            titleBar.append(macActionButtons);
            macActionButtons.append(macCloseButton);
            macActionButtons.append(macMaximizeButton);
            macActionButtons.append(macMinimizeButton);
            titleBar.append(applicationTitle);
        }
        window.append(menuBar);

        if (this.options.menuBar === 'custom'){
            for (const item in this.options.customMenuBarItems){
                menuBar.append(this.options.customMenuBarItems[item].getItem());
            }
        } else if (this.options.menuBar === 'extend') {
            menuBar.append(new EditorWindowMenuBarItem('File').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Edit').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Selection').getItem());
            menuBar.append(new EditorWindowMenuBarItem('View').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Go').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Run').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Terminal').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Help').getItem());
            for (const item in this.options.customMenuBarItems){
                menuBar.append(this.options.customMenuBarItems[item].getItem());
            }
        }else if (this.options.menuBar === 'default'){
            menuBar.append(new EditorWindowMenuBarItem('File').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Edit').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Selection').getItem());
            menuBar.append(new EditorWindowMenuBarItem('View').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Go').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Run').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Terminal').getItem());
            menuBar.append(new EditorWindowMenuBarItem('Help').getItem());
        } else if (this.options.menuBar == 'none'){
            menuBar.hide();
        }

        window.append(workspace);
        workspace.append(activityBar);
        activityBar.append(activityBarTop);
        if (options.activityBarTop === 'default') {
            for (const item in defaults.activityBarTopItems){
                activityBarTop.append(defaults.activityBarTopItems[item].getItem());
            }
        } else if (options.activityBarTop === 'custom'){
            for (const item in options.customActivityBarTopItems){
                activityBarTop.append(options.customActivityBarTopItems[item].getItem());
            }
        } else if (options.activityBarTop === 'extend') {
            for (const item in defaults.activityBarTopItems){
                activityBarTop.append(defaults.activityBarTopItems[item].getItem());
            }
            for (const item in options.customActivityBarTopItems){
                activityBarTop.append(options.customActivityBarTopItems[item].getItem());
            }
        } else if (options.activityBarTop === 'none'){
            activityBarTop.hide();
        }

        activityBar.append(activityBarBottom);
        if (options.activityBarBottom === 'default') {
            for (const item in defaults.activityBarBottomItems){
                activityBarBottom.append(defaults.activityBarBottomItems[item].getItem());
            }
        } else if (options.activityBarBottom === 'custom'){
            for (const item in options.customActivityBarBottomItems){
                activityBarBottom.append(options.customActivityBarBottomItems[item].getItem());
            }
        }
        else if (options.activityBarBottom === 'extend') {
            for (const item in defaults.activityBarBottomItems){
                activityBarBottom.append(defaults.activityBarBottomItems[item].getItem());
            }
            for (const item in options.customActivityBarBottomItems){
                activityBarBottom.append(options.customActivityBarBottomItems[item].getItem());
            }
        } else if (options.activityBarBottom === 'none'){
            activityBarBottom.hide();
        }

        workspace.append(sideBar);
        sideBar.append(treeViewContainer);
    }

    getSideBar(){

    }
}