const notificationModal = new bootstrap.Modal(document.getElementById('notification-modal'), {
    keyboard: false
})
const notificationText = document.getElementById("notificationText")

function showNotificationWithText(text) {
    notificationText.innerText = text
    notificationModal.show()
}

async function tryLogin() {
    try {
        let form = document.forms.loginForm;

        let queryBody = {
            login: form.elements.login.value,
            password: form.elements.password.value
        }

        let response = await fetch(apiIP + '/api/Authorization', {
            method: 'POST',
            body: JSON.stringify(queryBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let json = await response.json();
        if (response.ok) {
            successLogin(json)
        } else {
            let errorText

            if (response.status == 401) {
                errorText = 'Неправильний логін чи пароль'
            }
            else {
                errorText = json
            }

            showNotificationWithText(errorText)
        }
    } catch (error) {
        showNotificationWithText('Невдала спроба підключитися до серверу')
    }
}

function successLogin(data) {
    setCookie("Token", "Bearer ".concat(data.token), 1)
    window.location.href = "../Genre.html"
}

