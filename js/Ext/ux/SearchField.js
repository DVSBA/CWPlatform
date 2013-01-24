Ext.ux.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    // Constructor Defaults, can be overridden by user's config object
    paramName: "query",
    selectOnFocus: true,
    emptyText: "enter searchfilter",
    validationEvent: false,
    validateOnBlur: false,
    trigger1Class: "x-form-clear-trigger",
    trigger2Class: "x-form-search-trigger",
    hideTrigger1: true,
    width: 180,
    hasSearch: false,
    
    initComponent: function(){
        // Called during component initialization
        Ext.ux.SearchField.superclass.initComponent.call(this);
        this.on("specialkey", function(A, B){
            if (B.getKey() == B.ENTER) {
                this.onTrigger2Click()
            }
        }, this)
    },
    
    // Override other inherited methods 
    onTrigger1Click: function(){
        if (this.hasSearch) {
            this.el.dom.value = "";
            this.fireEvent("change", this, this.getRawValue(), this.startValue);
            this.startValue = this.getRawValue();
            this.triggers[0].hide();
            this.hasSearch = false
        }
    },
    onTrigger2Click: function(){
        var A = this.getRawValue();
        if (A.length < 1) {
            this.onTrigger1Click();
            return
        }
        this.fireEvent("change", this, this.getRawValue(), this.startValue);
        this.startValue = this.getRawValue();
        this.hasSearch = true;
        this.triggers[0].show()
    }
});