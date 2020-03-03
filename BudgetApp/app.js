/*//NOTE:Using IIFE our code is private and does not affect another code
var budgetController = (function(){
    var a = 20;
    
    var add = function(inp){
        return a + inp;
    }
    
    //NOTE: to make smth public in IIFE, return function which returns needed parameter
    return {
        publicTest: function(b){
            return add(b);
        }
    }
})();*/

// BUDGET CONTROLLER
var budgetController = (function () {
	
	var data = {
		allItems: {
			exp: [],
			inc: [],
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		precentage: -1
	};

	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value,
		this.percentage = -1
	}
	
	Expense.prototype.caclPercentages = function(totalIncome){
		if (totalIncome > 0){
			this.percentage = Math.round((this.value / totalIncome) * 100);
		}
		else{
			this.percentage = -1;
		}
	}
	Expense.prototype.getPrecentage = function(){
		return this.percentage;
	}

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value
	}
	
	var calculateTotal = function (type){
		var sum = 0;
		data.allItems[type].forEach(function(el){
			sum += el.value;
		});
		data.totals[type] = sum;
	}

	return {
		addItem: function (type, descr, val) {
			var newItem, id;

			//creates new id
			//new id = id of the last existing income\expence in Data + 1
			if (data.allItems[type].length > 0) {
				id = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				id = 0;
			}

			//creates new item, pushes it to allItems and returns created item
			if (type == 'exp') {
				newItem = new Expense(id, descr, val);
			} else if (type == 'inc') {
				newItem = new Income(id, descr, val);
			} else {
				alert('Unknown expense\income type');
			}

			//TODO: do not push in case of unknown data type
			data.allItems[type].push(newItem);

			return newItem;
		},
		
		deleteItem: function (type, id){
			var ids, index;
			
			/* we can't do simply this - data.allItems[type][id]
			e.g. we want to delete id = 3 and we have id: [1 2 4 6 8]
			there is not item with id = 3, it was already deleted
			
			map is similar to forEach; it always with callback fucntion and returns smth
			difference - map returns a new array
			so, we can create an array with all ids using map, and than find actual index 
			via indexOf(<id from input>)
			*/
			
			ids = data.allItems[type].map(function(el){
				return el.id;
			})
			
			index = ids.indexOf(id);
			
			// -1 means we did not find items in array
			if (index !== -1){
				//splice(start position, amount)
				data.allItems[type].splice(index, 1);
			}
		},
		
		calculateBudget: function(){
			
			//calc total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');
			
			//cacl diff
			data.budget = data.totals.inc - data.totals.exp;
			
			//calc % of income that we spent
			if (data.totals.inc > 0){
				data.precentage = Math.round((data.totals.exp / data.totals.inc) * 100);				
			}
			else{
				data.precentage = -1;
			}
		},
		
		getBudget: function(){
			return {
				budget: data.budget,
				totalIncome: data.totals.inc,
				totalExpenses: data.totals.exp,
				percentage: data.precentage
			}
		},
		
		caclulatePercentages: function(){
			data.allItems.exp.forEach(function(el){
				el.caclPercentages(data.totals.inc);
			});
		},
		
		getPrecentages: function(){
			//map because it returns
			var allPrec = data.allItems.exp.map(function(el){
				return el.getPrecentage();
			});
			
			return allPrec;
		},
		
		testIt: function () {
			console.log(data);
		}
	}
})();


