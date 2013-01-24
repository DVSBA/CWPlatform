/**
 * CWPlatform Application
 * 
 * @author Ales Loncar <ales@creatoor.com>
 * @version 0.1
 */
// App
CWPlatform.App = function(){
	// private variables
	
    // private functions
	
	// public space
    return {
        // public properties, e.g. strings to translate
        
		
        // public methods
        init: function(){
			// cookie
		    Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
		
		    // Required if showing validation messages
		    Ext.QuickTips.init();
		
		    // turn on validation errors beside the field globally
		    Ext.form.Field.prototype.msgTarget = 'side';
			
			CWPlatform.MainScreen.display();	
		}
    }
}();
			
Ext.onReady(CWPlatform.App.init, CWPlatform.App);