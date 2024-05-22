function fetchBing(search) {
    return fetch(`https://cors-proxy.byteoftech.net/https://www.bing.com/search?q=${search}`)
    .then(response => {
        console.log(response.status)
        return response.text()
    })
    .then(data => {
        const parser = new DOMParser();
        const document = parser.parseFromString(data, 'text/html');

        const titles = document.querySelectorAll('li.b_algo a');
        const displayURL = document.querySelectorAll('li.b_algo cite');
        const discriptions = document.querySelectorAll('li.b_algo div.b_caption');

        information = {}

        for(let i = 0; i < discriptions.length; i++) {
            information[titles[i].innerText] = {
                url: titles[i].href,
                ad: false,
                displayUrl: displayURL[i].innerText,
                description: discriptions[i].innerText,
            }
        }

        // Parse expanded ads
        try {
            const expandedAds = document.querySelectorAll('.deeplink_title');
            expandedAds.forEach(ad => {
                const title = ad.textContent;
                const link = ad.querySelector('a').href;
                information[title] = {
                    url: link,
                    ad: true,
                    displayUrl: null,
                    description: '',
                };
            });
        } catch (error) {
            console.error('Error parsing expanded ads:', error);
        }

        // Parse inline ads
        try {
            const inlineAds = document.querySelectorAll('.b_algo .b_vList.b_divsec .b_annooverride a');
            inlineAds.forEach(ad => {
                const title = ad.textContent;
                const link = ad.href;
                information[title] = {
                    url: link,
                    ad: true,
                    displayUrl: null,
                    description: '',
                };
            });
        } catch (error) {
            console.error('Error parsing inline ads:', error);
        }

        return information
    })
    .catch(error => console.log('Error:', error));
}