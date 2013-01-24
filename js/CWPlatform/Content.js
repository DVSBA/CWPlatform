/**
 * CWPlatform Content
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */
Ext.namespace("CWPlatform.Content");
CWPlatform.Content = {
	accordionId: null,
	sites: null,
	/**
	 * actions
	 */
	actions: {
         treeExpandAll: null
        ,treeCollapseAll: null
    },
	/**
	 * handlers
	 */
	handlers: {
        treeExpandAll: function(){
            alert('You Clicked treeExpandAll');
        },
        treeCollapseAll: function(){
            alert('You Clicked treeColapseAll');
        }
    },
	/**
	 * init of Component
	 */
	initComponent: function(id){
		this.accordionId = id;
		this.actions.treeExpandAll = new Ext.Action({
			disabled: true
        	,iconCls: Ext.ux.CWPlatform.Icons.icn_tree_expand_all
			,tooltip: {
                text: '<h1>Expand All</h1>'
            }
			,handler: this.handlers.treeExpandAll
			,scope: this	
		});
		this.actions.treeCollapseAll = new Ext.Action({
			disabled: true 
			,iconCls: Ext.ux.CWPlatform.Icons.icn_tree_collapse_all
			,tooltip: {
                text: '<h1>Collapse All</h1>'
            }
			,handler: this.handlers.treeCollapseAll
			,scope: this	
		});
		//sites
		var store = new Ext.data.SimpleStore({
            fields: ["key", "value"],
            data: [["1", "Site 1"], ["2", "Site 2"], ["3", "Site 3"]]
        });
		this.sites = new Ext.form.ComboBox({
			 id: 'sites'
			,name: 'sites'
			,store: store  
			,displayField: "value"
            ,valueField: "key"
            ,typeAhead: true
            ,mode: "local"
			,triggerAction: "all"
            ,emptyText: "Select Site ..."
            ,selectOnFocus: true
            ,editable: false
			,width: 150
		});
		this.sites.on('select', function(cmp, value){
			console.log(value);
			alert('Site Clicked!');
			this.actions.treeExpandAll.setDisabled(false);
			this.actions.treeCollapseAll.setDisabled(false);
			accordion = Ext.getCmp('accordion-' + this.accordionId);
			console.log(accordion);
		}, this);
	},
	/**
	 * Get Panel for Content
	 * 
	 * @param {Object} config
	 */
	getPanel: function(config){
		this.initComponent(config.id);
		
		var accordion = new Ext.ux.CWPlatform.Panel.Accordion({
			id: 'accordion-' + config.id
			,title: config.title
			,tbarItems: [this.sites, '->', this.actions.treeExpandAll, this.actions.treeCollapseAll]
		});
		
		return accordion;
	}
};
CWPlatform.Content.Main = {
	showPanel: function(){
		var panel = CWPlatform.Content.getPanel({
			id: 'explorer-content'
		   ,title: 'Site Explorer'
		});
		//add Content to explorerPanel
		CWPlatform.MainScreen.setExplorerPanel(panel);
	}
};