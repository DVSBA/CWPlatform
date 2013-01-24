/**
 * CWPlatform MainScreen
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */
// init Mainscreen
Ext.namespace('CWPlatform.MainScreen');
CWPlatform.MainScreen = function(){
    // private variables
	var tabPanel;
	
	var explorerPanel;
	
    // private functions
	/**
	 * Get Tab by id from tabPanel
	 * 
	 * @param {Object} id tab id
	 */
	var getTab = function(id){
		return tabPanel.getItem(id);
	};
	/**
	 * Add tab to tabPanel
	 * 
	 * @param {Object} config Object config for tab
	 */
	var addTab = function(config){
		//defaultTooltip
		if (!config.tooltip) {
			config.tooltip = '' 
		}
		tabPanel.add({
			id: config.id 
            ,title: config.title
			,tabTip: config.tooltip
			,iconCls: config.iconCls
            ,closable: true
			,items: config.items	
		}).show();	
	};
	/**
		 * expand Explorer Panel
		 */
	var	expandExplorerPanel = function(){		
		if (explorerPanel.collapsed) {
			explorerPanel.expand(true);
		}
	};
	
	// public space
    return {
        // public properties, e.g. strings to translate
		
        // public methods
		
		
		/**
		 * Update tab with content
		 * 
		 * @param {Object} config Object config for tab
		 */
		updateTab: function(config){
			var tab = getTab(config.id);
			if (tab) {
				// tab exists destroy it
				this.destroyTab(config.id);
			}
			//create tab
			tab = addTab(config);
			tabPanel.setActiveTab(tab);
			return getTab(config.id);
		},
		/** 
		 * Fires Message Box for tab close confirmation
		 * 
		 * @param {Object} id Tab id
		 */
		closeTab: function(id){
			var tab = getTab(id);
			if (tab) {
				var title;
				if (tab.tabTip) {
					title = tab.tabTip;
				} else {
					title = tab.title;
				}
				Ext.MessageBox.confirm("Confirm", 'Are you sure you want to close tab "' + Ext.util.Format.htmlEncode(title.replace(/(<([^>]+)>)/ig,"")) + '"?', function(btn){
	                if (btn == "yes") {
	               		tabPanel.remove(tab);
	                }
	            })
			}
		},
		/**
		 * Destroyes tab 
		 * 
		 * @param {Object} id Tab id
		 */
		destroyTab: function(id){
			var tab = getTab(id);
			if (tab) {
				tabPanel.remove(tab);
			}		
		},
		/**
		 * set Explorer Panel
		 * 
		 * @param {Object} config explorer panel config
		 */
		setExplorerPanel: function(item){
			if (explorerPanel.items) {
				while (explorerPanel.items.last()) {
	                explorerPanel.remove(explorerPanel.items.last().id);
	            }		
			}
			explorerPanel.add(item);
			explorerPanel.doLayout();
		},
		/**
		 *  Displays Main Screen
		 */
		display: function(){
			/**
			 *  Creatoor Menu
			 *  
			 */
			var creatoorMenu = new Ext.menu.Menu({
				 items: [{
				 	 text: 'About Creatoor webPlatform'
					 ,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_system_help
				}, '-', {
					 text: 'Theme'
					,iconCls: Ext.ux.CWPlatform.Icons.icn_layout_content
					,menu: {
						items:[
							 new Ext.menu.CheckItem({
							 	 text: 'Blue'
				                ,group: 'theme'
				                ,checked: true
							 })
							,new Ext.menu.CheckItem({
							 	 text: 'Gray'
				                ,group: 'theme'
				                ,checked: false
							})
							,new Ext.menu.CheckItem({
							 	 text: 'Slate'
				                ,group: 'theme'
				                ,checked: false
							})
						]
					}
				}]	
			});
			/**
			 *  Main menu implementet with Toolbar
			 */
			var toolbar = new Ext.Toolbar({
	    		 id: 'main-menu'
	    		,height: 26
	    		,items: [{
	             	 text:'Creatoor webPlatform'
					,tooltip: {
	                    text: '<h1>About webPlatform</h1>About webPlatform, change theme, ...'
	                }
					,menu: creatoorMenu
	          	},{
	            	 text:'Content'
	            	,iconCls: Ext.ux.CWPlatform.Icons.icn_application_view_columns
					,tooltip: {
	                    text: '<h1>Content Documents</h1>Edit articles, news, ...'
	                }
					,handler: function(){
						CWPlatform.Content.Main.showPanel();
						expandExplorerPanel();
					}
	          	},{
	            	 text:'File Manager'
	            	,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_system_file_manager
					,tooltip: {
	                    text: '<h1>File and Image Managaer</h1>Upload, edit, files, images, ...'
	                }
					,handler: function(){
						CWPlatform.FileManager.Main.showPanel();
						expandExplorerPanel();
					}
	          	},{
	            	 text:'Administration'
	            	,iconCls: Ext.ux.CWPlatform.Icons.icn_oxygen_preferences_system
					,tooltip: {
	                    text: '<h1>System administration</h1>Edit system settings, edit users ...'
	                }
					,handler: function(){
						CWPlatform.Administration.Main.showPanel();
						expandExplorerPanel();
					}
	           	},'->',{
	            	 text:'Aleš Lončar'
	            	,iconCls: Ext.ux.CWPlatform.Icons.icn_user_edit
	            	,id: 'login-info'
	            	,tooltip: {
	                    text: '<h1>Edit profile data</h1>Edit your profile data'
	                }
					,handler: function(){
						CWPlatform.UserProfile.showTab('tab-login-info');
					}
	           	},'-',{
					 text: 'Search'
	            	,iconCls: Ext.ux.CWPlatform.Icons.icn_magnifier
	            	,tooltip: {
	                    text: '<h1>Search</h1>Search for content documents'
	                } 
				},'-',{
					 text: 'Logout'
	            	,iconCls: Ext.ux.CWPlatform.Icons.icn_status_offline
	            	,tooltip: {
	                    text: '<h1>Logout</h1>Exit from webPlatform'
	                }
					,handler: function(){
						Ext.MessageBox.confirm('Confirm', 'Are you sure you want to logout?', function(btn){
							if (btn == 'yes') {
								Ext.MessageBox.wait("Logging you out...", "Please wait!");
								window.location = 'logout.html';	
							}
						})
					}
				}]
	    	});
			/**
			 * View Port 
			 */
	        var vw = new Ext.Viewport({
	             layout:'border'
	            ,items: [{
	                 region: 'north'
	                ,id: 'north-panel'
	                ,title: 'Creatoor webPlatform 0.1'
	                ,collapsible: false
	                ,split: false
	                ,height: 52
					,margins:'0 0 2 0'
	                ,items: toolbar
	            },{
	                 region: 'south'
	                ,id: 'south-panel'
	                ,border: false
					,split: false
	                ,collapsible: false
					,margins:'2 0 0 0'
	                ,bbar: new Ext.StatusBar({
				    	 id: 'status-bar'
				        // defaults to use when the status is cleared:
				        ,defaultText: ''
				        // values to set initially:
				        ,text: 'webPlatform ready'
				    })
	            },new Ext.TabPanel({
	                 region:'center'
	                ,id: 'center-panel'
					,layoutOnTabChange: true
	                ,deferredRender: false
					,enableTabScroll: true
			        ,defaults: {autoScroll: true}
	                ,activeTab:0
					,border: true
					,margins:'0 5 0 0'
					,plugins: new Ext.ux.TabCloseMenu()
	                ,items:[{
	                    contentEl:'tab-welcome'
	                    ,title: 'Dashboard'
	                    ,closable: false
	                }]
	            }),{
	                 region: 'west'
	                ,id: 'west-panel'
	                ,split:true
	                ,width:300
					,minSize:300
	                ,maxSize:400
	                ,collapsible:true
					,border:true
					,containerScroll: true
					,collapseMode:"mini"
	                ,layout:'fit'
	                ,defaults:{}
					,margins:'0 0 0 5'
	            }]
				,listeners: {
					'render': function(){
						//init tabPanel
						tabPanel = Ext.getCmp('center-panel');
						//init explorerPanel
						explorerPanel = Ext.getCmp('west-panel');
						
						CWPlatform.Content.Main.showPanel();
						
						window.setTimeout(function(){
							Ext.get('loading').remove();
			    			Ext.get('loading-mask').fadeOut({remove:true});
						},1000);
					}
				}
	        });
		}
    }   
}();