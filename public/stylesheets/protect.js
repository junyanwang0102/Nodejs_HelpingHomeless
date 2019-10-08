var password;
var pass1 = 'hello';

password = prompt('Please enter your password to view this page!', '');

if (password == pass1) 
	alert('Password Correct! Click OK to enter!');
else {
	window.location = 'http://bringsmiles.tk';
}