/**
 * CWPlatform Administration ACL Resource
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

 /**
 * ACL Resource Edit and Adding
 */
Ext.namespace("CWPlatform.Administration.AclResource");
CWPlatform.Administration.AclResource = {
	 tabId: null
	 ,resourceId: null
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
				var resourceId = f.form.findField('resourceId');
				
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Adding New Role with ID: ' + resourceId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_resource_add_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Adding Resource data with ID: ' + resourceId.getValue()
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
                        	 title: 'Adding Resource data with ID: ' + resourceId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.INFO
							,fn: function(){
								// close tab
								CWPlatform.MainScreen.destroyTab(Ext.getCmp('center-panel').getActiveTab().getId());
								// load show users accordion
								CWPlatform.Administration.AclResources.show('ACLResourcesShow-explorer-administration');
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
                        	 title: 'Adding Resources data BAD with ID: ' +  resourceId.getValue()
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
				var resourceId = f.form.findField('resourceId');
				
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Updating Role data with ID: ' + resourceId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_resource_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Updating Resource data with ID: ' + resourceId.getValue()
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
                        	 title: 'Updating Resource data OK with ID: ' + resourceId.getValue()
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
                        	 title: 'Updating Resource data BAD with ID: ' + resource.getValue()
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
			statusBar.showBusy('Loading Resource data with ID: ' + this.resourceId);
			
			//load form data
			cmp.form.load({
				 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_resource_GET.js'
				,params: {
					resourceId: this.resourceId
				}
				,method: 'GET'
				,waitTitle: 'Please wait!'
				,waitMsg: 'Loading Resource data with ID: ' + this.resourceId
				,scope: this
				,success: function(form, action){
					//enable buttons
					this.actions.ok.setDisabled(false);
					this.actions.saveAndClose.setDisabled(false);
					statusBar.setStatus({
                         text:'Resource data with ID: ' + this.resourceId + ' loaded'
                    	,iconCls:''
						,clear: true
                    });
				}
				,failure: function(form, action){
					Ext.MessageBox.show({
						title: 'Error'
						,msg: 'Could not load resource data with ID: ' + this.resourceId
						,buttons: Ext.Msg.OK
						,icon: Ext.MessageBox.ERROR
					});
					statusBar.setStatus({
                         text:'Could not load resource data with ID: ' + this.resourceId
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
		        	 title: 'Resource Details'
				    ,defaults: {width: 600}
				    ,items: [{
						 name: 'resourceId'
						,inputType: 'hidden'
						,value: this.resourceId
					},{
				    	 fieldLabel: 'Module'
				        ,name: 'module'
						,xtype:'combo'
						,store:[
							['default', 'default']
							,['admin', 'admin']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'module'
				        ,allowBlank: false
				    },{
				    	 fieldLabel: 'Controller'
				        ,name: 'controller'
						,xtype:'combo'
						,store:[
							 ['all', 'All']
							,['index', 'index']
							,['error', 'error']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'controller'						
				    },{
				    	 fieldLabel: 'Parent Resource'
				        ,name: 'parentResource'
						,xtype:'combo'
						,store:[
							 [0, 'none']
							,[1, 'default']
							,[2, 'admin']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'parentResource'						
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
	  * @param {string} _resourceId
	  */
	 ,display: function(_tabId, _resourceId){
	 	this.tabId = _tabId;
		this.resourceId = _resourceId;
		this.uniqueId = this.tabId + '-' + this.resourceId;
		
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
			,title:'Edit Resource'
			,tooltip:'<h1>Here Comes Resource Name' + this.resourceId + '</h1>'
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
		        	 title: 'Resource Details'
				    ,defaults: {width: 600}
				    ,items: [{
						 name: 'resourceId'
						,inputType: 'hidden'
						,value: this.resourceId
					},{
				    	 fieldLabel: 'Module'
				        ,name: 'module'
						,xtype:'combo'
						,store:[
							 ['default', 'default']
							,['admin', 'admin']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'module'
				        ,allowBlank: false
				    },{
				    	 fieldLabel: 'Controller'
				        ,name: 'controller'
						,xtype:'combo'
						,value:'all'
						,store:[
							 ['all', 'All']
							,['index', 'index']
							,['error', 'error']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'controller'						
				    },{
				    	 fieldLabel: 'Parent Resource'
				        ,name: 'parentResource'
						,xtype:'combo'
						,value:0
						,store:[
							 [0, 'none']
							,[1, 'default']
							,[2, 'admin']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'parentResource'						
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
	 	this.tabId = 'AclResourceAdd-';
		this.resourceId = 0;
		this.uniqueId = this.tabId + '-' + this.resourceId;
		
		//actions
		this.actions.addAndClose = new Ext.Action({
	         text: 'Add'
	        ,handler: this.handlers.addAndClose
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok_apply
			,tooltip: {
	            text: '<h1>Add New Resource And Close Tab</h1>'
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
			,title:'Add New Resource'
			,tooltip:'<h1>Add New Resource ' + this.resourceId + '</h1>'
			,iconCls:Ext.ux.CWPlatform.Icons.icn_group_key
			,items: [form]
		});
	 }
};