{
	"results":[
		{
			"rule_id":"1",
			"role":"admin",
			"resource":'All',
			"privileges":"All",
			"rule":"allow",
			"description":"Admin has all privileges on all resources."
		},
		{
			"rule_id":"2",
			"role":"quest",
			"resource":'admin',
			"privileges":"All",
			"rule":"deny",
			"description":"Deny quest access to admin resource on all actions."
		},
		{
			"rule_id":"3",
			"role":"member",
			"resource":'admin',
			"privileges":"index,view",
			"rule":"allow",
			"description":"Allow member access to admin resource on index and view action."
		}
	],
	"totalcount":3,
	"status":"success"
}