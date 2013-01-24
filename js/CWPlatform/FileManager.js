/**
 * CWPlatform FileManager
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

Ext.namespace("CWPlatform.FileManager");
CWPlatform.FileManager = {
	 /**
	  * accordion id
	  */
	 accordionId: null
	
	 /**
	  * Get Panel for Content
	  * 
	  * @param {Object} config
	  */
	,getPanel: function(config){
		this.accordionId = config.id;
				
		explorerPanel = Ext.getCmp('west-panel');
		var treeHeight = explorerPanel.getInnerHeight() - 30;
		
		var treepanel = new Ext.ux.FileTreePanel({
			 height:treeHeight
			,url:'ajax/filetree.js'
			,autoWidth:true
			,id:'fm-file-tree-panel'
			,rootPath:'root'
			,topMenu:false
			,autoScroll:true
			,enableProgress:false
		});
		
		var accordion = new Ext.ux.CWPlatform.Panel.Accordion({
			 id: 'accordion-' + config.id 
			,title: config.title
			,items:[treepanel]
		});
		
		return accordion;
	}	
};

/** 
 * Main panel 
 */
CWPlatform.FileManager.Main = {
	showPanel: function(){
		var panel = CWPlatform.FileManager.getPanel({
			 id: 'explorer-file-manager'
			,title: 'File Manager'
		});
		
		//add Administration to explorerPanel
		CWPlatform.MainScreen.setExplorerPanel(panel);
	}
};
