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