// UI CONTROLLER
var UIController = (function () {

	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputButton: '.add__btn',
		incomeContainer: '.income__list',
		expencesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};
	
	var formatNumber = function(num, type){
		//+ or - before the number
		//the same decimal part for all (2 numberes after point)
		//comma separating for >= 1k
			
		var numSplit, int, dec, sign;
			
		num = Math.abs(num);
		num = num.toFixed(2);
		numSplit = num.split('.');
			
		int = numSplit[0];
			
		if (int.length > 3){
			//we need to add a comma
			// 6,000,000
			//BAD DECISION
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);
		}
			
		dec = numSplit[1];
			
		type == 'inc' ? sign = '+' : sign = '-';
			
		return sign + ' ' + int + '.' + dec;
	};
	
	var nodeListForEach = function(list, callback){
		for (var i = 0; i < list.length; i++){
			callback(list[i], i);
		}
	};

	return {
		getDOMStrings: function () {
			return DOMStrings;
		},
		
		getInput: function () {
			return {
				type: document.querySelector(DOMStrings.inputType).value, // will be inc or exp
				description: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			}
		},

		//obj = newItem in controller
		addListItem: function (obj, type) {
			var html, newHtml, element;

			//create new HTML string with placeholder text
			if (type == 'inc') {
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
			} else if (type == 'exp') {
				element = DOMStrings.expencesContainer;
				html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">%percentage%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
			}
			
			//replace placeholders to actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
			newHtml = newHtml.replace('%percentage%', obj.percentage);

			//insert HTML into DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},
		
		deleteListItem: function(selectorID){
			var element = document.getElementById(selectorID);
			//in java we always delete a child
			element.parentNode.removeChild(element);
		},

		clearFields: function () {
			var fields, fieldsArray;

			fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
			
			/*					CLARIFICATION
			
			fields is not array 
			slice() can do this, but it's array method
			var b = a.slice();  -  actually, this copies array a to b
			but we can't simply call fields.slice(); for the same reason
			
			The call() method allows you to specify a method's context,
			basically making these two calls equivalent:
            someObject.slice(1, 2);
            slice.call(someObject, 1, 2);
			so, we've borrowed the Array method slice() here
			
			general structure - Array.prototype.slice.call(<object_name>, <start>, <end>);
			*/	
			
			fieldsArray = Array.prototype.slice.call(fields);	
			
			/*					CLARIFICATION
					
			The following works similar to for each  loops in C# or java
			e.g.
			for (element: elements){
				system.out.println(element.value);
			}
			for each element in elements show element value in console
			
			in JS this is part of Array.prototype.forEach
			and we should use callback function with single element as a input inside
			e.g.
			elements.forEach(function(element){
				console.log(element.value);
			});
			
			also looks like we do not need all 3 parameters here
			fieldsArray.forEach(function(current, index, array)
			we use only current later
			*/
			
			fieldsArray.forEach(function(element){
				element.value = "";
			});
			
			//set focus to the 1st input box
			fieldsArray[0].focus();
		},
		
		displayBudget: function(obj){
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';
			
			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'inc');
			document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExpenses, 'exp');
			
			if (obj.percentage > 0){
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
			}
			else {
				document.querySelector(DOMStrings.percentageLabel).textContent = '--';
			}
		},
		
		displayPercentage: function(percenteges){
			
		var nodes = document.querySelectorAll(DOMStrings.expensesPercLabel);
			
//!!!!!!!!!!!!!!!!! ONE MORE TRICK !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		
		//see var nodeListForEach	
			
		nodeListForEach(nodes, function(el, index){
				
				if (percenteges[index] > 0){
					el.textContent = percenteges[index] + '%';
				}
				else{
					el.textContent = '---';
				}
			});
		},
		
		displayMonth: function(){
			var now, year, month, months;
			
			months = ['Jan', 'Feb', 'March', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
			now = new Date();
			year = now.getFullYear();
			month = now.getMonth();
			
			document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ', ' + year;		
		},
		
		changeType: function(){
	    	
			var fields = document.querySelectorAll(
				DOMStrings.inputType + ',' +
				DOMStrings.inputDescription + ',' +
				DOMStrings.inputValue);
			
			nodeListForEach(fields, function(el){
				el.classList.toggle('red-focus');
			});
		}
	};
})();


//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

	var input, newItem, budget; 

	var setupEventListener = function () {
		var DOM = UICtrl.getDOMStrings();
		//ctrlAddItem here is a callback
		document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

		//not only onclick event, but enter too
		//so we should add EL to global doc
		document.addEventListener('keypress', function (event) {
			if (event.keyCode == 13 || event.which == 13) {
				ctrlAddItem();
			}
		});
		
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
		
		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
	}

	//placed here cause access outside is not needed
	var ctrlAddItem = function() {
	
		// 1. get input data
		input = UICtrl.getInput();
		console.log(input);
		
		if (input.description !== '' && !isNaN(input.value) && input.value > 0){
			// 2. add them to budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3. add a new item to UI 
			UICtrl.addListItem(newItem, input.type);

			// 4. clear fields
			UICtrl.clearFields();
		
			// 5. Calculate and update budget
			updateBudget();
			
			// 6. Cacl and upd precentages
			updadePercentages();
		}
	}
	
	//event is needed here to know what is target 
	var ctrlDeleteItem = function(event){
		var itemId, splitId, type, id;
		
		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
		
		if (itemId){
			//inc-1 => ['inc', '1']
			splitId = itemId.split('-');
			type = splitId[0];
			id = parseInt(splitId[1]);
			
			// 1. delete the item from the data structure
			
			budgetCtrl.deleteItem(type, id);
			
			// 2. delete it from UI
			UICtrl.deleteListItem(itemId);
			// 3. update and show new budget
			updateBudget();
		}
	}
	
	var updateBudget = function(){
		
		// 1. calculate budged 
		budgetCtrl.calculateBudget();
		
		// 2. return the budget 
		budget = budgetCtrl.getBudget();
		
		// 3. display budget on UI
		UICtrl.displayBudget(budget);
	}
	
	var updadePercentages = function(){
		//cacl perc
		budgetCtrl.caclulatePercentages();
		//read from budget controller
		var percentages = budgetCtrl.getPrecentages();
		//udp UI 
		UICtrl.displayPercentage(percentages);
	}

	// create public init func for event listeners initialization
	return {
		init: function () {
			UICtrl.displayBudget({
				budget: 0,
				totalIncome: 0,
				totalExpenses: 0,
				percentage: -1
			});
			UICtrl.displayMonth();
			setupEventListener();
		}
	}
})(budgetController, UIController);


/******** CALLED OUTSIDE ********/
controller.init();
