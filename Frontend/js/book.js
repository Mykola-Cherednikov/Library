const Modal = new bootstrap.Modal(document.getElementById('Modal'), {
    keyboard: false
})
const form = document.forms.form
const genresChoice = new Choices(form.elements.genres, {
    removeItemButton: true,
    searchEnabled: true,
    noResultsText: 'Нема результатів',
    noChoicesText: 'Нема з чого вибирати =(',
    itemSelectText: 'Натисніть для вибору'
});
const authorsChoice = new Choices(form.elements.authors, {
    removeItemButton: true,
    searchEnabled: true,
    noResultsText: 'Нема результатів',
    noChoicesText: 'Нема з чого вибирати =(',
    itemSelectText: 'Натисніть для вибору',
});
const tableBody = document.getElementById("table-body")
const modalTitle = document.getElementById("modal-title")
const modalFooter = document.getElementById("modal-footer")
const findInput = document.getElementById("findInput")
const findSelect = document.getElementById("findSelect")
findInput.addEventListener("input", (event) => {
    tryFilterData();
});
findSelect.addEventListener("change", (event) => {
    tryFilterData();
});
const notificationModal = new bootstrap.Modal(document.getElementById('notification-modal'), {
    keyboard: false
})
const notificationText = document.getElementById("notificationText")

var bookList = []

reloadData()

function showNotificationWithText(text) {
    notificationText.innerText = text
    notificationModal.show()
}

function clearTable() {
    while (tableBody.firstChild) {
        tableBody.firstChild.remove()
    }
}

function fillTable(dataList) {
    for (element of dataList) {
        let rowElement = document.createElement("tr")
        tableBody.appendChild(rowElement)

        let genresVal = ''
        let i = 0
        for (genre of element.genres) {
            if (i > 0) {
                genresVal += ', '
            }

            genresVal += genre.name
            i++
        }

        let authorsVal = ''
        i = 0
        for (author of element.authors) {
            if (i > 0) {
                authorsVal += ', '
            }

            authorsVal += author.fullName
            i++
        }

        rowElement.innerHTML = '<th scope="row" class="align-middle">' + element.id
            + '</th><td class="align-middle">' + element.name
            + '</td><td class="align-middle">' + element.publishDate
            + '</td><td class="align-middle">' + authorsVal
            + '</td><td class="align-middle">' + genresVal
            + '</td><td class="align-middle"><button type="button" onClick="openDetailsModal(' + element.id
            + ')" id="Details" class="btn btn-info me-2">Деталі</button><button type="button" onClick="openEditModal(' + element.id
            + ')" id="Edit" class="btn btn-warning me-2">Редагувати</button><button type="button" onClick="openDeleteModal(' + element.id
            + ')" id="Delete" class="btn btn-danger me-2">Видалити</button></td>'
    }
}

async function reloadData() {
    await getBooksData()
    loadAuthors()
    loadGenres()
    reloadTable()
}

function reloadTable() {
    clearTable()

    let filteredData = filterData()
    
    fillTable(filteredData)
}

function tryFilterData() {
    reloadTable()
}

function filterData() {
    if (findInput.value.length < 3) {
        return bookList
    }

    let filteredData = []
    let findVal = findInput.value.toLowerCase()


    switch (findSelect.value) {
        case "byName":
            for (book of bookList) {
                if (book.name.toLowerCase().match(findVal)) {
                    filteredData.push(book)
                }
            }
            break
        case "byAuthor":
            for (book of bookList) {
                for (author of book.authors) {
                    if (author.fullName.toLowerCase().match(findVal)) {
                        filteredData.push(book)
                        break
                    }
                }
            }
            break
    }
    return filteredData
}

