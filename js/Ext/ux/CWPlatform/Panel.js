Ext.namespace("Ext.ux", "Ext.ux.CWPlatform.Panel");
Ext.ux.CWPlatform.Panel.Accordion = Ext.extend(Ext.Panel, {
	 layout: 'accordion'
	,border: false
	,tbarItems: false
	,layoutConfig:{
		 animate: true
		,sequence: true
		,titleCollapse: true
		,activeOnTop: true
        ,hideCollapseTool: true
	},
	
	initComponent:function() {
			//tbar
		if (this.tbarItems) {
            this.tbar = new Ext.Toolbar({
            	 id: 'tbar-' + this.id
                ,items: this.tbarItems
				,height: 26
            })
        }
        // call parent initComponent
		Ext.ux.CWPlatform.Panel.Accordion.superclass.initComponent.call(this);
 
    } // end of function initComponent
});

Ext.ux.CWPlatform.Panel.TreePanel = Ext.extend(Ext.tree.TreePanel, {
	 border: false
	,rootVisible: false
    ,lines:false
    ,autoScroll:true
	,loader: new Ext.tree.TreeLoader()
	,listeners: {
        click: function(n) {
            Ext.Msg.alert('Navigation Tree Click', 'You clicked: "' + n.attributes.text + '"');
        }
    }
	,initComponent:function() {
		// call parent initComponent
		Ext.ux.CWPlatform.Panel.TreePanel.superclass.initComponent.call(this);
 		
		
    } // end of function initComponent
});