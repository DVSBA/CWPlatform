/**
 * CWPlatform Administration
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */

// include Administration/AclRules;
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/AclRules.js');

// include Administration/AclRule;
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/AclRule.js');

// include Administration/AclRoles;
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/AclRoles.js');

// include Administration/AclRole;
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/AclRole.js');

// include Administration/AclResources;
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/AclResources.js');

// include Administration/AclResource
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/AclResource.js');

// include Administration/Users;
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/Users.js');

// include Administratio/User;
includeJavaScript('http://127.0.0.1:8000/CWPlatform/js/CWPlatform/Administration/User.js');

Ext.namespace("CWPlatform.Administration");
CWPlatform.Administration = {
	/**
	 * accordion id
	 */
	accordionId: null,
	
	/**
	 * handlers
	 */
	handlers: {
		 usersShow:function(){
			CWPlatform.Administration.Users.show('usersShow-' + this.accordionId);
        }
		,usersNewUser:function(){
			CWPlatform.Administration.User.add();
        }
		,aclResourcesShow:function(){
			CWPlatform.Administration.AclResources.show('ACLResourcesShow-' + this.accordionId);
		}
		,aclRolesShow:function(){
			CWPlatform.Administration.AclRoles.show('ACLRolesShow-' + this.accordionId);
		}
		,aclRightsPrivilegesShow:function(){
			CWPlatform.Administration.AclRules.show('ACLRulesShow-' + this.accordionId);
		}
    },
	
	/**
	 * get Administration panel
	 * 
	 * @param {Object} config
	 */
	getPanel: function(config){
		this.accordionId = config.id;
				
		var users = new Ext.ux.MenuPanel({
			 title: 'Users'
			,border: false
			,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_users
			,menu: new Ext.menu.Menu({
				 id: 'users-' + config.id
				,items: [{
	            	 text: 'Show'
					,iconCls: Ext.ux.CWPlatform.Icons.icn_group
					,handler: this.handlers.usersShow
					,scope: this
	            },{
	            	 text: 'New User'
					,iconCls: Ext.ux.CWPlatform.Icons.icn_user_add
					,handler: this.handlers.usersNewUser
					,scope: this
	            }]
			})
		});
		
		var acl = new Ext.ux.MenuPanel({
			 title:'Access Control List'
			,border:false
			,iconCls:Ext.ux.CWPlatform.Icons.icn_oxygen_dialog_password
			,menu: new Ext.menu.Menu({
				 id:'acl-' + config.id
				,items: [{
	            	 text: 'Resources'
					,iconCls: Ext.ux.CWPlatform.Icons.icn_page_key
					,handler: this.handlers.aclResourcesShow
					,scope: this
	            },{
	            	 text: 'Roles'
					,iconCls: Ext.ux.CWPlatform.Icons.icn_group_key
					,handler: this.handlers.aclRolesShow
					,scope: this
	            },{
	            	 text: 'Rights / Privileges'
					,iconCls: Ext.ux.CWPlatform.Icons.icn_lock
					,handler: this.handlers.aclRightsPrivilegesShow
					,scope: this
	            }]
			})
		});
		
		var accordion = new Ext.ux.CWPlatform.Panel.Accordion({
			 id: 'accordion-' + config.id 
			,title: config.title
			,items: [ users, acl,{
				 id: 'system-settings-' + config.id
				,border: false
				,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_system
		    	,title: 'System Settings'
		    }]
		});
		
		return accordion;
	}
};

/** 
 * Main panel 
 */
CWPlatform.Administration.Main = {
	showPanel: function(){
		var panel = CWPlatform.Administration.getPanel({
			 id: 'explorer-administration'
			,title: 'Administration'	
		});
		
		//add Administration to explorerPanel
		CWPlatform.MainScreen.setExplorerPanel(panel);
	}
};