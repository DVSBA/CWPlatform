/**
 * CWPlatform Login
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

// Required if showing validation messages
Ext.QuickTips.init();
Ext.QuickTips.enable();

// turn on validation errors beside the field globally
Ext.form.Field.prototype.msgTarget = 'side';

// Login
CWPlatform.Login = {
	
	// public methods
	showLoginDialog: function(){
		var loginButtons = [{
             id: 'loginbutton'
            ,text: 'Login'
            ,handler: CWPlatform.Login.loginHandler 
        }];
		
		var loginDialog = new Ext.FormPanel({
			 id: 'loginDialog'
            ,labelWidth: 75
			,url: '/ajax/login_POST.js'
            ,frame: true
            ,title: 'Please enter your login data'
            ,bodyStyle: 'padding:5px 5px 0'
            ,width: 350
            ,defaults: {
            	width: 230
            }
            ,defaultType: 'textfield'
            ,items: [{
                 fieldLabel: 'Username'
                ,id: 'username'
                ,name: 'username'
				,allowBlank: false
                ,width:225
            }, {
                 inputType: 'password'
                ,fieldLabel: 'Password'
                ,id: 'password'
                ,name: 'password'
                ,allowBlank: false
                ,width:225
            }]
            ,buttons: loginButtons
		});
		
		//render loginDialog
		loginDialog.render(document.body);
		
		Ext.Element.get('loginDialog').center();
        
        Ext.getCmp('username').focus();
        
		//enable enter key
        Ext.getCmp('username').on('specialkey', function(_field, _event) {
        	if(_event.getKey() == _event.ENTER){
        		CWPlatform.Login.loginHandler();
        	}
        });

		//enable enter key
        Ext.getCmp('password').on('specialkey', function(_field, _event) {
            if(_event.getKey() == _event.ENTER){
                CWPlatform.Login.loginHandler();
            }
        });
	},
	
	loginHandler: function(){
		var loginDialog = Ext.getCmp('loginDialog');
		
		if (loginDialog.getForm().isValid()) {
			loginDialog.getForm().submit({
				 waitTitle: 'Please wait!'
				,waitMsg: 'Logging you in...'
				,success: function(form, action) {
                    Ext.MessageBox.wait('Login successful. Loading CWPlatform', 'Please wait!');
                    window.location.href = 'cwplatform.html';
                }
                ,failure: function(form, action) {
                	var mesg = action.result.mesg;
                	var errorMsg = '';
                	Ext.each(mesg,function(field){
                		errorMsg += field.id + ' ' + field.msg + '<br />';
		            });
                	Ext.MessageBox.show({
                         title: 'Login error'
                        ,msg: errorMsg
                        ,buttons: Ext.Msg.OK
                        ,icon: Ext.MessageBox.ERROR
                    });
                }
			});
		}	
	}
};


Ext.onReady(function() {
	CWPlatform.Login.showLoginDialog();
});

