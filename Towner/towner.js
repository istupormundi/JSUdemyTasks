/******** CLASSES ********/
class TownElement{
	constructor(name, buildYear){
		this.name = name;
		this.buildYear = buildYear;
	}
	
	getName(){
		return this.name;
	}
	
	getAge(){
		return (new Date().getFullYear() - this.buildYear);
	}
}

class Park extends TownElement{
	constructor(name, buildYear, numberOfTrees, area){
		super(name, buildYear);
		this.numberOfTrees = numberOfTrees;
		this.area = area;
	}

	getTreeDensity(){
		if (this.area != 0){
			return this.numberOfTrees / this.area;
		}
		else{
			alert('Division by zero is forbidden in our town!');
			return -1;
		}
	}
}

class Street extends TownElement{
	constructor(name, buildYear, length, size = 'normal'){
		super(name, buildYear);
		this.length = length;
		this.size = size;
	}

	classifySize(){	
		const sizeClassificator = new Map();
		sizeClassificator.set(1, 'tiny');
		sizeClassificator.set(2, 'small'); 
		sizeClassificator.set(3, 'normal');
		sizeClassificator.set(4, 'big');
		sizeClassificator.set(5, 'huge');

		if (!sizeClassificator.has(this.length)){
			//console.log(`${this.name} has unknown street size.`);
			sizeClassificator.set(3, 'normal');
		}
		
		console.log(`${this.name} is ${sizeClassificator.get(this.length)}.`);
	}
}
	
	
/******** INSTANCES ********/
const park1 = new Park('Park1', 2000, 42, 50);
const park2 = new Park('Park2', 2001, 43, 500);
const park3 = new Park('Park3', 2002, 4400, 5000);

const street1 = new Street('Street1', 2000, 1);
const street2 = new Street('Street2', 2001, 3);
const street3 = new Street('Street3', 2002, 5);
const street4 = new Street('Street4', 2003, 10);

var allParks = [park1, park2, park3];
var allStreets = [street1, street2, street3, street4];


/******** PRIVATE FUNCTIONS *********/
function getAverageAge(classType){
	//TODO: use .reduce()
	let sumOfAges = 0;
	const year = new Date().getFullYear();

	classType.forEach(el => {	
		const age = year - el.buildYear;
		sumOfAges += age;
	});

	if (classType.length){
		console.log(`Average age, years: ${sumOfAges / classType.length}.`);
	}
	else{
		alert('Sorry. division by zero is forbidden in our town!');
		return -1;
	}
}


/******** PUBLIC FUNCTIONS *********/
function printTreeDensityForAllParks() {
	allParks.forEach(el => console.log(`Tree density in ${el.name}, trees/m2: ${el.getTreeDensity()}.`));
}

function calculateAverageParkAge() {
	getAverageAge(allParks);
}

function findGiantParks(){
	//TODO: use .findIndex
	//e.g. <select>(el => el.num).findIndex(el => el >= 1000); 
	let giantCount = 0;

	allParks.forEach(el => {
		if (el.numberOfTrees > 1000){
			giantCount += 1;
			console.log(`The park ${el.name} is a giant.`);
		}
	});

	if (giantCount === 0){
		console.log('There are not giant parks at all.');
	}
}

function calculateTotalStreetLength(){
	//TODO: use arr.reduce()
	//const sum = arr.reduce((prev, cur, index) => prev + cur, 0);
	let totalLength = 0;

	allStreets.forEach(el => totalLength += el.length);

	//console.log(`Total street length, m: ${totalLength}`);

	return totalLength;
}

function calculateAverageStreetLength(){
	const avStreetLenght = calculateTotalStreetLength() / allStreets.length;
	
	console.log(`Average street length, m: ${avStreetLenght}`);
}

function calculateAverageStreetAge(){
	getAverageAge(allStreets);
}

function classifyStreetSize(){
	allStreets.forEach(el => el.classifySize());
}

function generateFinalReport(){
	console.log('FINAL REPORT\n\n1.TREE DENSITY\n');
	printTreeDensityForAllParks();

	console.log('\n2.AVERAGE AGES OF PARKS\n');
	calculateAverageParkAge();

	console.log('\n3.GIANT PARKS\n');
	findGiantParks();

	console.log('\n4.TOTAL STREET LENGTH\n');
	console.log(`Total street length, m: ${calculateTotalStreetLength()}`);

	console.log('\n5.AVERAGE STREET LENGTH\n');
	calculateAverageStreetLength();

	console.log('\n6.AVERAGE STREET AGE\n');
	calculateAverageStreetAge();

	console.log('\n7.STREET SIZE CLASSIFICATOR\n');
	classifyStreetSize();
}


/********** OUTSIDE CALLS ************/
generateFinalReport();