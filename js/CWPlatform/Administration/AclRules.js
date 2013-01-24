/**
 * CWPlatform Administration Acl Rules
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

/**
 * Acl Rules
 */
Ext.namespace("CWPlatform.Administration.AclRules");
CWPlatform.Administration.AclRules = {
	componentId: null
	,actions: {
   		 addAcl:null
    	,editAcl:null
        ,deleteAcl:null
    }
	,handlers: {
		 addAcl: function(button, event){
			CWPlatform.Administration.AclRule.add();
        }
        ,editAcl: function(button, event){
			var selectedRows = Ext.getCmp('grid-' + this.componentId).getSelectionModel().getSelections();
			var ruleId = selectedRows[0].data.rule_id;
			CWPlatform.Administration.AclRule.display('ACLRule-' + this.componentId, ruleId);
        }
        ,deleteAcl: function(button, event){
			//var selectedRows = Ext.getCmp('grid-' + this.componentId).getSelectionModel().getSelections();
			Ext.Msg.alert('Acl', 'delete ACL Rule clicked.');
        }
    }
	,getGridTopToolbar: function(){
		var onChangeSearch = function(searhObject, currentValue, oldValue){
			//are vaules diff
			if (currentValue != oldValue) {
				//load store to grid
				Ext.getCmp('grid-' + this.componentId).getStore().load({
                    params: {
                        start: 0,
                        limit: 20
                    }
                })
			}
        }; 
        var search = new Ext.ux.SearchField({
             id: 'quick-search-field-' + this.componentId
            ,width: 240
        });
        search.on("change", onChangeSearch, this);
		var tbar =  new Ext.Toolbar({
        	 id: 'actions-' + this.componentId
			,height: 26
            ,items: [this.actions.addAcl, this.actions.editAcl, this.actions.deleteAcl, '->', 'Search: ', search]
        });
		
		return tbar;	
	}
	,getGrid: function(){
		// create the Data Store
		var store = new Ext.data.JsonStore({
        	 root: "results"
			,url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_rules.js'
            ,totalProperty: "totalcount"
            ,id: "rule_id"
            ,fields: CWPlatform.Administration.AclRules.Model
            ,remoteSort: true
        });
		store.setDefaultSort("role", "asc");
		//filtering
        store.on("beforeload", function(f){
			//add param value to query
            f.baseParams.query = Ext.getCmp('quick-search-field-' + this.componentId).getRawValue();
        }, this);
		
		// pager
		var pager = new Ext.PagingToolbar({
            pageSize: 25
            ,store: store
            ,displayInfo: true
            ,displayMsg: "Displaying ACL rights/privileges {0} - {1} of {2}"
            ,emptyMsg: "No ACL rights/privileges to display"
        });
		
		// the column model has information about grid columns
    	// dataIndex maps the column to the specific data field in
    	// the data store
		var cm = new Ext.grid.ColumnModel([{
            resizable: true
            ,id: "role"
            ,header: "Role"
            ,dataIndex: "role"
        },{
            resizable: true
            ,id: "resource"
            ,header: "Resource"
            ,dataIndex: "resource"
        },{
            resizable: true
            ,id: "privileges"
            ,header: "Privileges"
            ,dataIndex: "privileges"
        },{
            resizable: true
            ,id: "rule"
            ,header: "Rule"
            ,dataIndex: "rule"
        },{
            resizable: true
            ,id: "description"
            ,header: "Description"
            ,dataIndex: "description"
        }]);
		
		// by default columns are sortable
    	cm.defaultSortable = true;
		
		//row selection model
		var rm = new Ext.grid.RowSelectionModel({
            multiSelect: true
        });
		rm.on("selectionchange", function(selectionModel){   
			var rowCount = selectionModel.getCount();
			if (rowCount < 1) {
				this.actions.editAcl.setDisabled(true);
				this.actions.deleteAcl.setDisabled(true);
			}
			else {
				//multirow selected
				if (rowCount > 1) {
					this.actions.editAcl.setDisabled(true);
					this.actions.deleteAcl.setDisabled(false);
				}
				else {
					this.actions.editAcl.setDisabled(false);
					this.actions.deleteAcl.setDisabled(false);
				}
			}
        }, this);
		
		// Toptoolbar
		var tbar = this.getGridTopToolbar();
		
		var grid = new Ext.grid.GridPanel({
             id: 'grid-' + this.componentId
            ,store: store
			,autoHeight: true
            ,cm: cm
			,tbar: tbar
            ,bbar: pager
            ,autoSizeColumns: true
            ,selModel: rm
            ,enableColLock: false
            ,loadMask: true
            ,border: false
            ,view: new Ext.grid.GridView({
            	 autoFill: true
                ,forceFit: true
                ,ignoreAdd: true
                ,emptyText: "No ACL rights/privileges to display"
            })
        });
		
		//context menus
		grid.on("rowcontextmenu", function(grid, rowIndex, eventObject){
			eventObject.stopEvent();
            if(!grid.getSelectionModel().isSelected(rowIndex)) {
            	grid.getSelectionModel().selectRow(rowIndex);
            }
			var contextMenu = new Ext.menu.Menu({
		        id:'context-' + this.componentId, 
		        items: [
		        	 this.actions.editAcl
		            ,this.actions.deleteAcl
		        ]
		    });
            contextMenu.showAt(eventObject.getXY());
		},this);
		
		// trigger the data store load
    	store.load({
            params: {
                start: 0,
                limit: 20
            }
        });
		
		return grid;
	}
	/**
	 * 
	 * @param {Object} id
	 */
	,show: function(id){
		this.componentId = id;
		//actions
		this.actions.addAcl = new Ext.Action({
             text: 'Add'
			,tooltip: {
	            text: '<h1>Add New ACL Right/Privileges</h1>'
	        }
            ,handler: this.handlers.addAcl
            ,iconCls: Ext.ux.CWPlatform.Icons.icn_lock_add
            ,scope: this
        });
		this.actions.editAcl = new Ext.Action({
             disabled: true
            ,text: 'Edit'
			,tooltip: {
	            text: '<h1>Edit ACL Right/Privileges</h1>'
	        }
            ,handler: this.handlers.editAcl
            ,iconCls: Ext.ux.CWPlatform.Icons.icn_lock_edit
            ,scope: this
        });
        this.actions.deleteAcl = new Ext.Action({
        	 disabled: true
            ,text: 'Delete'
			,tooltip: {
	            text: '<h1>Delete ACL Right/Privileges</h1>'
	        }
            ,handler: this.handlers.deleteAcl
            ,iconCls: Ext.ux.CWPlatform.Icons.icn_lock_delete
            ,scope: this
        });
		
		// Grid
		var grid = this.getGrid();
		
		CWPlatform.MainScreen.updateTab({
			 id:'tab-' + this.componentId
			,title:'ACL Right/Privileges'
			,tooltip:'<h1>ACL Right/Privileges</h1>'
			,iconCls:Ext.ux.CWPlatform.Icons.icn_lock
			,items:[grid]
		});
	}
};

CWPlatform.Administration.AclRules.Model = Ext.data.Record.create([{
    name: "rule_id"
},{
    name: "role"
},{
    name: "resource"
},{
    name: "privileges"
},{
    name: "rule"
},{
    name: "description"
}]);