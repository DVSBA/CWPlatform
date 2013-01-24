/**
 * CWPlatform Administration User
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

 /**
 * User Edit and Adding
 *
 */
Ext.namespace("CWPlatform.Administration.User");
CWPlatform.Administration.User = {
	 tabId: null
	 ,userId: null
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
        }
		,cancel: function(){
            CWPlatform.MainScreen.closeTab(Ext.getCmp('center-panel').getActiveTab().getId());
        }
		,addAndClose: function(){
			activeTab = Ext.getCmp(Ext.getCmp('center-panel').getActiveTab().getId());
			f = activeTab.getComponent(0);
			if (f.form.isValid()) {
				var password = f.form.findField('password');
				var repeatPassword = f.form.findField('repeatPassword');
				var userId = f.form.findField('userId');
				//just compare passwords
				if (password.getValue() != repeatPassword.getValue()) {
					password.markInvalid("Passwords not match");
					repeatPassword.markInvalid("Passwords not match");
					password.focus();
					return;
				}
				// if password < 8
				if (password.getValue() && password.getValue().length < 8) {
					password.markInvalid("Password is less than 8 charachters long");
					password.focus();
					return;
				}
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Adding New User with ID: ' + userId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/user_add_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Adding User data with ID: ' + userId.getValue()
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
                        	 title: 'Adding User data with ID: ' + userId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.INFO
							,fn: function(){
								// close tab
								CWPlatform.MainScreen.destroyTab(Ext.getCmp('center-panel').getActiveTab().getId());
								// load show users accordion
								CWPlatform.Administration.Users.show('usersShow-explorer-administration');
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
                        	 title: 'Adding user data BAD with ID: ' + userId.getValue()
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
		,saveAndClose: function(dontClose){
			activeTab = Ext.getCmp(Ext.getCmp('center-panel').getActiveTab().getId());
			f = activeTab.getComponent(0);
			if (f.form.isValid()) {
				var password = f.form.findField('password');
				var repeatPassword = f.form.findField('repeatPassword');
				var userId = f.form.findField('userId');
				//just compare passwords
				if (password.getValue() != repeatPassword.getValue()) {
					f.getComponent(0).setActiveTab(1);
					password.markInvalid("Passwords not match");
					repeatPassword.markInvalid("Passwords not match");
					password.focus();
					return;
				}
				// if password < 8
				if (password.getValue() && password.getValue().length < 8) {
					f.getComponent(0).setActiveTab(1);
					password.markInvalid("Password is less than 8 charachters long");
					password.focus();
					return;
				}
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Updating User data with ID: ' + userId.getValue());
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/user_edit_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Updating User data with ID: ' + userId.getValue()
					,scope: this
					,success: function(form, action) {
						password.setValue('');
						repeatPassword.setValue('');
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
                        	 title: 'Updating User data OK with ID: ' + userId.getValue()
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
                        	 title: 'Updating User data BAD with ID: ' + userId.getValue()
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.ERROR
                        });
					}
				});
				
			} else {
				f.getComponent(0).setActiveTab(0);
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
			statusBar.showBusy('Loading User data with ID: ' + this.userId);
			
			//load form data
			cmp.form.load({
				 url: 'http://127.0.0.1:8000/CWPlatform/ajax/user_edit_GET.js'
				,params: {
					userId: this.userId
				}
				,method: 'GET'
				,waitTitle: 'Please wait!'
				,waitMsg: 'Loading User data with ID: ' + this.userId
				,scope: this
				,success: function(form, action){
					//enable buttons
					this.actions.ok.setDisabled(false);
					this.actions.saveAndClose.setDisabled(false);
					statusBar.setStatus({
                         text:'User data with ID: ' + this.userId + ' loaded'
                    	,iconCls:''
						,clear: true
                    });
				}
				,failure: function(form, action){
					Ext.MessageBox.show({
						title: 'Error'
						,msg: 'Could not load user data with ID: ' + this.userId
						,buttons: Ext.Msg.OK
						,icon: Ext.MessageBox.ERROR
					});
					statusBar.setStatus({
                         text:'Could not load user data with ID: ' + this.userId
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
		        	 title: 'Personal Details'
				    ,defaults: {width: 600}
				    ,items: [{
						name: 'userId'
						,inputType: 'hidden'
						,value: this.userId
					},{
				    	 fieldLabel: 'Username'
				        ,name: 'username'
				        ,allowBlank: false
				        ,readOnly: true
				    },{
				    	 fieldLabel: 'First Name'
				        ,name: 'firstName'
				        ,allowBlank: false
				    },{
				         fieldLabel: 'Last Name'
				        ,name: 'lastName'
				        ,allowBlank: false
				    },{
				         fieldLabel: 'Email'
				        ,name: 'email'
				        ,vtype:'email'
						,allowBlank: false
				    }]
		        },{
					 title: 'Change Password'
			        ,defaults: {width: 600}
			        ,items: [{
			             fieldLabel: 'Password'
			            ,name: 'password'
						,inputType: 'password'
			        },{
			             fieldLabel: 'Repeat Password'
			            ,name: 'repeatPassword'
						,inputType: 'password'
			        }]
				}]
			}]
		});
		
		return form;
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
		        	 title: 'User Details'
				    ,defaults: {width: 600}
				    ,items: [{
						name: 'userId'
						,inputType: 'hidden'
						,value: this.userId
					},{
				    	 fieldLabel: 'Username'
				        ,name: 'username'
				        ,allowBlank: false
				    },{
				    	 fieldLabel: 'First Name'
				        ,name: 'firstName'
				        ,allowBlank: false
				    },{
				         fieldLabel: 'Last Name'
				        ,name: 'lastName'
				        ,allowBlank: false
				    },{
				         fieldLabel: 'Email'
				        ,name: 'email'
				        ,vtype:'email'
						,allowBlank: false
				    },{
			             fieldLabel: 'Password'
			            ,name: 'password'
						,inputType: 'password'
						,allowBlank: false
			        },{
			             fieldLabel: 'Repeat Password'
			            ,name: 'repeatPassword'
						,inputType: 'password'
						,allowBlank: false
			        }]
		        }]
			}]
		});
		
		return form;
	 }
	 /**
	  * Add New User 
	  */
	 ,add: function(){
	 	this.tabId = 'userAdd-';
		this.userId = 0;
		this.uniqueId = this.tabId + '-' + this.userId;
		
		//actions
		this.actions.addAndClose = new Ext.Action({
	         text: 'Add'
	        ,handler: this.handlers.addAndClose
	        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok_apply
			,tooltip: {
	            text: '<h1>Add New User And Close Tab</h1>'
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
			 id: 'tab-' + this.uniqueId
			,title: 'Add New User'
			,tooltip:'<h1>Add New User' + this.userId + '</h1>'
			,iconCls: Ext.ux.CWPlatform.Icons.icn_user_edit
			,items: [form]
		});
	 }	
	 /**
	  * 
	  * Display User for Edit
	  * 
	  * @param {string} _tabId
	  * @param {string} _userId
	  */
	 ,display: function(_tabId, _userId){
	 	this.tabId = _tabId;
		this.userId = _userId;
		this.uniqueId = this.tabId + '-' + this.userId;
		
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
			 id: 'tab-' + this.uniqueId
			,title: 'Edit User'
			,tooltip:'<h1>Here Comes User Name' + this.userId + '</h1>'
			,iconCls: Ext.ux.CWPlatform.Icons.icn_user_edit
			,items: [form]
		});
	 }	
};