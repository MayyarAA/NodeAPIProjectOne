const express = require('express');
const app = express();
const PORT = 3200;
const axios = require('axios');

//to ensure node project is running correctly on your local environment
app.get('/', (req, res) => {
	res.send('Hello World!');
});
app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`);
});

//standard error message for the API errors
const errorEmpty = 'Error, please provide a non empty tag for the API call';

//this dictionary will contain all the results of the multiple API GET calls  for the blog posts
//final answer will be inside allPosts
let allPosts = {};

//Step 1: make the GET call to retrive the blog posts
async function makeAxiosCallGetOne(tagValue) {
	let tag = tagValue;
	if (tag === '' || tag === ' ') {
		console.log(errorEmpty);
		return new Error(errorEmpty);
	}
	let URL = `https://api.hatchways.io/assessment/blog/posts?tag=${tag}`;
	// axios
	let resultData;
	await axios.get(URL).then(
		(response) => {
			resultData = response;
		},
		(error) => {
			console.log(error);
		}
	);
	return resultData.data.posts;
}

//Step 2: combine the blog posts calls across multiple tage types
async function renderPostData() {
	//making seperate call for each tag
	let apiResponseData = await makeAxiosCallGetOne('tech');
	let apiResponseData2 = await makeAxiosCallGetOne('history');
	//using a dictionary to ensure we remove duplicate posts, post id it the key
	for (let i = 0; i < apiResponseData.length; i++) {
		allPosts[apiResponseData[i].id] = apiResponseData[i];
	}
	for (let i = 0; i < apiResponseData2.length; i++) {
		allPosts[apiResponseData2[i].id] = apiResponseData2[i];
	}
}

//Step 3: Testing the APIs using both the API response answers & standerd edge case error handling

//Testing Function Calls:

//to test API using solution answers run this function below: checkFullAnswer
// checkFullAnswer();

async function checkWithAnswersAPICall() {
	let resultData;
	let URL =
		'https://api.hatchways.io/assessment/solution/posts?tags=history,tech&sortBy=likes&direction=desc';
	// axios
	await axios.get(URL).then(
		(response) => {
			// console.log(response.data);
			resultData = response.data.posts;
		},
		(error) => {
			console.log(error);
		}
	);
	return resultData;
}

async function checkFullAnswer() {
	await renderPostData();
	let answeResults = await checkWithAnswersAPICall();
	let allPostsAnswer = {};
	for (let i = 0; i < answeResults.length; i++) {
		allPostsAnswer[answeResults[i].id] = answeResults[i];
	}
	for (let key in allPosts) {
		if (
			allPostsAnswer[key].author != allPosts[key].author ||
			allPostsAnswer[key].id != allPosts[key].id
		) {
			console.log(
				'Error there is a diff b/w keys in the allPostsAnswer & allPosts' +
					'allPostsAnswer[key].author ' +
					allPostsAnswer[key].author +
					' allPosts[key].author ' +
					allPosts[key].author
			);
		}
	}
	if (Object.keys(allPostsAnswer).length != Object.keys(allPosts).length) {
		console.log(
			'Error there is a diff b/w allPostsAnswer length & allPosts.length, please resolve isssue'
		);
	}
}

//to test API use this function below: testAPI
// testAPI();
async function testAPI() {
	let res = makeAxiosCallGetOne('');
	// console.log(typeof res);
	if (typeof res != 'object') {
		console.log('Your API is not handling empty tag values correctly');
	}

	let apiResponseData = await makeAxiosCallGetOne('tech');
	let apiResponseData2 = await makeAxiosCallGetOne('history');
	if (apiResponseData.length <= 0) {
		console.log('The API response for apiResponseData is empty');
	}
	if (apiResponseData2.length <= 0) {
		console.log('The API response for apiResponseData2 is empty');
	}
}
