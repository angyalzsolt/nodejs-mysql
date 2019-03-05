
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

	$.get('/home/posts', (data)=>{
		console.log('GET DATA')
		data.forEach((post)=>{
			generatePostDom(post);
		})
})
})

//================ GET POSTS =====================
$.get('/home/posts', (data)=>{
	data.forEach((post)=>{
		// console.log(post.user.name)

		generatePostDom(post);
	})
})

const generatePostDom = (post)=>{
	console.log(post.title)
	
	$('#post_target').append(`<h3>${post.title}</h3><p>${post.createdAt}</p><i>By - ${post.user.name}</i>`);
	

}