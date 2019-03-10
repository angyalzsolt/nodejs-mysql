// let moment = require('moment');


// ============= LOG OUT =====================
$('#logout').on('click', (e)=>{
	$.ajax({
		url: '/home',
		method: 'DELETE'
	}).done((msg)=>{
		window.location.replace('/login');
	}).fail((msg)=>{
		console.log('ERROR OCCURED: ', msg.responseText);
	})
});
let posts;

// ==================== CREATE POST =======================
$('#posts').on('submit', (e)=>{
	// e.preventDefault();
	let post = {
		title: e.target.elements.title.value,
		type: e.target.elements.typeOf.value,
		post_body: e.target.elements.post_body.value
	}
	console.log(post);

	$.ajax({
		url: '/home/post',
		method: 'POST',
		data: post
	}).done((msg)=>{
		console.log('ITS DONE', msg);
		// renderPosts(posts);
		
	}).fail((msg)=>{
		console.log('ERROR OCCURED', msg.responseText);
	})
})

//================ GET POSTS =====================
$.get('/home/posts', (data)=>{
	// console.log('This is the data from get request: ', data);
	posts = data.posts;
	renderPosts(posts);
	generateUserDom(data.user)
})

// ============== FILTER POSTS =======================
$('#search_field').on('input', (e)=>{
	// console.log(posts);
	setFilters({
		searchText: e.target.value
	});
	renderPosts(posts);
})


const generatePostDom = (post)=>{
	// console.log('This is a post: ', post);
	// console.log(post.title)
	const postEl = document.createElement('div');
	const authorEl = document.createElement('p');
	const title = document.createElement('p');
	const type = document.createElement('p');
	const body = document.createElement('p');
	const footer = document.createElement('p');
	const img = document.createElement('img');


	postEl.classList.add('post-con');

	const rightSide = document.createElement('div');

	authorEl.classList.add('author');
	authorEl.textContent = post.user.name;
	rightSide.appendChild(authorEl);

	img.classList.add('profile-img');
	let imgSrc = post.user.img !== null ? post.user.img.url : 'icon.jpg'
	img.setAttribute('src', imgSrc);
	postEl.appendChild(img);


	title.classList.add('post-title');
	title.textContent = post.title;
	rightSide.appendChild(title);

	type.classList.add('post-type');
	type.textContent = `- ${post.type_of}`;
	rightSide.appendChild(type);

	body.classList.add('post-body');
	body.textContent = post.post_body;
	rightSide.appendChild(body);

	footer.classList.add('post-time');
	let t = Date.parse(post.createdAt);
	footer.textContent = `at - ${post.createdAt}`;
	rightSide.appendChild(footer);
	// postEl.appendChild(postEl);
	postEl.appendChild(rightSide);



	return postEl;


	// $('#post_target').append(`<p class='post-title'>${post.title}</p><p class='post-type'>${post.type_of}</p><p>${post.post_body}</p><p>${post.createdAt}</p><i>by - ${post.user.name}</i><hr>`);
}

const generateUserDom = (user)=> {
	// console.log(user[0]);

	// first row container
	const upRow = document.createElement('div');
	upRow.classList.add('first-row');
	//image 
	const imgEl = document.createElement('img');
	imgEl.classList.add('user-profile-img');
	let imgSrc = user[0].img !== null ? user[0].img.url : 'icon.jpg';
	imgEl.setAttribute('src', imgSrc);
	upRow.appendChild(imgEl);


	let rightPart = document.createElement('div');
	//name
	const nameEl = document.createElement('p');
	nameEl.classList.add('profile-name');
	nameEl.textContent = user[0].name;
	rightPart.appendChild(nameEl);
	//edit 



	const emailEl = document.createElement('p');
	emailEl.classList.add('user-data');
	emailEl.textContent = user[0].email;
	rightPart.appendChild(emailEl);


	const addressEl = document.createElement('p');
	addressEl.classList.add('user-data');
	addressEl.textContent = user[0].address;
	rightPart.appendChild(addressEl);

	const editEl = document.createElement('a');
	editEl.classList.add('edit-text');
	editEl.setAttribute('href', '/profile');
	editEl.textContent  = "Edit your profile";
	rightPart.appendChild(editEl);
	upRow.appendChild(rightPart);

	const target = document.getElementById('user_target');

	target.prepend(upRow);

	// $('#user_target').prepend(`<img class='user-profile-img' src='${imgSrc}'> <p class='user-name'>${user[0].name}</p><p class='user-data'>${user[0].email}</p><p class="user-data">${user[0].telephone}</p><p class="user-data">${user[0].address}</p>`);
}



const filters = {
	searchText: '',
	typePost: ''
}

const getFilters = ()=> filters;

const setFilters = (text)=>{
	if(typeof text.searchText === 'string'){
		filters.searchText = text.searchText;
	}

	if(typeof text.typePost === 'string'){
		filters.typePost = text.typePost;
	}
}

const renderPosts = (posts) =>{

	const filters = getFilters();
	const filteredPosts = posts.filter((post)=>{
		return post.title.toLowerCase().includes(filters.searchText.toLowerCase())
	})
	const postsEl = document.querySelector('#post_target');

	postsEl.innerHTML = '';
	if(filteredPosts.length > 0){
		filteredPosts.forEach((post)=>{
			const postEl = generatePostDom(post)
			postsEl.append(postEl);
		})
	} else {
		const msgEl = document.createElement('div');
		msgEl.classList.add('empty-message-box');
		const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No post to show';
        emptyMessage.classList.add('empty-message');
        msgEl.appendChild(emptyMessage);
        postsEl.appendChild(msgEl);
	}

}