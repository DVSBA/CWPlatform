/**
 * CWPlatform UserProfile
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */
Ext.namespace('CWPlatform.UserProfile');
CWPlatform.UserProfile = function(){
	var tabId;
	
	var actions = {
    	 saveAndClose: null
        ,cancel: null
		,ok: null
    };
    var handlers = {
        ok: function(){
			handlers.saveAndClose(false);
        },
        cancel: function(){
            CWPlatform.MainScreen.closeTab('tab-' + tabId);
        },
		saveAndClose: function(dontClose){
			f = Ext.getCmp('form-' + tabId);
			if (f.form.isValid()) {
				//just compare passwords
				var password = f.form.findField('password');
				var repeatPassword = f.form.findField('repeatPassword');
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
				statusBar.showBusy('Updating profile data');
				
				//submit
				f.form.submit({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/profile_POST.js'
					,method: 'POST'
            		,waitTitle: 'Please wait!'
					,waitMsg: 'Updating profile data'
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
                        	 title: 'Profile update success'
                            ,msg: errorMsg
                            ,buttons: Ext.Msg.OK
                            ,icon: Ext.MessageBox.INFO
							,fn: function(){
								//update login-info
								if(typeof(dontClose) != 'boolean'){
									CWPlatform.MainScreen.destroyTab('tab-' + tabId);
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
                        	 title: 'Profile update error'
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
    };
	
	//define action
	actions.saveAndClose = new Ext.Action({
        disabled: true
        ,text: 'Ok'
        ,handler: handlers.saveAndClose
        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok_apply
		,tooltip: {
            text: '<h1>Save Changes And Close Tab</h1>'
        }
    });
	actions.cancel = new Ext.Action({
    	 text: 'Cancel'
        ,handler: handlers.cancel
        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_cancel
		,tooltip: {
            text: '<h1>Close without saving</h1>'
        }
    });
	actions.ok = new Ext.Action({
        disabled: true
        ,text: 'Apply'
        ,handler: handlers.ok
        ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_ok
		,tooltip: {
            text: '<h1>Save Changes</h1>'
        }
    });
	
	return {
		showTab: function(id){
			// set tId
			tabId = id;
			
			var tbar = new Ext.Toolbar({
	            id: 'tbar-' + tabId
	            ,items: [actions.saveAndClose, '-', actions.cancel, '-', actions.ok]
	        });
			
			//load form Data
			var loadFormData = function(cmp){
				statusBar = Ext.getCmp('status-bar');
				statusBar.showBusy('Loading profile data');
				
				//load form data
				cmp.form.load({
					 url: 'http://127.0.0.1:8000/CWPlatform/ajax/profile.js'
					,method: 'GET'
					,waitTitle: 'Please wait!'
					,waitMsg: 'Loading profile data'
					,success: function(form, action){
						//enable buttons
						actions.saveAndClose.setDisabled(false);
						actions.ok.setDisabled(false);
						statusBar.setStatus({
                             text:'Profile data loaded'
                        	,iconCls:''
							,clear: true
                        });
					},failure: function(form, action){
						Ext.MessageBox.show({
							title: 'Error'
							,msg: 'Could not load profile data'
							,buttons: Ext.Msg.OK
							,icon: Ext.MessageBox.ERROR
						});
						statusBar.setStatus({
                             text:'Could not load profile data'
                            ,iconCls:''
							,clear: true
                        });
					}
				});
			};
			
			var form = new Ext.FormPanel({
				 id: 'form-' + tabId
				,labelAlign: 'top'
				,border: false
				,anchor: "100% 100%"
				,deferredRender: false
				,tbar: tbar
				,listeners: {
					'render': function(cmp){
						loadFormData(cmp);
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
			
			var tab = CWPlatform.MainScreen.updateTab({
				 id: 'tab-' + tabId
				,title: 'Edit profile'
				,iconCls: Ext.ux.CWPlatform.Icons.icn_user_edit
				,items: form
			});
			
		}	
	}
}();