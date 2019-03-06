let user = {};

navigator.geolocation.getCurrentPosition((position)=>{

	if(navigator.geolocation) {
		user.location = `${position.coords.latitude}, ${position.coords.longitude}`
	}
	console.log(user);
}, (err)=>{
	console.log(err);
})

$('#register').on('submit', (e)=>{
	e.preventDefault();
	user.name = e.target.elements.name.value;
	user.email = e.target.elements.email.value;
	user.password = e.target.elements.password.value;
	console.log(user);
	$.ajax({
		url:'/register',
		method: 'POST',
		data: user
	}).done((msg)=>{
		window.location.replace('login?sign-up-success');
	}).fail((msg)=>{
		$('.error-msg').html('Wrong credentials, try again.');
		console.log('Error', msg.responseText);
	})

})




