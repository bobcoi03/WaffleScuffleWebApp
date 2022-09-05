import fetch from "node-fetch";


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].toString().replace(/^([\s]*)|([\s]*)$/g, "");
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

fetch("http://127.0.0.1:8000/user-auth/signin",
		{	method: "DELETE",
				headers: {
					"X-CSRFToken": getCookie("csrftoken"),
					'Accept':'text/plain',
				},
		}
)
.then(res => res.text())
.then(resData => console.log(resData))