async function getBooksData() {

    let response = await fetch(apiIP+'/api/Books', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    if (response.ok) {
        let json = await response.json();
        bookList = json
    } else {
        showNotificationWithText(await response.json())
    }
}

async function createBook() {
    let queryBody = {
        name: form.elements.name.value,
        publishDate: form.elements.publishDate.value,
        IdAuthors: authorsChoice.getValue(true),
        IdGenres: genresChoice.getValue(true)
    }

    let response = await fetch(apiIP+'/api/Books/Create', {
        method: 'POST',
        body: JSON.stringify(queryBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        reloadData()
    } else {
        showNotificationWithText(await response.json())
    }
}

async function deleteBook() {
    let response = await fetch(apiIP+'/api/Books/Delete/' + form.elements.id.value, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        reloadData()
    } else {
        showNotificationWithText(await response.json())
    }
}

async function editBook() {
    let queryBody = {
        id: form.elements.id.value,
        name: form.elements.name.value,
        publishDate: form.elements.publishDate.value,
        IdAuthors: authorsChoice.getValue(true),
        IdGenres: genresChoice.getValue(true)
    }

    let response = await fetch(apiIP+'/api/Books/Edit', {
        method: 'PUT',
        body: JSON.stringify(queryBody),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    Modal.hide()
    if (response.ok) {
        reloadData()
    } else {
        showNotificationWithText(await response.json())
    }
}

function openDetailsModal(id) {
    let element = getElementById(bookList, id)

    openModal('Деталі', '', element.id, true, element.name, true, element.publishDate, true,
        element.genres, true, element.authors, true
    )
}

function openEditModal(id) {
    let element = getElementById(bookList, id)

    openModal('Редагування', '<button name="submitButton" type="button" class="btn btn-warning" onclick="editBook()">Редагувати</button>',
        element.id, true, element.name, false, element.publishDate, false, element.genres, false, element.authors, false
    )
}

function openDeleteModal(id) {
    let element = getElementById(bookList, id)

    openModal('Видалення', '<button name="submitButton" type="button" class="btn btn-danger" onclick="deleteBook()">Видалити</button>',
        element.id, true, element.name, true, element.publishDate, true, element.genres, true, element.authors, true
    )
}

function openCreateModal() {
    openModal('Створення', '<button name="submitButton" type="button" class="btn btn-primary" onclick="createBook()">Створити</button>',
        '', true, '', false, '', false, [], false, [], false
    )
}

function openModal(textContent, html, idVal, isIDDisabled, nameVal, isNameDisabled,
    publishDateVal, isPublishDateDisabled, genresVal, isGenresDisabled, authorsVal, isAuthorsDisabled) {

    clearModalForm()
    fillModalForm(textContent, html, idVal, isIDDisabled, nameVal, isNameDisabled,
        publishDateVal, isPublishDateDisabled, genresVal, isGenresDisabled, authorsVal, isAuthorsDisabled)
}

function clearModalForm() {
    if (form.elements.submitButton) {
        form.elements.submitButton.remove()
    }

    authorsChoice.clearInput();
    authorsChoice.removeActiveItems();
    genresChoice.clearInput();
    genresChoice.removeActiveItems();
}

function fillModalForm(textContent, html, idVal, isIDDisabled, nameVal, isNameDisabled,
    publishDateVal, isPublishDateDisabled, genresVal, isGenresDisabled, authorsVal, isAuthorsDisabled) {

    modalTitle.textContent = textContent

    modalFooter.innerHTML += html

    form.elements.id.value = idVal
    form.elements.id.disabled = isIDDisabled
    form.elements.name.value = nameVal
    form.elements.name.disabled = isNameDisabled
    form.elements.publishDate.value = publishDateVal
    form.elements.publishDate.disabled = isPublishDateDisabled

    for (author of authorsVal) {
        authorsChoice.setChoiceByValue(author.id)
    }
    if (isAuthorsDisabled) {
        authorsChoice.disable()
    }
    else {
        authorsChoice.enable()
    }

    for (genre of genresVal) {
        genresChoice.setChoiceByValue(genre.id)
    }
    if (isGenresDisabled) {
        genresChoice.disable()
    }
    else {
        genresChoice.enable()
    }

    Modal.show()
}

async function loadGenres() {
    let response = await fetch(apiIP+'/api/Genres', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    if (response.ok) {
        let json = await response.json();
        fillGenresSelect(json)
    } else {
        showNotificationWithText(response.json())
    }
}

async function loadAuthors() {
    let response = await fetch(apiIP+'/api/Authors', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('Token')
        }
    })

    if (response.ok) {
        let json = await response.json();
        fillAuthorsSelect(json)

    } else {
        showNotificationWithText(response.json())
    }
}

function fillGenresSelect(genres) {
    genresChoice.clearStore()
    for (genre of genres) {
        genresChoice.setValue([{ value: genre.id, label: genre.name }])
    }
}

function fillAuthorsSelect(authors) {
    authorsChoice.clearStore()
    for (author of authors) {
        authorsChoice.setValue([{ value: author.id, label: author.fullName }])
    }
}

function getElementById(list, id) {
    for (obj of list) {
        if (obj.id === id) {
            return obj
        }
    }
}