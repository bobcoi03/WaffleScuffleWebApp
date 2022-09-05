import React from 'react';

// Include getCookie("csrftoken") in "X-CSRFToken" headers 
// of POST,DELETE,PUT,PATCH http methods to verify with django

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

var csrftoken = getCookie('csrftoken');

class CSRFToken extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }


    render() {
        return (
            <input type="hidden" name="csrfmiddlewaretoken" value={this.props.csrftoken}/>
        );
    }
};
export { CSRFToken, getCookie}