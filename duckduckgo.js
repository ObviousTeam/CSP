function fetchDuck(search) {
    return fetch(`https://cors-proxy.byteoftech.net/https://html.duckduckgo.com/html/?q=${search}`)
    .then(response => {
        console.log(response.status)
        return response.text()
    })
    .then(data => {
        const parser = new DOMParser();
        const document = parser.parseFromString(data, 'text/html');

        const titles = document.querySelectorAll('h2.result__title a.result__a');
        const displayURL = document.querySelectorAll('div.result__extras__url a.result__url');
        const discriptions = document.querySelectorAll('#links div.links_main.links_deep.result__body a.result__snippet');

        information = {}
        console.log(titles)
        for(let i = 0; i < titles.length; i++) {
            information[titles[i].innerText] = {
                url: titles[i].href,
                ad: false,
                displayUrl: displayURL[i].innerText,
                description: discriptions[i].innerText,
            }
        }
        console.log(information)
        return information
    })
    .catch(error => console.log('Error:', error));
}