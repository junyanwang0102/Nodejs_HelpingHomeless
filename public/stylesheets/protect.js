var pass1 = 'hello';
console.log(document.cookie);
if (document.cookie.split(';').filter(item => item.includes('password3=true')).length) {
} else {
	let password = prompt('Please enter your password to view this page!', '');
	if (password === pass1) {
		document.cookie = 'password3=true';
		console.log(document.cookie);
	}
	if (password !== pass1) {
		window.location = 'http://www.bringsmiles.tk';
	}
}