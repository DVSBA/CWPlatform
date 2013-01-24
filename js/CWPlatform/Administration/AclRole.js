/**
 * CWPlatform Administration ACL Role
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

 /**
 * ACL Role Edit and Adding
 *
 */
Ext.namespace("CWPlatform.Administration.AclRole");
CWPlatform.Administration.AclRole = {
	 tabId: null
	 ,roleId: null
	 ,uniqueId: null
	 ,actions: {
	 	 saveAndClose: null
        ,cancel: null
		,ok: null
		,addAndClose: null
	 }
	 ,handlers: {
	 	ok: function(){
	 		this.handlers.saveAndClose(false);
	 	},
	 	cancel: function(){
	 		CWPlatform.MainScreen.closeTab(Ext.getCmp('center-panel').getActiveTab().getId());
	 	},
	 	addAndClose: function(){
			activeTab = Ext.getCmp(Ext.getCmp('center-panel').getActiveTab().getId());
			f = activeTab.getComponent(0);
			if (f.form.isValid()) {
				var roleId = f.form.findField('roleId');
				
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Adding New Role with ID: ' + roleId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_role_add_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Adding User data with ID: ' + roleId.getValue()
					,scope: this
					,success: function(form, action) {
						var mesg = action.result.mesg;
                        var errorMsg = '';
                        Ext.each(mesg,function(field){
                            errorMsg += field.id + ' ' + field.msg + '<br />';
                        });
						statusBar.setStatus({
                             text: errorMsg
                            ,iconCls:''
							,clear: true
                        });
                        Ext.MessageBox.show({
                        	 title: 'Adding Role data with ID: ' + roleId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.INFO
							,fn: function(){
								// close tab
								CWPlatform.MainScreen.destroyTab(Ext.getCmp('center-panel').getActiveTab().getId());
								// load show users accordion
								CWPlatform.Administration.AclRoles.show('ACLRolesShow-explorer-administration');
							}
                        });
	                }
					,failure: function(form, action) {
	                	var mesg = action.result.mesg;
                        var errorMsg = '';
                        Ext.each(mesg,function(field){
                            errorMsg += field.id + ' ' + field.msg + '<br />';
                        });
						statusBar.setStatus({
                             text: errorMsg
                            ,iconCls:''
							,clear: true
                        });
                        Ext.MessageBox.show({
                        	 title: 'Adding Role data BAD with ID: ' +  roleId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.ERROR
                        });
					}
				});
			} else {
				Ext.MessageBox.alert('Message', 'Please fill in required fields!');
			}
	 	},
	 	saveAndClose: function(dontClose){
			activeTab = Ext.getCmp(Ext.getCmp('center-panel').getActiveTab().getId());
			f = activeTab.getComponent(0);
			if (f.form.isValid()) {
				var roleId = f.form.findField('roleId');
				
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Updating Role data with ID: ' + roleId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_role_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Updating Role data with ID: ' + roleId.getValue()
					,scope: this
					,success: function(form, action) {
						var mesg = action.result.mesg;
                        var errorMsg = '';
                        Ext.each(mesg,function(field){
                            errorMsg += field.id + ' ' + field.msg + '<br />';
                        });
						statusBar.setStatus({
                             text: errorMsg
                            ,iconCls:''
							,clear: true
                        });
                        Ext.MessageBox.show({
                        	 title: 'Updating Role data OK with ID: ' + roleId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.INFO
							,fn: function(){
								//update login-info
								if(typeof(dontClose) != 'boolean'){
									CWPlatform.MainScreen.destroyTab(Ext.getCmp('center-panel').getActiveTab().getId());
								}
							}
                        });
	                }
					,failure: function(form, action) {
	                	var mesg = action.result.mesg;
                        var errorMsg = '';
                        Ext.each(mesg,function(field){
                            errorMsg += field.id + ' ' + field.msg + '<br />';
                        });
						statusBar.setStatus({
                             text: errorMsg
                            ,iconCls:''
							,clear: true
                        });
                        Ext.MessageBox.show({
                        	 title: 'Updating Role data BAD with ID: ' + roleId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.ERROR
                        });
					}
				});
			} else {
				Ext.MessageBox.alert('Message', 'Please fill in required fields!');	
			}
	 	}
	 }
	 /**
	  * Build Form
	  */
	 ,getForm: function(){
	 	
		//load form Data
		var loadFormData = function(cmp){
			statusBar = Ext.getCmp('status-bar');
			statusBar.showBusy('Loading Role data with ID: ' + this.roleId);
			
			//load form data
			cmp.form.load({
				 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_role_GET.js'
				,params: {
					roleId: this.roleId
				}
				,method: 'GET'
				,waitTitle: 'Please wait!'
				,waitMsg: 'Loading Role data with ID: ' + this.roleId
				,scope: this
				,success: function(form, action){
					//enable buttons
					this.actions.ok.setDisabled(false);
					this.actions.saveAndClose.setDisabled(false);
					statusBar.setStatus({
                         text:'Role data with ID: ' + this.roleId + ' loaded'
                    	,iconCls:''
						,clear: true
                    });
				}
				,failure: function(form, action){
					Ext.MessageBox.show({
						title: 'Error'
						,msg: 'Could not load role data with ID: ' + this.roleId
						,buttons: Ext.Msg.OK
						,icon: Ext.MessageBox.ERROR
					});
					statusBar.setStatus({
                         text:'Could not load role data with ID: ' + this.roleId
                        ,iconCls:''
						,clear: true
                    });
				}
			});
		};
		
		var tbar = new Ext.Toolbar({
            id: 'tbar-' + this.uniqueId
            ,items: [this.actions.saveAndClose, '-', this.actions.cancel, '-', this.actions.ok]
        });
				
		var form = new Ext.FormPanel({
			 id: 'form-' + this.uniqueId
			,labelAlign: 'top'
			,border: false
			,anchor: "100% 100%"
			,deferredRender: false
			,tbar: tbar
			,listeners: {
				'render': { 
					 fn: loadFormData
					,scope: this 
				}
			}
			,items: [{
				 xtype: 'tabpanel'
				,deferredRender: false
		        ,activeTab: 0
				,border: false
		        ,defaults: {
					 autoHeight: true
					,bodyStyle: 'padding:10px'
					,layout: 'form'
					,defaultType: 'textfield'
				}
		        ,items: [{
		        	 title: 'Role Details'
				    ,defaults: {width: 600}
				    ,items: [{
						 name: 'roleId'
						,inputType: 'hidden'
						,value: this.roleId
					},{
				    	 fieldLabel: 'Role'
				        ,name: 'role'
				        ,allowBlank: false
				    },{
				    	 fieldLabel: 'Parent Role'
				        ,name: 'parentRole'
						,xtype:'combo'
						,store:[
							 [0, 'none']
							,[1, 'guest']
							,[2, 'member']
							,[3, 'admin']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'parentRole'						
				    },{
				         fieldLabel: 'Description'
				        ,name: 'description'
						,xtype:'textarea'
				    }]
		        }]
			}]
		});
	 	return form;
	 }
	 /**
	  * 
	  * Display User for Edit
	  * 
	  * @param {string} _tabId
	  * @param {string} _roleId
	  */
	 ,display: function(_tabId, _roleId){
	 	this.tabId = _tabId;
		this.roleId = _roleId;
		this.uniqueId = this.tabId + '-' + this.roleId;
		
		//actions
		this.actions.saveAndClose = new Ext.Action({
	        disabled: true
	        ,text: 'Ok'
	        ,handler: this.handlers.saveAndClose
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok_apply
			,tooltip: {
	            text: '<h1>Save Changes And Close Tab</h1>'
	        }
			,scope: this
	    });
		this.actions.cancel = new Ext.Action({
	    	 text: 'Cancel'
	        ,handler: this.handlers.cancel
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_cancel
			,tooltip: {
	            text: '<h1>Close without saving</h1>'
	        }
			,scope: this
	    });
		this.actions.ok = new Ext.Action({
	        disabled: true
	        ,text: 'Apply'
	        ,handler: this.handlers.ok
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok
			,tooltip: {
	            text: '<h1>Save Changes</h1>'
	        }
			,scope: this
	    });
		
		// Form
		var form = this.getForm();
		
		CWPlatform.MainScreen.updateTab({
			 id:'tab-' + this.uniqueId
			,title:'Edit Role'
			,tooltip:'<h1>Here Comes Role Name' + this.roleId + '</h1>'
			,iconCls:Ext.ux.CWPlatform.Icons.icn_group_key
			,items:[form]
		});
	 }
	 /**
	  * Add Form for new user
	  */
	 ,addForm: function(){
	 	
	 	var tbar = new Ext.Toolbar({
            id: 'tbar-' + this.uniqueId
            ,items: [this.actions.addAndClose, '-', this.actions.cancel]
        });
		
		var form = new Ext.FormPanel({
			 id: 'form-' + this.uniqueId
			,labelAlign: 'top'
			,border: false
			,anchor: "100% 100%"
			,deferredRender: false
			,tbar: tbar
			,items: [{
				 xtype: 'tabpanel'
				,deferredRender: false
		        ,activeTab: 0
				,border: false
		        ,defaults: {
					 autoHeight: true
					,bodyStyle: 'padding:10px'
					,layout: 'form'
					,defaultType: 'textfield'
				}
		        ,items: [{
		        	 title: 'Role Details'
				    ,defaults: {width: 600}
				    ,items: [{
						 name: 'roleId'
						,inputType: 'hidden'
						,value: this.roleId
					},{
				    	 fieldLabel: 'Role'
				        ,name: 'role'
				        ,allowBlank: false
				    },{
				    	 fieldLabel: 'Parent Role'
				        ,name: 'parentRole'
						,value:0
						,xtype:'combo'
						,store:[
							 [0, 'none']
							,[1, 'guest']
							,[2, 'member']
							,[3, 'admin']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'parentRole'						
				    },{
				         fieldLabel: 'Description'
				        ,name: 'description'
						,xtype:'textarea'
				    }]
		        }]
			}]
		});
		
		return form;
	 }
	 /**
	  * Add New Role
	  */
	 ,add: function(){
	 	this.tabId = 'AclRoleAdd-';
		this.roleId = 0;
		this.uniqueId = this.tabId + '-' + this.roleId;
		
		//actions
		this.actions.addAndClose = new Ext.Action({
	         text: 'Add'
	        ,handler: this.handlers.addAndClose
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok_apply
			,tooltip: {
	            text: '<h1>Add New Role And Close Tab</h1>'
	        }
			,scope: this
	    });
		this.actions.cancel = new Ext.Action({
	    	 text: 'Cancel'
	        ,handler: this.handlers.cancel
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_cancel
			,tooltip: {
	            text: '<h1>Close without changes</h1>'
	        }
			,scope: this
	    });
		
		// Form
		var form = this.addForm();
		
		CWPlatform.MainScreen.updateTab({
			 id:'tab-' + this.uniqueId
			,title:'Add New Role'
			,tooltip:'<h1>Add New Role' + this.roleId + '</h1>'
			,iconCls:Ext.ux.CWPlatform.Icons.icn_group_key
			,items: [form]
		});
	 }
};