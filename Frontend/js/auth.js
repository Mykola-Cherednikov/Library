checkAuth()

async function checkAuth() {
    var path = window.location.pathname;
    var page = path.split("/").pop();

    switch(page){
        case "Login.html":
            if (!getCookie('Token')) {
                return
            }
            response = await CheckToken()
            if (response.ok) {
                window.location.href = "../Book.html"
            }
            break;
        default:
            if (!getCookie('Token')) {
                backToLogin()
            }
            response = await CheckToken()
            if (!response.ok) {
                backToLogin()
            }
            break;
    }
}

async function CheckToken() {
    return await fetch(apiIP + '/api/Authorization/CheckToken', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })
}

function backToLogin() {
    eraseCookie('Token')
    window.location.href = "../Login.html"
}

