let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);
const loginBtn = document.querySelector('.login');

seasonOptions.addEventListener('click', function (evt) {
	seasonFilter = evt.target.value;
	filterData();
});

loginBtn.addEventListener('click', priceGarments)


function login() {
	axios
		.get(`http://localhost:4017/api/login`)
		.then(function (result) {
			console.log(result)
			const {token}= result.data;
			localStorage.setItem('token', token)
		})

		.catch(function (err) {
			console.log(err)
		})
}

login()
genderOptions.addEventListener('click', function (evt) {
	genderFilter = evt.target.value;
	filterData();
});

function garments() {
	const token =localStorage.getItem('token')
	const url=`http://localhost:4017/api/garments/price/:price?token=${token}`
	axios
	
		.get(url, function (result) {
			console.log(result)
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			});
		});
}

function priceGarments() {
	axios
		.get(`http://localhost:4017/api/garments/price/:price`, function (result) {
			console.log(result.data)
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			});
		});
}

function filterData() {
	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`
			// , {
			// headers: {
			//   'Authorization': `token ${access_token}`
			// }
			//  } 
		)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
}

priceRangeElem.addEventListener('change', function (evt) {
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	const token =localStorage.getItem('token');
	const url=`http://localhost:4017/api/garments/price/${maxPrice}?token=${token}`;
	axios
		.get(url)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
});

filterData();
