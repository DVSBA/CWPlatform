/**
 * CWPlatform Administration ACL Rule
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

 /**
 * ACL Rule Edit and Adding
 */
Ext.namespace("CWPlatform.Administration.AclRule");
CWPlatform.Administration.AclRule = {
	 tabId: null
	 ,ruleId: null
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
				var ruleId = f.form.findField('ruleId');
				
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Adding New Rights/Permissions with ID: ' + ruleId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_rule_add_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Adding New Rights/Permissions data with ID: ' + ruleId.getValue()
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
                        	 title: 'Adding New Rights/Permissions data with ID: ' + ruleId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.INFO
							,fn: function(){
								// close tab
								CWPlatform.MainScreen.destroyTab(Ext.getCmp('center-panel').getActiveTab().getId());
								// load show users accordion
								CWPlatform.Administration.AclRules.show('ACLRulesShow-explorer-administration');
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
                        	 title: 'Adding New Rights/Permissions data BAD with ID: ' +  ruleId.getValue()
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
				var ruleId = f.form.findField('ruleId');
				
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Updating Rights/Privileges data with ID: ' + ruleId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_rule_POST.js'
					,method:'POST'
            		,waitTitle:'Please wait!'
					,waitMsg:'pdating Rights/Privileges data with ID: ' + ruleId.getValue()
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
                        	 title: 'Updating Rights/Privileges data with ID: ' + ruleId.getValue()
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
                        	 title: 'Updating Rights/Privileges data BAD with ID: ' + ruleId.getValue()
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
			statusBar.showBusy('Loading Rights/Privileges data with ID: ' + this.ruleId);
			
			//load form data
			cmp.form.load({
				 url: 'http://127.0.0.1:8000/CWPlatform/ajax/acl_rule_GET.js'
				,params: {
					ruleId: this.ruleId
				}
				,method: 'GET'
				,waitTitle: 'Please wait!'
				,waitMsg: 'Loading Rights/Privileges data with ID: ' + this.ruleId
				,scope: this
				,success: function(form, action){
					//enable buttons
					this.actions.ok.setDisabled(false);
					this.actions.saveAndClose.setDisabled(false);
					statusBar.setStatus({
                         text:'Rights/Privileges data with ID: ' + this.ruleId + ' loaded'
                    	,iconCls:''
						,clear: true
                    });
				}
				,failure: function(form, action){
					Ext.MessageBox.show({
						title: 'Error'
						,msg: 'Could not load rigts/privileges data with ID: ' + this.ruleId
						,buttons: Ext.Msg.OK
						,icon: Ext.MessageBox.ERROR
					});
					statusBar.setStatus({
                         text:'Could not load rights/privileges data with ID: ' + this.ruleId
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
		        	 title: 'Rights/Privileges Details'
				    ,defaults: {width: 600}
				    ,items: [{
						 name: 'ruleId'
						,inputType: 'hidden'
						,value: this.ruleId
					},{
				    	 fieldLabel: 'Role'
				        ,name: 'role'
						,xtype:'combo'
						,store:[
							 [1, 'guest']
							,[2, 'admin']
							,[3, 'moderator']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'role'
				        ,allowBlank: false
				    },{
				    	 fieldLabel: 'Resource'
				        ,name: 'resource'
						,xtype:'combo'
						,store:[
							 ['all', 'all']
							,['default:index', 'default:index']
							,['default:error', 'default:error']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'resource'						
				    },{
						 xtype:'checkbox'
                        ,fieldLabel:'Privileges'
                        ,boxLabel:'all'
                        ,name: 'privileges_0'
                    },{
						 xtype:'checkbox'
                        ,fieldLabel:''
                        ,labelSeparator:''
                        ,boxLabel:'index'
                        ,name: 'privileges_index'
                   },{
				   		 xtype:'checkbox'
				   		,fieldLabel:''
                        ,labelSeparator:''
						,boxLabel:'view'
						,name:'privileges_view'
				    },{
				    	 fieldLabel: 'Rule'
				        ,name: 'rule'
						,xtype:'combo'
						,store:[
							 ['allow', 'allow']
							,['deny', 'deny']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'rule'
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
	  * @param {string} _ruleId
	  */
	 ,display: function(_tabId, _ruleId){
	 	this.tabId = _tabId;
		this.ruleId = _ruleId;
		this.uniqueId = this.tabId + '-' + this.ruleId;
		
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
			,title:'Edit Rights/Privileges'
			,tooltip:'<h1>Here Comes Rights/Privileges Name' + this.ruleId + '</h1>'
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
		        	 title: 'Rights/Privileges Details'
				    ,defaults: {width: 600}
				    ,items: [{
						 name: 'ruleId'
						,inputType: 'hidden'
						,value: this.ruleId
					},{
				    	 fieldLabel: 'Role'
				        ,name: 'role'
						,xtype:'combo'
						,store:[
							 [1, 'guest']
							,[2, 'admin']
							,[3, 'moderator']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'role'
				        ,allowBlank: false
				    },{
				    	 fieldLabel: 'Resource'
				        ,name: 'resource'
						,xtype:'combo'
						,value:'all'
						,store:[
							 ['all', 'all']
							,['default:index', 'default:index']
							,['default:error', 'default:error']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'resource'						
				    },{
						 xtype:'checkbox'
                        ,fieldLabel:'Privileges'
                        ,boxLabel:'all'
                        ,name: 'privileges_0'
						,checked:true
                    },{
						 xtype:'checkbox'
                        ,fieldLabel:''
                        ,labelSeparator:''
                        ,boxLabel:'index'
                        ,name: 'privileges_index'
                   },{
				   		 xtype:'checkbox'
				   		,fieldLabel:''
                        ,labelSeparator:''
						,boxLabel:'view'
						,name:'privileges_view'
				    },{
				    	 fieldLabel: 'Rule'
				        ,name: 'rule'
						,xtype:'combo'
						,store:[
							 ['allow', 'allow']
							,['deny', 'deny']
						]
						,mode:'local'
						,triggerAction:'all'
						,hiddenName:'rule'
						,allowBlank:false
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
	 	this.tabId = 'AclRuleAdd-';
		this.ruleId = 0;
		this.uniqueId = this.tabId + '-' + this.ruleId;
		
		//actions
		this.actions.addAndClose = new Ext.Action({
	         text: 'Add'
	        ,handler: this.handlers.addAndClose
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok_apply
			,tooltip: {
	            text: '<h1>Add New Rights/Privileges And Close Tab</h1>'
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
			,title:'Add New Rule'
			,tooltip:'<h1>Add New Rule ' + this.ruleId + '</h1>'
			,iconCls:Ext.ux.CWPlatform.Icons.icn_group_key
			,items: [form]
		});
	 }
};