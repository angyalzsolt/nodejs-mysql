
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
	e.preventDefault();
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
		
	}).fail((msg)=>{
		console.log('ERROR OCCURED', msg.responseText);
	})
})

//================ GET POSTS =====================
$.get('/home/posts', (data)=>{

	posts = data.posts;
	renderPosts(posts);
	generateUserDom(data.user)
})


$('#search_field').on('input', (e)=>{
	console.log(posts);
	setFilters({
		searchText: e.target.value
	});
	renderPosts(posts);
})


const generatePostDom = (post)=>{
	// console.log(post.title)
	const postEl = document.createElement('div');
	const title = document.createElement('p');
	const type = document.createElement('p');
	const body = document.createElement('p');
	const footer = document.createElement('p');


	title.classList.add('post-title');
	title.textContent = post.title;
	postEl.appendChild(title);

	type.classList.add('post-type');
	type.textContent = post.type_of;
	postEl.appendChild(type);

	body.classList.add('post_body');
	body.textContent = post.post_body;
	postEl.appendChild(body);

	footer.classList.add('post');
	footer.textContent = `by - ${post.user.name}`;
	postEl.appendChild(footer);



	return postEl;


	// $('#post_target').append(`<p class='post-title'>${post.title}</p><p class='post-type'>${post.type_of}</p><p>${post.post_body}</p><p>${post.createdAt}</p><i>by - ${post.user.name}</i><hr>`);
}

const generateUserDom = (user)=> {
	$('#user_target').prepend(`<p class='user-name'>${user.name}</p><p class='user-data'>${user.email}</p><p class="user-data">${user.telephone}</p><p class="user-data">${user.address}</p>`);
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

	filteredPosts.forEach((post)=>{
		const postEl = generatePostDom(post)
		postsEl.append(postEl);
	})
}