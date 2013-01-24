/**
 * CWPlatform Administration Users
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

/**
 * Users
 *
 */
Ext.namespace("CWPlatform.Administration.Users");
CWPlatform.Administration.Users = {
	componentId: null
	,actions: {
		 addUser:null
    	,editUser:null
        ,deleteUser:null
    }
    ,handlers: {
		addUser: function(button, event){
			CWPlatform.Administration.User.add();
        }
        ,editUser: function(button, event){
			var selectedRows = Ext.getCmp('grid-' + this.componentId).getSelectionModel().getSelections();
			var userId = selectedRows[0].data.platform_user_id;
			CWPlatform.Administration.User.display('user-' + this.componentId, userId);
        }
        ,deleteUser: function(button, event){
			var selectedRows = Ext.getCmp('grid-' + this.componentId).getSelectionModel().getSelections();
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
            ,items: [this.actions.addUser, this.actions.editUser, this.actions.deleteUser, '->', 'Search: ', search]
        });
		
		return tbar;	
	}
	,getGrid: function(){
		// create the Data Store
		var store = new Ext.data.JsonStore({
        	 root: "results"
			,url: 'http://127.0.0.1:8000/CWPlatform/ajax/users_show.js'
            ,totalProperty: "totalcount"
            ,id: "platform_user_id"
            ,fields: CWPlatform.Administration.Users.Model
            ,remoteSort: true
        });
		store.setDefaultSort("username", "asc");
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
            ,displayMsg: "Displaying users {0} - {1} of {2}"
            ,emptyMsg: "No users to display"
        });
		
		// the column model has information about grid columns
    	// dataIndex maps the column to the specific data field in
    	// the data store
		var cm = new Ext.grid.ColumnModel([{
            resizable: true
            ,id: "role"
            ,header: "Role"
            ,dataIndex: "role"
        }, {
            resizable: true
            ,id: "username"
            ,header: "Username"
            ,dataIndex: "username"
        }, {
            resizable: true
            ,id: "firstName"
            ,header: "First Name"
            ,dataIndex: "firstName"
        }, {
            resizable: true
            ,id: "lastName"
            ,header: "Last Name"
            ,dataIndex: "lastName"
        }, {
            resizable: true
            ,id: "email"
            ,header: "Email"
            ,dataIndex: "email"
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
				this.actions.editUser.setDisabled(true);
				this.actions.deleteUser.setDisabled(true);
			}
			else {
				//multirow selected
				if (rowCount > 1) {
					this.actions.editUser.setDisabled(true);
					this.actions.deleteUser.setDisabled(false);
				}
				else {
					this.actions.editUser.setDisabled(false);
					this.actions.deleteUser.setDisabled(false);
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
                ,emptyText: "No users to display"
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
		        	 this.actions.editUser
		            ,this.actions.deleteUser
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
		this.actions.addUser = new Ext.Action({
             text: 'Add'
			,tooltip: {
	            text: '<h1>Add New User</h1>'
	        }
            ,handler: this.handlers.addUser
            ,iconCls: Ext.ux.CWPlatform.Icons.icn_user_add
            ,scope: this
        });
		this.actions.editUser = new Ext.Action({
             disabled: true
            ,text: 'Edit'
			,tooltip: {
	            text: '<h1>Edit Selected User</h1>'
	        }
            ,handler: this.handlers.editUser
            ,iconCls: Ext.ux.CWPlatform.Icons.icn_user_edit
            ,scope: this
        });
        this.actions.deleteUser = new Ext.Action({
        	 disabled: true
            ,text: 'Delete'
			,tooltip: {
	            text: '<h1>Delete Selected Users</h1>'
	        }
            ,handler: this.handlers.deleteUser
            ,iconCls: Ext.ux.CWPlatform.Icons.icn_user_delete
            ,scope: this
        });
		
		// Grid
		var grid = this.getGrid();
			
		CWPlatform.MainScreen.updateTab({
			 id: 'tab-' + this.componentId
			,title:'Users'
			,tooltip:'<h1>Users</h1>'
			,iconCls: Ext.ux.CWPlatform.Icons.icn_group
			,items: [grid]
		});
	}
};
CWPlatform.Administration.Users.Model = Ext.data.Record.create([{
    name: "platform_user_id"
}, {
    name: "role"
}, {
    name: "username"
}, {
    name: "firstName"
}, {
    name: "lastName"
}, {
    name: "email"
}]);